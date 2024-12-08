package saplingsquad.persistence

import org.komapper.core.dsl.Meta
import org.komapper.core.dsl.QueryDsl
import org.komapper.r2dbc.R2dbcDatabase
import org.springframework.stereotype.Repository
import saplingsquad.persistence.tables.FrageEntity
import saplingsquad.persistence.tables.frageEntity

/**
 * Persistence layer for everything concerning Fragenkatalog
 * Executes queries on the DB
 */
@Repository
class FragenkatalogRepository(private val db: R2dbcDatabase) {

    /**
     * Read all Questions from the DB
     */
    suspend fun readAll(): List<FrageEntity> = db.runQuery {
        QueryDsl.from(Meta.frageEntity)
    }

}