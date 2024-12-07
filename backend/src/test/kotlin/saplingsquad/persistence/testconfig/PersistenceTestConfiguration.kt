package saplingsquad.persistence.testconfig

import org.springframework.boot.autoconfigure.EnableAutoConfiguration
import org.springframework.context.annotation.ComponentScan
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Import


@Retention(AnnotationRetention.RUNTIME)
@Target(AnnotationTarget.CLASS)
@MustBeDocumented

@Configuration
@EnableAutoConfiguration
@ComponentScan
@Import(R2dbcH2Configuration::class)
annotation class PersistenceTestConfiguration
