package saplingsquad.persistence

import kotlinx.coroutines.flow.Flow
import org.komapper.core.dsl.Meta
import org.komapper.core.dsl.QueryDsl
import org.komapper.r2dbc.R2dbcDatabase
import org.springframework.stereotype.Repository
import saplingsquad.persistence.tables.FilterTagEntity
import saplingsquad.persistence.tables.QuestionEntity
import saplingsquad.persistence.tables.filterTagEntity
import saplingsquad.persistence.tables.questionEntity
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
    suspend fun readById(id: Int): QuestionEntity? = db.runQuery {
        QueryDsl
            .from(Meta.questionEntity)
            .where { Meta.questionEntity.questionId eq id }
            .collect { flow ->
                flow.expectZeroOrOne()
            }
    }

    fun readAllTags(): Flow<FilterTagEntity> = db.flowQuery {
        QueryDsl
            .from(Meta.filterTagEntity)
    }
}