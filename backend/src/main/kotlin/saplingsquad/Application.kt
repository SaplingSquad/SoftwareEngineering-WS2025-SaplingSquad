package saplingsquad

import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier
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

    private val logger = LoggerFactory.getLogger(Application::class.java)

    @Bean
    fun corsConfigurer(): WebFluxConfigurer {
        logger.info("LOGGING LOL")
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
