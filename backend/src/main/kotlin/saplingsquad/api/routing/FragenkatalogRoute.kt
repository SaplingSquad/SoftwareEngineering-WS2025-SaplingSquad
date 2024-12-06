package saplingsquad.api.routing

import io.ktor.http.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import saplingsquad.DatabaseConnection
import saplingsquad.api.service.FragenkatalogService
import saplingsquad.persistence.tables.FragenkatalogRepository

fun Route.fragenkatalogRoutes() {
    val database = DatabaseConnection.connection(application)
    val service = FragenkatalogService(FragenkatalogRepository(database))

    get("/") {
        val alleFragen = service.readAll()
        call.respond(HttpStatusCode.OK, alleFragen)
    }
}
