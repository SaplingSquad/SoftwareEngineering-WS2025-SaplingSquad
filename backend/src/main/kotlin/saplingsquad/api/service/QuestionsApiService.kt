package saplingsquad.api.service

import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import org.springframework.http.ResponseEntity
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken
import org.springframework.stereotype.Service
import org.springframework.web.context.request.NativeWebRequest
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
     * API Endpoint to get a single question
     */
    override suspend fun getQuestionById(questionId: Int): ResponseEntity<Question> {
        val entity = repository.readById(questionId) ?: return ResponseEntity.notFound().build()
        return entity
            .tableEntityToApi()
            .asHttpOkResponse()
    }

    /**
     * Convert a question table row to an object for the API
     */
    fun QuestionEntity.tableEntityToApi(): Question {
        return Question(
            questionId = this.questionId,
            questionTitle = this.questionTitle,
            questionText = this.question,
            questionImageUrl = this.imageUrl?.let { appConfig.resourcesUrlPath + it },
            tagId = this.tagId
        )
    }

    override fun getAnswers(userToken: JwtAuthenticationToken): ResponseEntity<Flow<Int>> {
        TODO("Not yet implemented")
    }

    override suspend fun postAnswers(userToken: JwtAuthenticationToken, requestBody: Flow<Int>): ResponseEntity<Unit> {
        TODO("Not yet implemented")
    }

    override fun getRequest(): Optional<NativeWebRequest> {
        return Optional.empty()
    }
}