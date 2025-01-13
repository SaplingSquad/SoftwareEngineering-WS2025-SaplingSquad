package saplingsquad.persistence

import org.komapper.core.dsl.Meta
import org.komapper.core.dsl.QueryDsl
import org.komapper.r2dbc.R2dbcDatabase
import org.springframework.stereotype.Repository
import saplingsquad.persistence.tables.ContinentEntity
import saplingsquad.persistence.tables.RegionEntity
import saplingsquad.persistence.tables.continentEntity
import saplingsquad.persistence.tables.regionEntity

@Repository
class RegionsRepository(private val db: R2dbcDatabase) {
    suspend fun readRegions(): List<Pair<ContinentEntity, List<RegionEntity>>> {
        val c = Meta.continentEntity
        val continents = db.runQuery(QueryDsl.from(c).orderBy(c.continent))

        val r = Meta.regionEntity
        val regions = db.runQuery {
            QueryDsl.from(r).orderBy(r.name)
        }.groupBy { it.continentId }

        val empty = emptyList<RegionEntity>()
        return continents.map {
            it to regions.getOrDefault(it.continentId, empty)
        }
    }
}
