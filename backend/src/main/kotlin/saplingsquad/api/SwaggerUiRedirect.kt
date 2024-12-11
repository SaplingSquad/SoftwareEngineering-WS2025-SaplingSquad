package saplingsquad.api

import org.springdoc.core.properties.SwaggerUiConfigProperties
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Bean
import org.springframework.stereotype.Controller
import org.springframework.web.reactive.function.server.RequestPredicates.GET
import org.springframework.web.reactive.function.server.RouterFunction
import org.springframework.web.reactive.function.server.RouterFunctions.route
import org.springframework.web.reactive.function.server.ServerResponse
import java.net.URI

@Controller
class SwaggerUiRedirect(@Autowired val swaggerUiConfig: SwaggerUiConfigProperties) {

    /**
     * Allow to open localhost:9000/ in browser to open swagger ui
     * code-generated HomeController redirects to /swagger-ui.html => redirect further
     */
    @Bean
    fun swaggerUi(): RouterFunction<ServerResponse> =
        route(GET("/swagger-ui.html")) {
            ServerResponse.temporaryRedirect(URI.create(swaggerUiConfig.path)).build()
        }
}