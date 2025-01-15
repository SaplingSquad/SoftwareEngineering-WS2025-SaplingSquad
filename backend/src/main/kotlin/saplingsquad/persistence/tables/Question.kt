package saplingsquad.persistence.tables

import org.komapper.annotation.KomapperEntity
import org.komapper.annotation.KomapperId
import org.komapper.annotation.KomapperTable

/** The type of a question's id column */
typealias QuestionId = Int

/**
 * The (expected) layout of the "question" table in the DB.
 * Represents a single row in the table.
 */
@KomapperEntity
@KomapperTable("question")
data class QuestionEntity(
    /** Unique ID of the Row */
    @KomapperId
    val questionId: QuestionId,
    /** The string title of the question */
    val questionTitle: String,
    /** The question string */
    val question: String,

    /** Url of the Question */
    val imageUrl: String?,

    /** Foreign key to the Tag associated with this Question (for filtering) */
    val tagId: Int
)

/**
 * The (expected) layout of the "user_answer" table in the DB.
 * Represents a single row in the table.
 */
@KomapperEntity
@KomapperTable("user_answer")
data class AnswerEntity(
    /** OIDC subject (of a user account) */
    @KomapperId
    val accountId: String,
    /** Id of a positively answered question*/
    @KomapperId
    val questionId: QuestionId,
)