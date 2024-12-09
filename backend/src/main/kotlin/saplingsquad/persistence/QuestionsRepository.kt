package saplingsquad.persistence

import org.komapper.core.dsl.Meta
import org.komapper.core.dsl.QueryDsl
import org.komapper.core.dsl.query.single
import org.komapper.r2dbc.R2dbcDatabase
import org.springframework.stereotype.Repository
import saplingsquad.persistence.tables.QuestionEntity
import saplingsquad.persistence.tables.questionEntity

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
    suspend fun readById(id: Int): QuestionEntity = db.runQuery {
        QueryDsl
            .from(Meta.questionEntity)
            .where { Meta.questionEntity.id eq id }
            .single()
    }

}