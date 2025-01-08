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