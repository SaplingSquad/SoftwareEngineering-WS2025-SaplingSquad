package saplingsquad.api.service

import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service
import saplingsquad.api.QuestionsApiDelegate
import saplingsquad.api.models.AnswersInner
import saplingsquad.api.models.Question
import saplingsquad.config.AppConfig
import saplingsquad.persistence.QuestionsRepository
import saplingsquad.persistence.tables.QuestionEntity
import saplingsquad.utils.asHttpOkResponse
import saplingsquad.utils.flowOfList

/**
 * Connection layer between the REST API and the Persistence layer
 * The [QuestionsApiDelegate] interface, as well as the REST API controller are generated from the OpenAPI spec.
 * The controller receives the incoming requests and delegates them to this service.
 */
@Service
class QuestionsApiService(private val repository: QuestionsRepository, @Autowired val appConfig: AppConfig) :
    QuestionsApiDelegate {

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

    override suspend fun postAnswers(userToken: String, answers: List<AnswersInner>?): ResponseEntity<Unit> {
        TODO("Not yet implemented")
    }

    override fun getFilters(userToken: String): ResponseEntity<Flow<Int>> {
        TODO("Not yet implemented")
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

}

