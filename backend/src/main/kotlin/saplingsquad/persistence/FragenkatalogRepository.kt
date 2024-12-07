package saplingsquad.persistence

import org.komapper.core.dsl.Meta
import org.komapper.core.dsl.QueryDsl
import org.komapper.r2dbc.R2dbcDatabase
import org.springframework.stereotype.Repository
import saplingsquad.persistence.tables.FrageEntity
import saplingsquad.persistence.tables.frageEntity

@Repository
class FragenkatalogRepository(private val db: R2dbcDatabase) {

    suspend fun readAll(): List<FrageEntity> = db.runQuery {
        QueryDsl.from(Meta.frageEntity)
    }

}