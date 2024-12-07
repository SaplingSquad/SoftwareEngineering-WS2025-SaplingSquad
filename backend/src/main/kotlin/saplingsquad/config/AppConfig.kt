package saplingsquad.config

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.boot.context.properties.bind.ConstructorBinding
import org.springframework.context.annotation.Configuration

@ConfigurationProperties(prefix = "appconfig")
data class AppConfig @ConstructorBinding constructor(
    val openapi: OpenAPI,
    val allowWildcardCors: Boolean = false,
) {

    data class OpenAPI(
        val spec: String
    )

}

@Configuration
@EnableConfigurationProperties(AppConfig::class)
class AppConfigConfiguration