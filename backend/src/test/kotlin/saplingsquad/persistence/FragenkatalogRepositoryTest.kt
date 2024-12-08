package saplingsquad.persistence

import kotlinx.coroutines.test.runTest
import org.junit.jupiter.api.extension.ExtendWith
import org.komapper.core.dsl.Meta
import org.komapper.core.dsl.QueryDsl
import org.komapper.core.dsl.query.andThen
import org.komapper.r2dbc.R2dbcDatabase
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.test.context.junit.jupiter.SpringExtension
import saplingsquad.persistence.tables.FrageEntity
import saplingsquad.persistence.tables.frageEntity
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
class FragenkatalogRepositoryTest {

    companion object {
        private val FRAGE1 = FrageEntity(id = 1, frage = "Frage 1?", tag = 1)
        private val FRAGE2 = FrageEntity(id = 2, frage = "Frage 2?", tag = 1)
        private val FRAGE3 = FrageEntity(id = 3, frage = "Frage 3?", tag = 2)
    }

    /** The temporary database used for testing*/
    @Autowired
    lateinit var db: R2dbcDatabase

    /** SUT */
    @Autowired
    lateinit var repository: FragenkatalogRepository


    /**
     * Insert some test data
     */
    @BeforeTest
    fun beforeTest() = runTest {
        db.runQuery(
            QueryDsl.create(Meta.frageEntity)
                .andThen(
                    QueryDsl.insert(Meta.frageEntity).multiple(
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


}