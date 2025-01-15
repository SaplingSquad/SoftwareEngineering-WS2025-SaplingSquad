package saplingsquad.persistence

import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import org.komapper.core.dsl.Meta
import org.komapper.core.dsl.QueryDsl
import org.komapper.r2dbc.R2dbcDatabase
import org.komapper.tx.core.TransactionProperty
import org.springframework.stereotype.Repository
import saplingsquad.persistence.tables.*
import saplingsquad.utils.expectZeroOrOne

/**
 * Persistence layer for everything concerning Fragenkatalog
 * Executes queries on the DB
 */
@Repository
class QuestionsRepository(private val db: R2dbcDatabase) {

    /**
     * Read all Questions from the DB
     */
    suspend fun readAll(): List<QuestionEntity> = db.runQuery {
        QueryDsl.from(Meta.questionEntity)
    }

    /**
     * Read a single Question from the DB
     */
    suspend fun readById(id: Int): QuestionEntity? = db.flowQuery {
        QueryDsl
            .from(Meta.questionEntity)
            .where { Meta.questionEntity.questionId eq id }
    }.expectZeroOrOne()

    /**
     * Read all available filter tags from the DB
     */
    fun readAllTags(): Flow<FilterTagEntity> = db.flowQuery {
        QueryDsl
            .from(Meta.filterTagEntity)
    }

    /**
     * Overwrite a user's positive answers in the DB
     */
    suspend fun writeUserAnswers(accountId: String, positiveAnswers: Set<QuestionId>) =
        db.withTransaction(transactionProperty = TransactionProperty.IsolationLevel.SERIALIZABLE) {
            val a = Meta.answerEntity
            db.runQuery {
                QueryDsl.delete(a).where { a.accountId eq accountId }
            }
            db.runQuery {
                QueryDsl.insert(a).multiple(
                    positiveAnswers.map {
                        AnswerEntity(accountId, it)
                    }
                )
            }
            Unit
        }

    /**
     * Read positive answers of a user.
     */
    fun readUserAnswers(accountId: String): Flow<QuestionId> = db.flowQuery {
        val a = Meta.answerEntity
        QueryDsl.from(a).where { a.accountId eq accountId }
    }.map { it.questionId }
}