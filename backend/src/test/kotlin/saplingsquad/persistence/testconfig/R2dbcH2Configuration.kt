package saplingsquad.persistence.testconfig;

import io.r2dbc.h2.H2ConnectionFactory
import io.r2dbc.spi.ConnectionFactory
import org.komapper.dialect.h2.r2dbc.H2R2dbcDialect
import org.komapper.spring.boot.autoconfigure.r2dbc.KomapperR2dbcAutoConfiguration
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.test.context.ContextConfiguration

@Configuration
@ContextConfiguration(classes = [KomapperR2dbcAutoConfiguration::class])
class R2dbcH2Configuration {
    @Bean
    fun komapperDialect() = H2R2dbcDialect()

    @Bean
    fun connectionFactory(): ConnectionFactory = H2ConnectionFactory.inMemory("test")
}
