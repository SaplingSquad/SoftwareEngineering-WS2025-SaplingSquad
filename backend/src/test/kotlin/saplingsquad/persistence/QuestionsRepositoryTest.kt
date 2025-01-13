package saplingsquad.persistence

import kotlinx.coroutines.flow.toList
import kotlinx.coroutines.test.runTest
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.test.context.junit.jupiter.SpringExtension
import saplingsquad.persistence.testconfig.ExampleQuestionsAndTags
import saplingsquad.persistence.testconfig.PersistenceTestConfiguration
import kotlin.test.Test
import kotlin.test.assertEquals

/**
 * Test correct behavior of [QuestionsRepository]
 */
@ExtendWith(SpringExtension::class)
@PersistenceTestConfiguration
class QuestionsRepositoryTest {


    /** SUT */
    @Autowired
    lateinit var repository: QuestionsRepository


    /**
     * Ensure that all the test data is returned
     */
    @Test
    fun testReadAll() = runTest {
        val result = repository.readAll()
        assertEquals(ExampleQuestionsAndTags.questions.size, result.size)
        assert(result.containsAll(ExampleQuestionsAndTags.questions))
    }

    /**
     * Ensure that the correct values are returned
     */
    @Test
    fun testReadSingle() = runTest {
        for (question in ExampleQuestionsAndTags.questions) {
            val result = repository.readById(question.questionId)
            assertEquals(question, result)
        }
    }

    @Test
    fun testReadAllTags() = runTest {
        val result = repository.readAllTags().toList()
        assertEquals(ExampleQuestionsAndTags.tags.size, result.size)
        assert(result.containsAll(ExampleQuestionsAndTags.tags))
    }

}