package saplingsquad.persistence

import org.komapper.core.dsl.Meta
import org.komapper.core.dsl.QueryDsl
import org.komapper.r2dbc.R2dbcDatabase
import org.springframework.stereotype.Repository
import saplingsquad.persistence.tables.OrganizationEntity
import saplingsquad.persistence.tables.organizationEntity

@Repository
class OrganizationsRepository(private val db: R2dbcDatabase) {
    suspend fun readOrganizations(): List<OrganizationEntity> =
        db.runQuery {
            QueryDsl
                .from(Meta.organizationEntity)
        }
}