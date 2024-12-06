package saplingsquad

import io.ktor.server.application.*
import org.komapper.r2dbc.R2dbcDatabase

class EmbeddedDBFactory : DatabaseFactory {
    override fun connectToDatabase(app: Application): R2dbcDatabase {
        return R2dbcDatabase(url = "r2dbc:h2:mem:///test;DB_CLOSE_DELAY=-1")
    }
}