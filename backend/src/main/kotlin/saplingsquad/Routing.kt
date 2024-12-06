package saplingsquad

import com.atlassian.oai.validator.OpenApiInteractionValidator
import io.ktor.server.application.*
import io.ktor.server.plugins.doublereceive.*
import io.ktor.server.plugins.openapi.*
import io.ktor.server.routing.*
import org.komapper.r2dbc.R2dbcDatabase
import saplingsquad.api.routing.fragenkatalogRoutes
import saplingsquad.api.service.FragenkatalogService
import saplingsquad.persistence.FragenkatalogRepository

fun Application.configureRouting(fragenkatalogService: FragenkatalogService) {
    install(IgnoreTrailingSlash)
    routing {
        install(DoubleReceive)
        install(OpenApiValidatePlugin.specUrl(environment.config.property("openapi.spec").getString()));
        openAPI("openapi", swaggerFile = environment.config.property("openapi.spec").getString())
        route("/fragenkatalog") {
            fragenkatalogRoutes(fragenkatalogService)
        }
    }
}
