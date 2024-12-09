package saplingsquad.persistence.testconfig;

import io.r2dbc.h2.H2ConnectionFactory
import io.r2dbc.spi.ConnectionFactory
import org.komapper.dialect.h2.r2dbc.H2R2dbcDialect
import org.komapper.spring.boot.autoconfigure.r2dbc.KomapperR2dbcAutoConfiguration
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.test.context.ContextConfiguration

/**
 * Configuration to configure necessary Beans for a H2 R2dbc Database connection
 * Mostly uses the auto configuration of komapper ([KomapperR2dbcAutoConfiguration]) and fills in the rest by hand
 */
@Configuration
@ContextConfiguration(classes = [KomapperR2dbcAutoConfiguration::class])
class R2dbcH2Configuration {
    /** Use H2 Dialect */
    @Bean
    fun komapperDialect() = H2R2dbcDialect()

    /** Use H2 named in-memory database */
    @Bean
    fun connectionFactory(): ConnectionFactory = H2ConnectionFactory.inMemory("test")
}
