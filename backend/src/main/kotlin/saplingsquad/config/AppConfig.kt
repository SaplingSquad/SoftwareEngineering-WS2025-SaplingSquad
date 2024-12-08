package saplingsquad.config

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.boot.context.properties.bind.ConstructorBinding
import org.springframework.context.annotation.Configuration

/**
 * Spring config binding from application.yaml to Java objects for custom configuration
 * appconfig.* settings
 */
@ConfigurationProperties(prefix = "appconfig")
data class AppConfig @ConstructorBinding constructor(
    val openapi: OpenAPI,
    /** Access-Allow-Origin: * (for dev purposes)*/
    val allowWildcardCors: Boolean = false,
) {

    /** Configuration concerning OpenAPI */
    data class OpenAPI(
        /** Path/URL to the OpenAPI spec */
        val spec: String
    )

}

/**
 * Spring configuration to load the AppConfig bindings
 */
@Configuration
@EnableConfigurationProperties(AppConfig::class)
class AppConfigConfiguration