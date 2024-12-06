package saplingsquad

import io.ktor.client.call.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.request.*
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.config.*
import io.ktor.server.testing.*
import kotlinx.coroutines.runBlocking
import org.komapper.core.dsl.Meta
import org.komapper.core.dsl.QueryDsl
import org.komapper.r2dbc.R2dbcDatabase
import saplingsquad.api.models.Frage
import saplingsquad.persistence.tables.FrageEntity
import saplingsquad.persistence.tables.frageEntity
import kotlin.test.BeforeTest
import kotlin.test.Test
import kotlin.test.assertEquals

fun Application.configureTestAppWithDb(block: suspend R2dbcDatabase.() -> Unit) {
    val factory = EmbeddedDBFactory()
    configure(factory)
    val db = factory.connectToDatabase(this)
    runBlocking {
        db.runQuery(QueryDsl.create(Meta.frageEntity))
        db.block()
    }
}

fun TestApplicationBuilder.testEnvironment() {
    environment {
        config = MapApplicationConfig(
            "openapi.spec" to "api/spec.yaml"
        )
    }
}

fun preconfiguredTestApplication(block: suspend ApplicationTestBuilder.() -> Unit) {
    testApplication {
        testEnvironment()
        block()
    }
}

fun ApplicationTestBuilder.createClient() =
    createClient {
        install(ContentNegotiation) {
            json()
        }
    }

class ApplicationTest {

    @BeforeTest
    fun beforeTestFragenkatalog() = preconfiguredTestApplication {
        application {
            configureTestAppWithDb {
                runQuery(
                    QueryDsl.insert(Meta.frageEntity).multiple(
                        FrageEntity(1, "Frage1", 1),
                        FrageEntity(2, "Frage2", 1),
                        FrageEntity(3, "Frage3", 1),
                    )
                )
            }
        }
    }

    @Test
    fun testFragenkatalog() = preconfiguredTestApplication {
        application {
            configureTestAppWithDb {
            }
        }

        val client = createClient()

        client.get("/fragenkatalog").apply {
            assertEquals(HttpStatusCode.OK, status)
            val body = body<List<Frage>>();
            assertEquals(3, body.size);
        }
    }

}
