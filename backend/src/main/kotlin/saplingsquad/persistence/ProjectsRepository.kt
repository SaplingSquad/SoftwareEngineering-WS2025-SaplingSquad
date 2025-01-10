package saplingsquad.persistence;

import kotlinx.coroutines.flow.Flow
import org.komapper.core.dsl.Meta
import org.komapper.core.dsl.QueryDsl
import org.komapper.core.dsl.query.bind
import org.komapper.r2dbc.R2dbcDatabase
import org.komapper.tx.core.TransactionProperty.IsolationLevel.SERIALIZABLE
import org.springframework.stereotype.Repository
import saplingsquad.persistence.tables.*
import saplingsquad.utils.expectZeroOrOne

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
     *  - [OrganizationNotRegisteredYet][ProjectCrRdResult.OrganizationNotRegisteredYet]
     * if the org-account has never called the POST /organization endpoint to complete the registration
     *  - [Success][ProjectCrRdResult.Success] (containing the ID of the newly created project) on success
     */
    suspend fun createProjectForAccount(
        accountId: String,
        project: ProjectEntity,
        tags: Set<TagId>
    ): ProjectCrRdResult<Int> =
        db.withTransaction(transactionProperty = SERIALIZABLE) {
            val account =
                readOrgAccount(accountId) ?: return@withTransaction ProjectCrRdResult.OrganizationNotRegisteredYet

            val p = Meta.projectEntity
            val projectId = db.runQuery {
                QueryDsl.insert(p)
                    .single(project.copy(orgId = account.orgId))
                    .returning(p.projectId)
            } ?: throw IllegalStateException("Insertion did not return a new id")

            insertTagsForProject(projectId, tags)
            ProjectCrRdResult.Success(projectId)
        }

    /**
     * Read the list of projects belonging to the account's organization.
     * @return
     *  - [OrganizationNotRegisteredYet][ProjectCrRdResult.OrganizationNotRegisteredYet]
     * if the org-account has never called the POST /organization endpoint to complete the registration
     *  - [Success][ProjectCrRdResult.Success] (containing the list of projects) on success
     */
    suspend fun readProjectsByAccount(accountId: String): ProjectCrRdResult<List<ProjectEntityAndTags>> =
        db.withTransaction(transactionProperty = SERIALIZABLE) {
            val account = readOrgAccount(accountId)
                ?: return@withTransaction ProjectCrRdResult.OrganizationNotRegisteredYet
            val p = Meta.projectEntity
            val pTags = Meta.projectTagsEntity
            val projects = db.runQuery(
                QueryDsl.from(p)
                    .where { p.orgId eq account.orgId }
                    .leftJoin(pTags) {
                        p.projectId eq pTags.projectId
                    }.includeAll()
            )
            ProjectCrRdResult.Success(
                projects.oneToMany(p, pTags).toProjectEntitiesWithTags()
            )
        }

    /**
     * Update a single project belonging to the account's organization.
     * This method ignores [project.orgId][ProjectEntity.orgId]:
     * - `orgId` is derived from the [accountId] parameter
     * @return
     *  - [OrganizationNotRegisteredYet][ProjectUpdDelResult.OrganizationNotRegisteredYet]
     * if the org-account has never called the POST /organization endpoint to complete the registration
     *  - [NonExistentProjectId][ProjectUpdDelResult.NonExistentProjectId] if a project with this id does not exist
     *  - [ProjectDoesNotBelongtoAccount][ProjectUpdDelResult.ProjectDoesNotBelongToAccount] if a project with this id does not
     *  belong to this organization
     *  - [Success][ProjectUpdDelResult.Success] on success
     */
    suspend fun updateProjectOfAccount(
        accountId: String,
        project: ProjectEntity,
        tags: Set<TagId>
    ): ProjectUpdDelResult = db.withTransaction(transactionProperty = SERIALIZABLE) {
        val account =
            readOrgAccount(accountId) ?: return@withTransaction ProjectUpdDelResult.OrganizationNotRegisteredYet
        val p = Meta.projectEntity
        val pTags = Meta.projectTagsEntity

        val existingProject = db.flowQuery {
            QueryDsl.from(p)
                .where { p.projectId eq project.projectId }
        }.expectZeroOrOne() ?: return@withTransaction ProjectUpdDelResult.NonExistentProjectId

        if (existingProject.orgId != account.orgId) {
            return@withTransaction ProjectUpdDelResult.ProjectDoesNotBelongToAccount
        }

        db.runQuery {
            QueryDsl.delete(pTags).where { pTags.projectId eq project.projectId }
        }
        db.runQuery {
            QueryDsl.update(p)
                .single(project.copy(orgId = account.orgId))
        }
        insertTagsForProject(project.projectId, tags)
        ProjectUpdDelResult.Success
    }

    /**
     * Delete a project belonging to the account's organization.
     * @return
     *  - [OrganizationNotRegisteredYet][ProjectUpdDelResult.OrganizationNotRegisteredYet]
     * if the org-account has never called the POST /organization endpoint to complete the registration
     *  - [NonExistentProjectId][ProjectUpdDelResult.NonExistentProjectId] if a project with this id does not exist
     *  - [ProjectDoesNotBelongtoAccount][ProjectUpdDelResult.ProjectDoesNotBelongToAccount] if a project with this id
     *  does not belong to this organization
     *  - [Success][ProjectUpdDelResult.Success] on success
     */
    suspend fun deleteProjectOfAccount(accountId: String, projectId: ProjectId) =
        db.withTransaction(transactionProperty = SERIALIZABLE) {
            val account =
                readOrgAccount(accountId) ?: return@withTransaction ProjectUpdDelResult.OrganizationNotRegisteredYet
            val p = Meta.projectEntity
            val pTags = Meta.projectTagsEntity

            val existingProject = db.flowQuery {
                QueryDsl.from(p)
                    .where { p.projectId eq projectId }
            }.expectZeroOrOne() ?: return@withTransaction ProjectUpdDelResult.NonExistentProjectId

            if (existingProject.orgId != account.orgId) {
                return@withTransaction ProjectUpdDelResult.ProjectDoesNotBelongToAccount
            }

            db.runQuery {
                QueryDsl.delete(pTags).where { pTags.projectId eq projectId }
            }
            db.runQuery {
                QueryDsl.delete(p).where { p.projectId eq projectId }
            }
            ProjectUpdDelResult.Success
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
        }.expectZeroOrOne()
        return account
    }

}

sealed class ProjectCrRdResult<out T> {
    data class Success<T>(val value: T) : ProjectCrRdResult<T>()
    data object OrganizationNotRegisteredYet : ProjectCrRdResult<Nothing>()
}

enum class ProjectUpdDelResult {
    Success,
    OrganizationNotRegisteredYet,
    NonExistentProjectId,
    ProjectDoesNotBelongToAccount,
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

fun Map<ProjectEntity, Set<ProjectTagsEntity>>.toProjectEntitiesWithTags(): List<ProjectEntityAndTags> {
    return this.mapValues { it.value.mapTo(mutableSetOf(), ProjectTagsEntity::tagId) }
        .toList()
}