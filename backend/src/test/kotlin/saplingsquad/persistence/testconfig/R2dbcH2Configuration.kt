package saplingsquad.persistence.testconfig

import io.r2dbc.h2.H2ConnectionConfiguration
import io.r2dbc.h2.H2ConnectionFactory
import io.r2dbc.h2.H2ConnectionOption
import io.r2dbc.spi.ConnectionFactory
import org.komapper.dialect.h2.r2dbc.H2R2dbcDialect
import org.komapper.r2dbc.R2dbcDatabase
import org.komapper.spring.boot.autoconfigure.r2dbc.KomapperR2dbcAutoConfiguration
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.test.context.ContextConfiguration

/**
 * Configuration to configure necessary Beans for an H2 R2dbc Database connection
 * Mostly uses the autoconfiguration of komapper ([KomapperR2dbcAutoConfiguration]) and fills in the rest by hand
 */
@Configuration
@ContextConfiguration(classes = [KomapperR2dbcAutoConfiguration::class])
class R2dbcH2Configuration {
    /** Use H2 Dialect */
    @Bean
    fun komapperDialect() = H2R2dbcDialect()

    /** Use H2 named in-memory database */
    @Bean
    fun connectionFactory(): ConnectionFactory {
        val connectionFactory = H2ConnectionFactory(
            H2ConnectionConfiguration.builder()
                .inMemory("test")

                //https://github.com/spring-projects/spring-data-r2dbc/issues/269
                .property(H2ConnectionOption.DB_CLOSE_DELAY, "-1")

                //Postgres Compatibility http://www.h2database.com/html/features.html#compatibility
                .property(H2ConnectionOption.MODE, "PostgreSQL")
                .property("DATABASE_TO_LOWER", "TRUE")
                .property("DEFAULT_NULL_ORDERING", "HIGH")

                .build()
        )
        val db = R2dbcDatabase(connectionFactory = connectionFactory, dialect = H2R2dbcDialect())
        setupDb(db)
        return connectionFactory
    }
}