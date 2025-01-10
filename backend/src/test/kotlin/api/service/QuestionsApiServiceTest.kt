package api.service

import kotlinx.coroutines.flow.toList
import kotlinx.coroutines.test.runTest
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mock
import org.mockito.junit.jupiter.MockitoExtension
import org.mockito.kotlin.whenever
import org.mockito.kotlin.wheneverBlocking
import org.springframework.http.HttpStatus
import saplingsquad.api.models.Question
import saplingsquad.api.service.QuestionsApiService
import saplingsquad.config.AppConfig
import saplingsquad.persistence.QuestionsRepository
import saplingsquad.persistence.tables.QuestionEntity
import kotlin.test.Test
import kotlin.test.assertEquals

/**
 * Test correct behavior of [QuestionsApiService]
 */
@ExtendWith(MockitoExtension::class)
class QuestionsApiServiceTest {

    /**
     * Mock the persistence layer
     */
    @Mock
    lateinit var repository: QuestionsRepository

    @Mock
    lateinit var appConfig: AppConfig


    /**
     * Test GET /questions
     */
    @Test
    fun testGetQuestions() = runTest {
        val questionEntities = listOf(
            QuestionEntity(
                questionId = 1, questionTitle = "Question 1", question = "Content 1", imageUrl = null, tagId = 1
            ),
            QuestionEntity(
                questionId = 2, questionTitle = "Question 2", question = "Content 2", imageUrl = "image.png", tagId = 1
            ),
            QuestionEntity(
                questionId = 3, questionTitle = "Question 3", question = "Content 3", imageUrl = null, tagId = 2
            ),
            QuestionEntity(
                questionId = 4, questionTitle = "Question 4", question = "Content 4", imageUrl = "image2.png", tagId = 2
            ),
        )
        wheneverBlocking { repository.readAll() }.thenReturn(questionEntities)
        val resourcesUrl = "/testapi/res/"
        whenever(appConfig.resourcesUrlPath).thenReturn(resourcesUrl)

        // @formatter:off
        val expectedBody = listOf(
            Question(questionId = 1, questionTitle = "Question 1", questionText = "Content 1", questionImageUrl = null, tagId = 1),
            Question(questionId = 2, questionTitle = "Question 2", questionText = "Content 2", questionImageUrl = "${resourcesUrl}image.png", tagId = 1),
            Question(questionId = 3, questionTitle = "Question 3", questionText = "Content 3", questionImageUrl = null, tagId = 2),
            Question(questionId = 4, questionTitle = "Question 4", questionText = "Content 4", questionImageUrl = "${resourcesUrl}image2.png", tagId = 2),
        )
        // @formatter:on

        val service = QuestionsApiService(repository, appConfig)
        val response = service.getQuestions()

        assertEquals(response.statusCode, HttpStatus.OK)
        assertEquals(expectedBody, response.body?.toList())
    }
}