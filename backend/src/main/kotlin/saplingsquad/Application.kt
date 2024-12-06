package saplingsquad

import io.ktor.server.application.*
import io.ktor.server.plugins.calllogging.*
import saplingsquad.api.service.FragenkatalogService
import saplingsquad.api.service.FragenkatalogServiceImpl
import saplingsquad.persistence.FragenkatalogRepository

fun main(args: Array<String>) {
    io.ktor.server.netty.EngineMain.main(args)
}

fun Application.main() {
    configure()
}

fun Application.configure(dbFactory: DatabaseFactory = PostgreSQLFactory()) {
    val database = DatabaseConnection(dbFactory).connection(this)
    val fragenkatalogService = FragenkatalogServiceImpl(FragenkatalogRepository(database))
    configureServices(fragenkatalogService)
}

fun Application.configureServices(fragenkatalogService: FragenkatalogService) {

    install(CallLogging)
    configureHTTP()
    configureSerialization()
    configureRouting(fragenkatalogService)
}
