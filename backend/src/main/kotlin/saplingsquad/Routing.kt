package saplingsquad

import io.ktor.server.application.*
import io.ktor.server.routing.*
import saplingsquad.api.routing.fragenkatalogRoutes

fun Application.configureRouting() {
    routing {
        route("/fragenkatalog") {
            fragenkatalogRoutes()
        }
    }
}
