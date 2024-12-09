package saplingsquad.api.service

import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service
import saplingsquad.api.QuestionsApiDelegate
import saplingsquad.api.models.AnswersInner
import saplingsquad.api.models.Question
import saplingsquad.persistence.QuestionsRepository

/**
 * Connection layer between the REST API and the Persistence layer
 * The [QuestionsApiDelegate] interface, as well as the REST API controller are generated from the OpenAPI spec.
 * The controller receives the incoming requests and delegates them to this service.
 */
@Service
class QuestionsApiService(private val repository: QuestionsRepository) : QuestionsApiDelegate {

    /**
     * API Endpoint to get a list of all questions.
     */
    override fun getQuestions(): ResponseEntity<Flow<Question>> =
        repository::readAll
            .flowOfList()
            .map {
                Question(
                    questionId = it.id,
                    questionText = it.question,
                    questionImageUrl = it.imageUrl,
                    tagId = it.tag
                )
            }.asHttpOkResponse()

    override suspend fun getQuestionById(questionId: Int): ResponseEntity<Question> {
        TODO("Not yet implemented")
    }

    override suspend fun postAnswers(userToken: String, answers: List<AnswersInner>?): ResponseEntity<Unit> {
        TODO("Not yet implemented")
    }

    override fun getFilters(userToken: String): ResponseEntity<Flow<Int>> {
        TODO("Not yet implemented")
    }
}
