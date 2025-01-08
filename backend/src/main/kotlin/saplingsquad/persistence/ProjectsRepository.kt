package saplingsquad.persistence;

import kotlinx.coroutines.flow.Flow
import org.komapper.core.dsl.Meta
import org.komapper.core.dsl.QueryDsl
import org.komapper.core.dsl.query.bind
import org.komapper.r2dbc.R2dbcDatabase
import org.komapper.tx.core.TransactionProperty.IsolationLevel.SERIALIZABLE
import org.springframework.stereotype.Repository
import saplingsquad.persistence.tables.*
import saplingsquad.utils.atMostOne

typealias ProjectEntityAndTags = Pair<ProjectEntity, Set<TagId>>

@Repository
class ProjectsRepository(private val db: R2dbcDatabase) {

    suspend fun readProjects(answers: List<Int>): Flow<ProjectEntity> =
        db.flowQuery {
            filterByTagsSqlQuery(answers)
        }

    /**
     * Create a new project for a logged in organization account.
     * This method ignores [project.projectId][ProjectEntity.projectId] and [project.orgId][ProjectEntity.orgId]:
     * - `projectId` is always generated by the database
     * - `orgId` is derived from the [accountId] parameter
     * @return
     *  - [OrganizationNotRegisteredYet][ProjectCreateResult.OrganizationNotRegisteredYet]
     * if the org-account has never called the POST /organization endpoint to complete the registration
     *  - [Success][ProjectCreateResult.Success] (containing the ID of the newly created project) on success
     */
    suspend fun createProjectForAccount(accountId: String, project: ProjectEntity, tags: Set<TagId>) =
        db.withTransaction(transactionProperty = SERIALIZABLE) {
            val account =
                readOrgAccount(accountId) ?: return@withTransaction ProjectCreateResult.OrganizationNotRegisteredYet

            val p = Meta.projectEntity
            val projectId = db.runQuery {
                QueryDsl.insert(p)
                    .single(project.copy(orgId = account.orgId))
                    .returning(p.projectId)
            } ?: throw IllegalStateException("Insertion did not return a new id")

            insertTagsForProject(projectId, tags)
            ProjectCreateResult.Success(projectId)
        }

    /**
     * Read the list of projects belonging to the account's organization.
     * @return
     *  - [OrganizationNotRegisteredYet][ProjectsReadFromAccountResult.OrganizationNotRegisteredYet]
     * if the org-account has never called the POST /organization endpoint to complete the registration
     *  - [Success][ProjectsReadFromAccountResult.Success] (containing the ID of the newly created project) on success
     */
    suspend fun readProjectsByAccount(accountId: String): ProjectsReadFromAccountResult =
        db.withTransaction(transactionProperty = SERIALIZABLE) {
            val account = readOrgAccount(accountId)
                ?: return@withTransaction ProjectsReadFromAccountResult.OrganizationNotRegisteredYet
            val p = Meta.projectEntity
            val pTags = Meta.projectTagsEntity
            val projects = db.runQuery(
                QueryDsl.from(p)
                    .where { p.orgId eq account.orgId }
                    .leftJoin(pTags) {
                        p.projectId eq pTags.projectId
                    }.includeAll()
            )
            return@withTransaction ProjectsReadFromAccountResult.Success(
                projects.oneToMany(p, pTags)
                    .mapValues { it.value.mapTo(mutableSetOf<TagId>(), ProjectTagsEntity::tagId) }
                    .toList()
            )
        }

    private suspend fun insertTagsForProject(projectId: ProjectId, tags: Set<TagId>) {
        val pTag = Meta.projectTagsEntity
        db.runQuery {
            QueryDsl.insert(pTag)
                .multiple(tags.map { ProjectTagsEntity(projectId = projectId, tagId = it) })
        }
    }

    private suspend fun readOrgAccount(accountId: String): OrganizationAccountEntity? {
        val orgAcc = Meta.organizationAccountEntity
        val account = db.flowQuery {
            QueryDsl.from(orgAcc).where { orgAcc.accountId eq accountId }
        }.atMostOne()
        return account
    }

}

sealed class ProjectCreateResult {
    data class Success(val id: ProjectId) : ProjectCreateResult()
    data object OrganizationNotRegisteredYet : ProjectCreateResult()
}

sealed class ProjectsReadFromAccountResult {
    data class Success(val projects: List<ProjectEntityAndTags>) : ProjectsReadFromAccountResult()
    data object OrganizationNotRegisteredYet : ProjectsReadFromAccountResult()
}

private fun filterByTagsSqlQuery(answers: List<Int>) = QueryDsl
    .fromTemplate(
        """
        with tags_from_answers as (select distinct question.tag_id
                                   from question
                                            join filter_tag using (tag_id)
                                   where question_id in /*answers*/(1, 2, 3)),
             intersect_with_tags as (select project_tags.*
                                     from project_tags
                                              join tags_from_answers using (tag_id)),
             intersection_size as (select project.project_id, count(tag_id) as intersection_size
                                   from project
                                            left join intersect_with_tags using (project_id)
                                   group by project.project_id),
             with_rank as (select *, row_number() over (order by intersection_size desc) as rank
                           from intersection_size),
             min_filter_intersection_size as (select min(intersection_size)
                                              from with_rank
                                              where rank <= 3),
             result as (select project.*
                        from project
                                 join intersection_size using (project_id)
                        where intersection_size >= (select * from min_filter_intersection_size)
                        order by intersection_size desc)
        select *
        from result;
        """.trimIndent()
    )
    .bind("answers", answers)
    .selectAsEntity(Meta.projectEntity)
