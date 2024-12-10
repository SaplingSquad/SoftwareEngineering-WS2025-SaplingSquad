package saplingsquad.persistence

import kotlinx.coroutines.test.runTest
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
import kotlin.test.BeforeTest
import kotlin.test.Test
import kotlin.test.assertContains
import kotlin.test.assertEquals

/**
 * Test correct behavior of [FragenkatalogRepository]
 */
@ExtendWith(SpringExtension::class)
@PersistenceTestConfiguration
class QuestionsRepositoryTest {

    companion object {
        private val FRAGE1 = QuestionEntity(id = 1, question = "Frage 1?", imageUrl = null, tag = 1)
        private val FRAGE2 = QuestionEntity(id = 2, question = "Frage 2?", imageUrl = "test.png", tag = 1)
        private val FRAGE3 = QuestionEntity(id = 3, question = "Frage 3?", imageUrl = null, tag = 2)
    }

    /** The temporary database used for testing*/
    @Autowired
    lateinit var db: R2dbcDatabase

    /** SUT */
    @Autowired
    lateinit var repository: QuestionsRepository


    /**
     * Insert some test data
     */
    @BeforeTest
    fun beforeTest() = runTest {
        db.runQuery(
            QueryDsl.create(Meta.questionEntity)
                .andThen(
                    QueryDsl.insert(Meta.questionEntity).multiple(
                        FRAGE1,
                        FRAGE2,
                        FRAGE3
                    )
                )
        )
    }

    /**
     * Ensure that all the test data is returned
     */
    @Test
    fun testReadAll() = runTest {
        val result = repository.readAll()
        assertEquals(3, result.size)
        assertContains(result, FRAGE1)
        assertContains(result, FRAGE2)
        assertContains(result, FRAGE3)
    }

    /**
     * Ensure that the correct values are returned
     */
    @Test
    fun testReadSingle() = runTest{
        val result3 = repository.readById(2)
        assertEquals(result3, FRAGE3)
        val result2 = repository.readById(2)
        assertEquals(result2, FRAGE2)
        val result1 = repository.readById(1)
        assertEquals(result1, FRAGE1)
    }


}