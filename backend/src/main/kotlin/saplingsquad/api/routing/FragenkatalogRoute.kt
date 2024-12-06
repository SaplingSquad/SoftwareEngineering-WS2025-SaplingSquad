package saplingsquad.api.routing

import io.ktor.http.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import saplingsquad.api.service.FragenkatalogService

fun Route.fragenkatalogRoutes(service: FragenkatalogService) {

    get("/") {
        val alleFragen = service.readAll()
        call.respond(HttpStatusCode.OK, alleFragen)
    }
}
