package saplingsquad.config

import org.springdoc.core.properties.SwaggerUiConfigProperties
import org.springframework.context.annotation.Configuration
import org.springframework.web.reactive.config.CorsRegistry
import org.springframework.web.reactive.config.EnableWebFlux
import org.springframework.web.reactive.config.ResourceHandlerRegistry
import org.springframework.web.reactive.config.WebFluxConfigurer

/**
 * Spring configuration for various settings of Spring webflux
 */
@EnableWebFlux
@Configuration
class WebFluxConfig(
    /** This Configuration depends on some custom configuration properties*/
    val config: AppConfig,
    val swaggerUiConfig: SwaggerUiConfigProperties
) : WebFluxConfigurer {
    override fun addResourceHandlers(registry: ResourceHandlerRegistry) {
        super.addResourceHandlers(registry)
        val trimmedResources = config.resourcesUrlPath.trim('/')
        val trimmedSwaggerConfig = swaggerUiConfig.url.trim('/')
        registry
            .addResourceHandler(
                "/${trimmedResources}/**", // /api/rsc/example/file.txt -> /static/example/file.txt
                "/${trimmedSwaggerConfig}") // /api/spec.yaml -> /static/api/spec.yaml
            .addResourceLocations("classpath:/static/")
    }

    override fun addCorsMappings(registry: CorsRegistry) {
        if (config.allowWildcardCors) {
            registry.addMapping("/**")
                .allowedOrigins("*")
                .allowedMethods("*")
                .allowedHeaders("*")
        }
    }
}