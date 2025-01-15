package saplingsquad.api.service

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
                questionId = 1, questionTitle = "Question 1", question = "Content 1", imageUrl = "image.png", tagId = 1
            ),
            QuestionEntity(
                questionId = 2, questionTitle = "Question 2", question = "Content 2", imageUrl = "image1.png", tagId = 1
            ),
            QuestionEntity(
                questionId = 3, questionTitle = "Question 3", question = "Content 3", imageUrl = "image2.png", tagId = 2
            ),
            QuestionEntity(
                questionId = 4, questionTitle = "Question 4", question = "Content 4", imageUrl = "image3.png", tagId = 2
            ),
        )
        wheneverBlocking { repository.readAll() }.thenReturn(questionEntities)
        val resourcesUrl = "/testapi/res/"
        whenever(appConfig.resourcesUrlPath).thenReturn(resourcesUrl)

        // @formatter:off
        val expectedBody = listOf(
            Question(id = 1, title = "Question 1", text = "Content 1", imageUrl = "${resourcesUrl}image.png"),
            Question(id = 2, title = "Question 2", text = "Content 2", imageUrl = "${resourcesUrl}image1.png"),
            Question(id = 3, title = "Question 3", text = "Content 3", imageUrl = "${resourcesUrl}image2.png"),
            Question(id = 4, title = "Question 4", text = "Content 4", imageUrl = "${resourcesUrl}image3.png"),
        )
        // @formatter:on

        val service = QuestionsApiService(repository, appConfig)
        val response = service.getQuestions()

        assertEquals(response.statusCode, HttpStatus.OK)
        assertEquals(expectedBody, response.body?.toList())
    }
}