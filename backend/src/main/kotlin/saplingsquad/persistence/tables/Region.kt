package saplingsquad.persistence.tables

import org.komapper.annotation.KomapperEmbedded
import org.komapper.annotation.KomapperEntity
import org.komapper.annotation.KomapperId
import org.komapper.annotation.KomapperTable

/**
 * The (expected) layout of the "project" table in the DB
 * Represents a single row in the table.
 */
@KomapperEntity
@KomapperTable("region")
data class RegionEntity(
    /** Unique ID of the Row */
    @KomapperId
    val regionId: Int,

    val name: String,

    val description: String,

    @KomapperEmbedded
    val coordinates: CoordinatesEmbedded,
)
