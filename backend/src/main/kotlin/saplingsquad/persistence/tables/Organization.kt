package saplingsquad.persistence.tables

import org.komapper.annotation.KomapperEmbedded
import org.komapper.annotation.KomapperEntity
import org.komapper.annotation.KomapperId
import org.komapper.annotation.KomapperTable

/**
 * The (expected) layout of the "organization" table in the DB
 * Represents a single row in the table.
 */
@KomapperEntity
@KomapperTable("organization")
data class OrganizationEntity(
    /** Unique ID of the Row */
    @KomapperId
    val orgId: Int,

    val name: String,

    val description: String,

    val foundingYear: Int,

    val memberCount: Int,

    val websiteUrl: String,

    val donationUrl: String,

    @KomapperEmbedded
    val coordinates: CoordinatesEmbedded,
)

@KomapperEntity
@KomapperTable("organization_tags")
data class OrganizationTagsEntity(
    /** ID of the Organization */
    @KomapperId
    val orgId: Int,
    /** ID of the Tag */
    @KomapperId
    val tagId: Int,
)
