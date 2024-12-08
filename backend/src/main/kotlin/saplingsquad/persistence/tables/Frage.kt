package saplingsquad.persistence.tables

import org.komapper.annotation.KomapperEntity
import org.komapper.annotation.KomapperId
import org.komapper.annotation.KomapperTable

/**
 * The (expected) layout of the "frage" table in the DB.
 * Represents a single row in the table.
 */
@KomapperEntity
@KomapperTable("frage")
data class QuestionEntity(
    /** Unique ID of the Row */
    @KomapperId
    val id: Int,
    /** The question string */
    val frage: String,
    /** Foreign key to the Tag associated with this Question (for filtering) */
    val tag: Int
)