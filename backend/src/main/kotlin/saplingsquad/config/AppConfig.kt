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
    /** Path where the resources should be hosted **/
    val resourcesUrlPath: String,
    /** OAuth2 resource server configuration */
    val oauth2: Oauth2,
    /** Show token endpoints for dev purposes */
    val showTokenEndpoints: Boolean,
) {

    /** Configuration concerning OpenAPI */
    data class OpenAPI(
        /** Path/URL to the OpenAPI spec */
        val spec: String
    )

    data class Oauth2(
        /** Issuer configuration for the user authentication */
        val usersIssuer: Issuer,
        /** Issuer configuration for the organization authentication */
        val orgasIssuer: Issuer,
    )

    data class Issuer(
        val issuerUri: String
    )
}

/**
 * Spring configuration to load the AppConfig bindings
 */
@Configuration
@EnableConfigurationProperties(AppConfig::class)
class AppConfigConfiguration