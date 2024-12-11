package api.service

import kotlinx.coroutines.flow.toList
import kotlinx.coroutines.test.runTest
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mock
import org.mockito.junit.jupiter.MockitoExtension
import org.mockito.kotlin.eq
import org.mockito.kotlin.not
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
            QuestionEntity(id = 1, question = "Question 1", imageUrl = null, tag = 1),
            QuestionEntity(id = 2, question = "Question 2", imageUrl = "image.png", tag = 1),
            QuestionEntity(id = 3, question = "Question 3", imageUrl = null, tag = 2),
            QuestionEntity(id = 4, question = "Question 4", imageUrl = "image2.png", tag = 2),
        )
        wheneverBlocking { repository.readAll() }.thenReturn(questionEntities)
        val resourcesUrl = "/testapi/res/"
        whenever(appConfig.resourcesUrlPath).thenReturn(resourcesUrl)

        // @formatter:off
        val expectedBody = listOf(
            Question(questionId = 1, questionText = "Question 1", questionImageUrl = null, tagId = 1),
            Question(questionId = 2, questionText = "Question 2", questionImageUrl = "${resourcesUrl}image.png", tagId = 1),
            Question(questionId = 3, questionText = "Question 3", questionImageUrl = null, tagId = 2),
            Question(questionId = 4, questionText = "Question 4", questionImageUrl = "${resourcesUrl}image2.png", tagId = 2),
        )
        // @formatter:on

        val service = QuestionsApiService(repository, appConfig)
        val response = service.getQuestions()

        assertEquals(response.statusCode, HttpStatus.OK)
        assertEquals(expectedBody, response.body?.toList())
    }

    /**
     * Test GET /questions/{id}
     */
    @Test
    fun testGetQuestionById() = runTest {
        val input = QuestionEntity(id = 1, question = "Question 1", imageUrl = "image.png", tag = 1)
        wheneverBlocking { repository.readById(1) }.thenReturn(input)
        wheneverBlocking { repository.readById(not(eq(1))) }.thenReturn(null)

        val resourcesUrl = "/testapi2/res/"
        whenever(appConfig.resourcesUrlPath).thenReturn(resourcesUrl)

        val expectedOutput =
            Question(
                questionId = 1,
                questionText = "Question 1",
                questionImageUrl = "${resourcesUrl}image.png",
                tagId = 1
            )

        val service = QuestionsApiService(repository, appConfig)

        val responseExisting = service.getQuestionById(1)

        assertEquals(responseExisting.statusCode, HttpStatus.OK)
        assertEquals(expectedOutput, responseExisting.body)

        val responseNonexisting = service.getQuestionById(5)
        assertEquals(responseNonexisting.statusCode, HttpStatus.NOT_FOUND)
    }

}