package saplingsquad.persistence

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
        assertEquals(3, result.size)
        assert(result.containsAll(ExampleQuestionsAndTags.questions))
    }

    /**
     * Ensure that the correct values are returned
     */
    @Test
    fun testReadSingle() = runTest {
        val result3 = repository.readById(3)
        assertEquals(result3, ExampleQuestionsAndTags.Q3)
        val result2 = repository.readById(2)
        assertEquals(result2, ExampleQuestionsAndTags.Q2)
        val result1 = repository.readById(1)
        assertEquals(result1, ExampleQuestionsAndTags.Q1)
    }


}