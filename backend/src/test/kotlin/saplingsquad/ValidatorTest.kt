package saplingsquad

import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.plugins.doublereceive.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.testing.*
import org.junit.Test
import kotlin.test.assertEquals

//language=yaml
const val inlineSpec = """
openapi: 3.0.0
info:
  title: Test Spec
  description: Test Spec
  version: '0.0.0'

paths:
  /fragenkatalog:
    get:
      responses:
        200:
          description: Success
          content:
            application/json:
              schema:
                type: array
                items:
                  ${'$'}ref: '#/components/schemas/Frage'

components:
  schemas:
    Frage:
      type: object
      properties:
        id:
          type: integer
        frage:
          type: string
        tagId:
          type: integer
"""

fun ApplicationTestBuilder.fragenkatalogApplication(block: suspend RoutingContext.() -> Unit) =
    application {
        install(IgnoreTrailingSlash)
        install(ContentNegotiation) {
            json()
        }
        install(DoubleReceive)
        install(OpenApiValidatePlugin.inlineSpec(inlineSpec))
        routing {
            get("/fragenkatalog") {
                block()
            }
        }
    }

suspend fun ApplicationTestBuilder.simpleGetRequest(): HttpResponse {
    val client = createClient {
        install(io.ktor.client.plugins.contentnegotiation.ContentNegotiation) {
            json()
        }
    }
    return client.get("/fragenkatalog/")
}

suspend fun RoutingCall.respondJsonString(json: String) {
    respondText(json, ContentType.Application.Json, HttpStatusCode.OK)
}

class ValidatorTest {
    @Test
    fun validatorTest1() = testApplication {
        fragenkatalogApplication {
            //language=JSON
            call.respondJsonString("""[{"id": 1, "frage": "Frage", "tagId": 2}]""")
        }

        simpleGetRequest().apply {
            assertEquals(HttpStatusCode.OK, status)
        }
    }

    @Test
    fun validatorTest2() = testApplication {
        fragenkatalogApplication {
            //language=JSON
            call.respondJsonString("""[{"id": 1, "frage": 100, "tagId": 2}]""")
        }

        simpleGetRequest().apply {
            assertEquals(HttpStatusCode.InternalServerError, status)
        }
    }
}