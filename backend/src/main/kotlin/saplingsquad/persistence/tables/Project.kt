package saplingsquad.persistence.tables

import org.komapper.annotation.*
import java.time.LocalDate


typealias ProjectId = Int

/**
 * The (expected) layout of the "project" table in the DB
 * Represents a single row in the table.
 */
@KomapperEntity
@KomapperTable("project")
data class ProjectEntity(
    /** Unique ID of the Row */
    @KomapperAutoIncrement
    @KomapperId
    val projectId: ProjectId,

    val orgId: Int,

    val title: String,

    val description: String,

    val dateFrom: LocalDate?,

    val dateTo: LocalDate?,

    val websiteUrl: String?,

    val donationUrl: String?,

    @KomapperEmbedded
    val coordinates: CoordinatesEmbedded,
)

@KomapperEntity
@KomapperTable("project_tags")
data class ProjectTagsEntity(
    /** ID of the Organization */
    @KomapperId
    val projectId: ProjectId,
    /** ID of the Tag */
    @KomapperId
    val tagId: Int,
)