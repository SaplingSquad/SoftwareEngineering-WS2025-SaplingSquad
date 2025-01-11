package saplingsquad.persistence.tables

import org.komapper.annotation.*
import saplingsquad.komapper_ext.annotations.KomapperUnionEntity
import saplingsquad.komapper_ext.annotations.KomapperUnionTableName

typealias OrganizationId = Int;

/**
 * Copy of [OrganizationEntity] with 1 additional column ([regionName])
 * Return entity for the `organization_with_region_name` view
 */
@Suppress("unused")
@KomapperUnionTableName("organization_with_region_name")
@KomapperUnionEntity("OrganizationWithRegionEntity", [OrganizationEntity::class, OrgaWithRegionName::class])
private data class OrgaWithRegionName(
    val regionName: String
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