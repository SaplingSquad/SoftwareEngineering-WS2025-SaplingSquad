package saplingsquad.persistence.tables

import org.komapper.annotation.*
import java.time.LocalDate


typealias ProjectId = Int

/**
 * The (expected) layout of the "project" table for retrieval
 * Represents a single row in the table.
 */
@KomapperEntity
@KomapperTable("project_with_region_name")
data class ProjectWithRegionEntity(
    /** Duplicate id to make it compile :( */
    @KomapperAutoIncrement
    @KomapperId
    val projectId: ProjectId,

    val regionName: String?,

    @KomapperEmbedded
    val rest: ProjectEntity
)

/**
 * The (expected) layout of the "project" table for insertion access
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

@KomapperEntity
@KomapperTable("project_bookmarks")
data class ProjectBookmarksEntity(
    /** Keycloak ID of the user account */
    @KomapperId
    val accountId: String,
    /** ID of the Project */
    @KomapperId
    val projectId: Int,
)