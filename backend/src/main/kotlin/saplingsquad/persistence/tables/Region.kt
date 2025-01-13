package saplingsquad.persistence.tables

import org.komapper.annotation.KomapperColumn
import org.komapper.annotation.KomapperEntity
import org.komapper.annotation.KomapperId
import org.komapper.annotation.KomapperTable

typealias RegionId = String
typealias ContinentId = String

@KomapperTable("regions")
@KomapperEntity
data class RegionEntity(
    @KomapperId
    val regionId: RegionId,
    val name: String,
    val continentId: ContinentId,
    val continent: String,
)

@KomapperTable("region_continents")
@KomapperEntity
data class ContinentEntity(
    @KomapperId
    val continentId: ContinentId,
    val continent: String,
)
