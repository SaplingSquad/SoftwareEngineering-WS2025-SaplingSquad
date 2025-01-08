package saplingsquad.persistence

import kotlinx.coroutines.flow.Flow
import org.komapper.core.dsl.Meta
import org.komapper.core.dsl.QueryDsl
import org.komapper.r2dbc.R2dbcDatabase
import org.springframework.stereotype.Repository
import saplingsquad.persistence.tables.OrganizationBookmarksEntity
import saplingsquad.persistence.tables.ProjectBookmarksEntity
import saplingsquad.persistence.tables.organizationBookmarksEntity
import saplingsquad.persistence.tables.projectBookmarksEntity

/**
 * Persistence layer for bookmarks
 * Executes queries on the DB
 */
@Repository
class BookmarksRepository(private val db: R2dbcDatabase) {
    /**
     * Insert a bookmark for a project for the given user ID
     */
    suspend fun insertProjectBookmark(userId: String, projectId: Int): ProjectBookmarksEntity? {
        return db.runQuery {
            QueryDsl.insert(Meta.projectBookmarksEntity)
                .onDuplicateKeyIgnore()
                .executeAndGet(ProjectBookmarksEntity(userId, projectId))
        }
    }

    /**
     * Insert a bookmark for an organization for the given user ID
     */
    suspend fun insertOrganizationBookmark(userId: String, projectId: Int): OrganizationBookmarksEntity? {
        return db.runQuery {
            QueryDsl.insert(Meta.organizationBookmarksEntity)
                .onDuplicateKeyIgnore()
                .executeAndGet(OrganizationBookmarksEntity(userId, projectId))
        }
    }

    /**
     * Read all project bookmarks for the given user ID
     */
    suspend fun readProjectBookmarks(userId: String): Flow<ProjectBookmarksEntity> = db.flowQuery {
        val p = Meta.projectBookmarksEntity
        QueryDsl.from(p).where { p.accountId eq userId }
    }

    /**
     * Read all organization bookmarks for the given user ID
     */
    suspend fun readOrganizationBookmarks(userId: String): Flow<OrganizationBookmarksEntity> = db.flowQuery {
        val o = Meta.organizationBookmarksEntity
        QueryDsl.from(o).where { o.accountId eq userId }
    }
}