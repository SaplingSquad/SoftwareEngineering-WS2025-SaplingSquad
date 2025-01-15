package saplingsquad.persistence.testconfig

import org.springframework.boot.autoconfigure.EnableAutoConfiguration
import org.springframework.context.annotation.ComponentScan
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Import

/**
 * Annotation to use on Tests which want to use an H2 temporary Database.
 * - Enables Autoconfiguration, and starts a Component Scan in [saplingsquad.persistence.*][saplingsquad.persistence]
 * - Imports [R2dbcH2Configuration] for the H2 Database
 *
 * Must be in **this** package
 *
 * Could also be a Spring [@Configuration][Configuration], which one then [@Import][Import]s,
 * but that causes IntelliJ to complain (it doesn't analyze the annotations of @Import-ed Configurations and thus
 * isn't aware of the [ComponentScan])
 */
@Retention(AnnotationRetention.RUNTIME)
@Target(AnnotationTarget.CLASS)
@MustBeDocumented

@Configuration
@EnableAutoConfiguration
@ComponentScan
@Import(R2dbcH2Configuration::class)
annotation class PersistenceTestConfiguration