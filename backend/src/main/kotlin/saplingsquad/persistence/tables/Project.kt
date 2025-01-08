package saplingsquad.persistence.tables

import org.komapper.annotation.KomapperEmbedded
import org.komapper.annotation.KomapperEntity
import org.komapper.annotation.KomapperId
import org.komapper.annotation.KomapperTable
import java.time.LocalDate

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
    val projectId: Int,
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