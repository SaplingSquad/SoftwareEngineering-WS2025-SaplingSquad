package saplingsquad.persistence

import kotlinx.coroutines.flow.toList
import kotlinx.coroutines.flow.toSet
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

    /**
     * Ensure that the correct tags are returned
     */
    @Test
    fun testReadAllTags() = runTest {
        val result = repository.readAllTags().toList()
        assertEquals(ExampleQuestionsAndTags.tags.size, result.size)
        assert(result.containsAll(ExampleQuestionsAndTags.tags))
    }

    /**
     * Test the saving and retrieving of answers
     */
    @Test
    fun testReadWriteAnswers() = runTest {
        val answers = setOf(1, 5, 3, 8)
        val accountId = "account-1"
        repository.writeUserAnswers(accountId, answers)

        // Write some answers
        val result = repository.readUserAnswers(accountId).toSet()
        assertEquals(answers, result)

        // Overwrite with fewer elements
        repository.writeUserAnswers(accountId, setOf(5))
        val result2 = repository.readUserAnswers(accountId).toSet()
        assertEquals(setOf(5), result2)

        // Other account has no answers
        val emptyResult = repository.readUserAnswers("account-2 (has no anwers)").toSet()
        assert(emptyResult.isEmpty())

        // Clear answers
        repository.writeUserAnswers(accountId, emptySet())
        val emptyResult2 = repository.readUserAnswers(accountId).toSet()
        assert(emptyResult2.isEmpty())

        repository.writeUserAnswers(accountId, setOf(5, 100000))
    }

}