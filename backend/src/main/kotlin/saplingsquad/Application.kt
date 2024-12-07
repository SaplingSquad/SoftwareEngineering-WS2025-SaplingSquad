package saplingsquad

import org.slf4j.LoggerFactory
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.context.annotation.Bean
import org.springframework.web.reactive.config.CorsRegistry
import org.springframework.web.reactive.config.WebFluxConfigurer
import saplingsquad.config.AppConfig


@SpringBootApplication
class Application(
    val config: AppConfig
) {

    @Bean
    fun corsConfigurer(): WebFluxConfigurer {
        return object : WebFluxConfigurer {
            override fun addCorsMappings(registry: CorsRegistry) {
                if (config.allowWildcardCors) {
                    registry.addMapping("/**")
                        .allowedOrigins("*")
                        .allowedMethods("*")
                        .allowedHeaders("*")
                }
            }
        }
    }
}

fun main(args: Array<String>) {
    runApplication<Application>(*args)
}
