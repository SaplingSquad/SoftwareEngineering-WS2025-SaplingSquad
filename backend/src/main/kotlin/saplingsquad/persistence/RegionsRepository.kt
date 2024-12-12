package saplingsquad.persistence

import org.komapper.core.dsl.Meta
import org.komapper.core.dsl.QueryDsl
import org.komapper.r2dbc.R2dbcDatabase
import org.springframework.stereotype.Repository
import saplingsquad.persistence.tables.RegionEntity
import saplingsquad.persistence.tables.regionEntity

@Repository
class RegionsRepository(private val db: R2dbcDatabase) {

    suspend fun readRegions(): List<RegionEntity> =
        db.runQuery {
            QueryDsl
                .from(Meta.regionEntity)
        }
}
