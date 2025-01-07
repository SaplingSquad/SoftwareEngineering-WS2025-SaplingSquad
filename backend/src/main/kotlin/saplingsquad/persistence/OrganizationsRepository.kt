package saplingsquad.persistence

import kotlinx.coroutines.flow.Flow
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


@Repository
class OrganizationsRepository(private val db: R2dbcDatabase) {
    suspend fun readOrganizations(answers: List<Int>): Flow<OrganizationEntity> {
        return db.flowQuery {
            filterByTagsSqlQuery(answers)
        }
    }

    suspend fun tryRegisterOrganization(
        accountId: String,
        organization: OrganizationEntity
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
            }!!

            db.runQuery {
                QueryDsl.insert(orgAcc)
                    .single(OrganizationAccountEntity(accountId = accountId, orgId = orgId, verified = false))
            }

            OrganizationRegisterResult.Success(orgId)
        }

    suspend fun updateOrganizationOfAccount(
        accountId: String,
        organization: OrganizationEntity
    ): OrganizationUpdateResult =
        db.withTransaction(transactionProperty = TransactionProperty.IsolationLevel.SERIALIZABLE) {
            val org = Meta.organizationEntity
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
            OrganizationUpdateResult.Success
        }

    suspend fun readOrganizationOfAccount(accountId: String): OrganizationEntity? {
        val org = Meta.organizationEntity
        val orgAcc = Meta.organizationAccountEntity
        return db.flowQuery {
            QueryDsl.from(org)
                .innerJoin(orgAcc, on { org.orgId eq orgAcc.orgId })
                .where { orgAcc.accountId eq accountId }
        }.atMostOne()
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
