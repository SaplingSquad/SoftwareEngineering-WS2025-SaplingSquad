package saplingsquad.persistence.tables

import org.komapper.annotation.*
import saplingsquad.komapper_ext.annotations.KomapperUnionEntity
import saplingsquad.komapper_ext.annotations.KomapperUnionTableName
import java.time.LocalDate


typealias ProjectId = Int

/**
 * Copy of [ProjectEntity] with 1 additional column ([regionName])
 * Return entity for the `project_with_region_name` view
 */
@KomapperUnionTableName("project_with_region_name")
@KomapperUnionEntity("ProjectWithRegionEntity", [ProjectEntity::class, ProjectWithRegionName::class])
private data class ProjectWithRegionName(
    val regionName: String?,
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