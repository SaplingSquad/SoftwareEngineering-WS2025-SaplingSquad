package saplingsquad.persistence.tables

import org.komapper.annotation.KomapperEntity
import org.komapper.annotation.KomapperId
import org.komapper.annotation.KomapperTable

/**
 * The (expected) layout of the orga_account table in the DB
 * Represents a single row in the table
 */
@KomapperEntity
@KomapperTable("orga_account")
data class OrganizationAccountEntity(

    @KomapperId
    val accountId: String,

    val orgId: OrganizationId,

    val verified: Boolean
)