package saplingsquad.persistence.tables

import org.komapper.annotation.*

typealias OrganizationId = Int;

/**
 * The (expected) layout of the "organization" table for retrieval
 * Represents a single row in the table.
 */
@KomapperEntity
@KomapperTable("organization")
data class OrganizationWithRegionEntity(
    /** Duplicate id to make it compile :( */
    @KomapperAutoIncrement
    @KomapperId
    val orgId: OrganizationId,

    val regionName: String?,

    @KomapperEmbedded
    val rest: OrganizationEntity
)

/**
 * The (expected) layout of the "organization" table for insertion access
 * Represents a single row in the table.
 */
@KomapperEntity
@KomapperTable("organization")
data class OrganizationEntity(
    /** Unique ID of the Row */
    @KomapperAutoIncrement
    @KomapperId
    val orgId: OrganizationId,

    val name: String,

    val description: String,

    val foundingYear: Int?,

    val memberCount: Int?,

    val websiteUrl: String,

    val donationUrl: String?,

    @KomapperEmbedded
    val coordinates: CoordinatesEmbedded,
)

@KomapperEntity
@KomapperTable("organization_tags")
data class OrganizationTagsEntity(
    /** ID of the Organization */
    @KomapperId
    val orgId: OrganizationId,
    /** ID of the Tag */
    @KomapperId
    val tagId: Int,
)

@KomapperEntity
@KomapperTable("organization_bookmarks")
data class OrganizationBookmarksEntity(
    /** Keycloak ID of the user account */
    @KomapperId
    val accountId: String,
    /** ID of the Organization */
    @KomapperId
    val orgId: Int,
)