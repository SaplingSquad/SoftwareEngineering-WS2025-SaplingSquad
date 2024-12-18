package saplingsquad.persistence

import kotlinx.coroutines.test.runTest
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.extension.ExtendWith
import org.komapper.core.dsl.Meta
import org.komapper.core.dsl.QueryDsl
import org.komapper.core.dsl.query.andThen
import org.komapper.r2dbc.R2dbcDatabase
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.test.context.junit.jupiter.SpringExtension
import saplingsquad.persistence.tables.QuestionEntity
import saplingsquad.persistence.tables.questionEntity
import saplingsquad.persistence.testconfig.PersistenceTestConfiguration
import kotlin.test.Test
import kotlin.test.assertContains
import kotlin.test.assertEquals

/**
 * Test correct behavior of [QuestionsRepository]
 */
@ExtendWith(SpringExtension::class)
@PersistenceTestConfiguration
class QuestionsRepositoryTest {

    companion object {
        private val Q1 = QuestionEntity(
            questionId = 1,
            questionTitle = "Question 1",
            question = "Content 1",
            imageUrl = null,
            tagId = 1
        )
        private val Q2 = QuestionEntity(
            questionId = 2,
            questionTitle = "Question 2",
            question = "Content 2",
            imageUrl = "test.png",
            tagId = 1
        )
        private val Q3 = QuestionEntity(
            questionId = 3,
            questionTitle = "Question 3",
            question = "Content 3",
            imageUrl = null,
            tagId = 2
        )

        /**
         * Insert some test data
         */
        @BeforeAll
        @JvmStatic
        fun beforeTest_initDb(@Autowired db: R2dbcDatabase) = runTest {
            db.runQuery(
                QueryDsl.create(Meta.questionEntity)
                    .andThen(
                        QueryDsl.insert(Meta.questionEntity).multiple(
                            Q1,
                            Q2,
                            Q3
                        )
                    )
            )
        }
    }

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
        assertContains(result, Q1)
        assertContains(result, Q2)
        assertContains(result, Q3)
    }

    /**
     * Ensure that the correct values are returned
     */
    @Test
    fun testReadSingle() = runTest {
        val result3 = repository.readById(3)
        assertEquals(result3, Q3)
        val result2 = repository.readById(2)
        assertEquals(result2, Q2)
        val result1 = repository.readById(1)
        assertEquals(result1, Q1)
    }


}