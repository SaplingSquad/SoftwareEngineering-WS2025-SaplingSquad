package saplingsquad.api.service

import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.toSet
import kotlinx.coroutines.reactive.asFlow
import org.springframework.http.ResponseEntity
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken
import org.springframework.stereotype.Service
import org.springframework.web.context.request.NativeWebRequest
import reactor.core.publisher.Flux
import saplingsquad.api.AnswersApiDelegate
import saplingsquad.api.QuestionsApiDelegate
import saplingsquad.api.models.Question
import saplingsquad.config.AppConfig
import saplingsquad.persistence.QuestionsRepository
import saplingsquad.persistence.tables.QuestionEntity
import saplingsquad.utils.asHttpOkResponse
import saplingsquad.utils.flowOfList
import java.util.*

/**
 * Connection layer between the REST API and the Persistence layer
 * The [QuestionsApiDelegate] interface, as well as the REST API controller are generated from the OpenAPI spec.
 * The controller receives the incoming requests and delegates them to this service.
 */
@Service
class QuestionsApiService(
    private val repository: QuestionsRepository,
    val appConfig: AppConfig,
) :
    QuestionsApiDelegate, AnswersApiDelegate {

    /**
     * API Endpoint to get a list of all questions.
     */
    override fun getQuestions(): ResponseEntity<Flow<Question>> =
        repository::readAll
            .flowOfList()
            .map { it.tableEntityToApi() }
            .asHttpOkResponse()

    /**
     * Convert a question table row to an object for the API
     */
    fun QuestionEntity.tableEntityToApi(): Question {
        return Question(
            id = this.questionId,
            title = this.questionTitle,
            text = this.question,
            imageUrl = this.imageUrl.let { appConfig.resourcesUrlPath + it }
        )
    }

    override fun getAnswers(userToken: JwtAuthenticationToken): ResponseEntity<Flow<Int>> {
        return repository.readUserAnswers(userToken.token.subject).asHttpOkResponse()
    }

    override suspend fun postAnswers(userToken: JwtAuthenticationToken, requestBody: Flux<Int>): ResponseEntity<Unit> {
        repository.writeUserAnswers(userToken.token.subject, requestBody.asFlow().toSet())
        return ResponseEntity.noContent().build()
    }

    override fun getRequest(): Optional<NativeWebRequest> {
        return Optional.empty()
    }
}