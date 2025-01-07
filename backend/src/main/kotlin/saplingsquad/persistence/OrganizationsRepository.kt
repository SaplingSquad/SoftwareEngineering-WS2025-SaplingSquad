package saplingsquad.persistence

import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.toList
import kotlinx.coroutines.flow.toSet
import org.komapper.core.dsl.Meta
import org.komapper.core.dsl.QueryDsl
import org.komapper.core.dsl.query.bind
import org.komapper.core.dsl.query.firstOrNull
import org.komapper.core.dsl.query.map
import org.komapper.core.dsl.query.on
import org.komapper.r2dbc.R2dbcDatabase
import org.komapper.tx.core.TransactionProperty
import org.springframework.stereotype.Repository
import saplingsquad.persistence.tables.*
import saplingsquad.utils.atMostOne

typealias OrganizationEntityAndTags = Pair<OrganizationEntity, Set<TagId>>

data class OrganizationEntityProjectIdsAndTags(
    val org: OrganizationEntity,
    val tags: Set<TagId>,
    val projectIds: List<ProjectId>
)

@Repository
class OrganizationsRepository(private val db: R2dbcDatabase) {
    fun readOrganizations(answers: List<Int>): Flow<OrganizationEntity> {
        return db.flowQuery {
            filterByTagsSqlQuery(answers)
        }
    }

    suspend fun readOrganizationAndTagsAndProjectsById(organizationId: OrganizationId): OrganizationEntityProjectIdsAndTags? =
        db.withTransaction {
            val org = readOrganizationById(organizationId) ?: return@withTransaction null

            val orgTags = Meta.organizationTagsEntity

            val tags = db.flowQuery {
                QueryDsl.from(orgTags).where { orgTags.orgId eq organizationId }
            }.map { it.tagId }.toSet()

            val proj = Meta.projectEntity
            val projectIds = db.flowQuery {
                QueryDsl.from(proj).where { proj.orgId eq organizationId }
            }.map { it.projectId }.toList()

            return@withTransaction OrganizationEntityProjectIdsAndTags(org, tags, projectIds)
        }

    suspend fun tryRegisterOrganization(
        accountId: String,
        organization: OrganizationEntity,
        tags: Set<TagId>,
    ): OrganizationRegisterResult =
        db.withTransaction(transactionProperty = TransactionProperty.IsolationLevel.SERIALIZABLE) {
            val org = Meta.organizationEntity
            val orgAcc = Meta.organizationAccountEntity
            val exists =
                db.runQuery {
                    QueryDsl.from(orgAcc)
                        .where { orgAcc.accountId eq accountId }
                        .firstOrNull()
                        .map { it != null }
                }
            if (exists) {
                return@withTransaction OrganizationRegisterResult.AlreadyRegistered
            }
            val orgId = db.runQuery {
                QueryDsl.insert(org)
                    .single(organization)
                    .returning(org.orgId)
            } ?: throw IllegalStateException("Insertion did not return a new id")

            db.runQuery {
                QueryDsl.insert(orgAcc)
                    .single(OrganizationAccountEntity(accountId = accountId, orgId = orgId, verified = false))
            }

            insertTagsForOrganization(orgId, tags)

            OrganizationRegisterResult.Success(orgId)
        }

    suspend fun updateOrganizationOfAccount(
        accountId: String,
        organization: OrganizationEntity,
        tags: Set<TagId>,
    ): OrganizationUpdateResult =
        db.withTransaction(transactionProperty = TransactionProperty.IsolationLevel.SERIALIZABLE) {
            val org = Meta.organizationEntity
            val orgTags = Meta.organizationTagsEntity
            val existing = readOrganizationOfAccount(accountId)
                ?: return@withTransaction OrganizationUpdateResult.NoOrganizationRegsitered
            if (existing.orgId != organization.orgId) {
                return@withTransaction OrganizationUpdateResult.WrongOrganizationId
            }
            db.runQuery {
                QueryDsl
                    .update(org)
                    .single(organization)
            }
            db.runQuery {
                QueryDsl.delete(orgTags).where { orgTags.orgId eq existing.orgId }
            }
            insertTagsForOrganization(existing.orgId, tags)
            OrganizationUpdateResult.Success
        }

    suspend fun readOrganizationAndTagsOfAccount(accountId: String): OrganizationEntityAndTags? =
        db.withTransaction(transactionProperty = TransactionProperty.IsolationLevel.SERIALIZABLE) {
            val organization = readOrganizationOfAccount(accountId) ?: return@withTransaction null

            val orgTags = Meta.organizationTagsEntity
            val tags = db.flowQuery {
                QueryDsl.from(orgTags).where {
                    orgTags.orgId eq organization.orgId
                }
            }.map { it.tagId }.toSet()

            return@withTransaction organization to tags
        }

    private suspend fun readOrganizationOfAccount(accountId: String): OrganizationEntity? {
        val org = Meta.organizationEntity
        val orgAcc = Meta.organizationAccountEntity
        return db.flowQuery {
            QueryDsl.from(org)
                .innerJoin(orgAcc, on { org.orgId eq orgAcc.orgId })
                .where { orgAcc.accountId eq accountId }
        }.atMostOne()
    }

    private suspend fun readOrganizationById(organizationId: OrganizationId): OrganizationEntity? {
        val org = Meta.organizationEntity
        return db.flowQuery {
            QueryDsl.from(org)
                .where { org.orgId eq organizationId }
        }.atMostOne()
    }

    private suspend fun insertTagsForOrganization(orgId: OrganizationId, tags: Set<TagId>) {
        val orgTag = Meta.organizationTagsEntity
        db.runQuery {
            QueryDsl.insert(orgTag)
                .multiple(tags.map { OrganizationTagsEntity(orgId = orgId, tagId = it) })
        }
    }
}

sealed class OrganizationRegisterResult {
    data class Success(val id: OrganizationId) : OrganizationRegisterResult()
    data object AlreadyRegistered : OrganizationRegisterResult()
}

enum class OrganizationUpdateResult {
    Success,
    NoOrganizationRegsitered,
    WrongOrganizationId
}

private fun filterByTagsSqlQuery(answers: List<Int>) = QueryDsl
    .fromTemplate(
        """
        with tags_from_answers as (select distinct question.tag_id
                                   from question
                                            join filter_tag using (tag_id)
                                   where question_id in /*answers*/(1, 2, 3)),
             intersect_with_tags as (select organization_tags.*
                                     from organization_tags
                                              join tags_from_answers using (tag_id)),
             intersection_size as (select organization.org_id, count(tag_id) as intersection_size
                                   from organization
                                            left join intersect_with_tags using (org_id)
                                   group by organization.org_id),
             with_rank as (select *, row_number() over (order by intersection_size desc) as rank
                           from intersection_size),
             min_filter_intersection_size as (select min(intersection_size)
                                              from with_rank
                                              where rank <= 3),
             result as (select organization.*
                        from organization
                                 join intersection_size using (org_id)
                        where intersection_size >= (select * from min_filter_intersection_size)
                        order by intersection_size desc)
        select *
        from result;
        """.trimIndent()
    )
    .bind("answers", answers)
    .selectAsEntity(Meta.organizationEntity)
