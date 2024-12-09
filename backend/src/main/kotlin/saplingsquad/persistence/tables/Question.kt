package saplingsquad.persistence.tables

import org.komapper.annotation.KomapperEntity
import org.komapper.annotation.KomapperId
import org.komapper.annotation.KomapperTable

/**
 * The (expected) layout of the "question" table in the DB.
 * Represents a single row in the table.
 */
@KomapperEntity
@KomapperTable("question")
data class QuestionEntity(
    /** Unique ID of the Row */
    @KomapperId
    val id: Int,
    /** The question string */
    val question: String,

    /** Url of the Question */
    val imageUrl: String?,

    /** Foreign key to the Tag associated with this Question (for filtering) */
    val tag: Int
)