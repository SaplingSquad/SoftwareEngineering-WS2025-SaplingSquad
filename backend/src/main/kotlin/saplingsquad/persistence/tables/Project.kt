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
@KomapperTable("project")
data class ProjectEntity(
    /** Unique ID of the Row */
    @KomapperId
    val projectId: Int,

    val orgId: Int,

    val title: String,

    val description: String,

    @KomapperEmbedded
    val coordinates: CoordinatesEmbedded,
)

@KomapperEntity
@KomapperTable("project_tags")
data class ProjectTagsEntity(
    /** ID of the Organization */
    @KomapperId
    val projectId: Int,
    /** ID of the Tag */
    @KomapperId
    val tagId: Int,
)