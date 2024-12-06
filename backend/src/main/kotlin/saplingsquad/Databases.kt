package saplingsquad

import io.ktor.server.application.*
import io.r2dbc.spi.ConnectionFactoryOptions
import org.komapper.r2dbc.R2dbcDatabase

class DatabaseConnection(private val factory: DatabaseFactory) {
    private var dbConnection: R2dbcDatabase? = null

    fun connection(application: Application): R2dbcDatabase {
        if (dbConnection == null) {
            dbConnection = factory.connectToDatabase(application)
        }
        return dbConnection!!
    }
}

class PostgreSQLFactory : DatabaseFactory {
    /**
     * Makes a connection to a Postgres database.
     *
     * In order to connect to your running Postgres process,
     * please specify the following parameters in your configuration file:
     * - postgres.url -- Url of your running database process.
     * - postgres.user -- Username for database connection
     * - postgres.password -- Password for database connection
     *
     * If you don't have a database process running yet, you may need to [download]((https://www.postgresql.org/download/))
     * and install Postgres and follow the instructions [here](https://postgresapp.com/).
     * Then, you would be able to edit your url,  which is usually "jdbc:postgresql://host:port/database", as well as
     * user and password values.
     *
     *
     * @return [R2dbcDatabase] that represent connection to the database.
     * */
    override fun connectToDatabase(app: Application): R2dbcDatabase {
        val environment = app.environment
        val log = app.log

        Class.forName("org.postgresql.Driver")
        val url = environment.config.property("postgres.url").getString()
        log.info("Connecting to postgres database at $url")
        val user = environment.config.property("postgres.user").getString()
        val password = environment.config.property("postgres.password").getString()

        val options = ConnectionFactoryOptions.builder()
            .from(ConnectionFactoryOptions.parse(url))
            .option(ConnectionFactoryOptions.USER, user)
            .option(ConnectionFactoryOptions.PASSWORD, password)
            .build()

        return R2dbcDatabase(options)
    }

}

interface DatabaseFactory {
    fun connectToDatabase(app: Application): R2dbcDatabase
}