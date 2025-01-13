package saplingsquad.persistence.tables

import org.komapper.annotation.KomapperColumn
import org.komapper.annotation.KomapperEntity
import org.komapper.annotation.KomapperId
import org.komapper.annotation.KomapperTable

@KomapperTable("regions")
@KomapperEntity
data class RegionEntity(
    @KomapperId
    val regionId: String,
    val name: String,
    val continentId: String,
    val continent: String,
)

@KomapperTable("region_continents")
@KomapperEntity
data class ContinentEntity(
    @KomapperId
    val continentId: String,
    val continent: String,
)
