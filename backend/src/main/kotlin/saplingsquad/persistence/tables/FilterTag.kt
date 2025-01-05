package saplingsquad.persistence.tables

import org.komapper.annotation.KomapperEntity
import org.komapper.annotation.KomapperId
import org.komapper.annotation.KomapperTable

/**
 * The (expected) layout of the "filter_tag" table in the DB.
 * Represents a single row in the table.
 */
@KomapperEntity
@KomapperTable("filter_tag")
data class FilterTagEntity(
    /** Unique ID of the Row */
    @KomapperId
    val tagId: Int,
    /** The string name of the tag */
    val name: String,
)
