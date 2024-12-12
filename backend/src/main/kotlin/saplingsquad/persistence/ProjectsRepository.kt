package saplingsquad.persistence;

import org.komapper.core.dsl.Meta
import org.komapper.core.dsl.QueryDsl
import org.komapper.r2dbc.R2dbcDatabase
import org.springframework.stereotype.Repository
import saplingsquad.persistence.tables.ProjectEntity
import saplingsquad.persistence.tables.projectEntity

@Repository
class ProjectsRepository(private val db: R2dbcDatabase) {

    suspend fun readProjects(): List<ProjectEntity> =
        db.runQuery {
            QueryDsl
                .from(Meta.projectEntity)
        }
}
