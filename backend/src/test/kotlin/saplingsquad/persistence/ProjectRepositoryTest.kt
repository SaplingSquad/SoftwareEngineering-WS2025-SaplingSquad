package saplingsquad.persistence

import kotlinx.coroutines.flow.toList
import kotlinx.coroutines.test.runTest
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.test.context.junit.jupiter.SpringExtension
import saplingsquad.persistence.testconfig.ExampleProjects
import saplingsquad.persistence.testconfig.PersistenceTestConfiguration
import kotlin.test.Test
import kotlin.test.assertContains
import kotlin.test.assertEquals

/**
 * Test correct behavior of [ProjectsRepository]
 */
@ExtendWith(SpringExtension::class)
@PersistenceTestConfiguration
class ProjectRepositoryTest {

    /** SUT */
    @Autowired
    lateinit var repository: ProjectsRepository


    /**
     * Ensure that an empty filter returns every project
     */
    @Test
    fun testNoFilterReadAll() = runTest {
        val result = repository.readProjects(emptyList()).toList()
        assertEquals(ExampleProjects.projects.size, result.size)
        assert(result.containsAll(ExampleProjects.projects))
    }

    /**
     * Ensure that also second-best matches are included if the best matches would be less than 3
     * And also, the best matches are at the top of the list
     */
    @Test
    fun testFilterAtLeast3() = runTest {
        // Matches only one project in the test set
        val result = repository.readProjects(listOf(7)).toList()
        assert(result.size >= 3)
        assertEquals(7, result[0].orgId)
        assertEquals((7 + 10) * 6, result[0].projectId)
    }

    /**
     * Ensure that only the best matches are included if there are more than 3
     */
    @Test
    fun testFilterNonSpecific() = runTest {
        val result = repository.readProjects(listOf(3)).toList()
        assertEquals(11, result.size)
        for (r in result) {
            // In this test set all projects with the same orgaId have the same tags
            assertContains(2..6, r.orgId)
        }
    }

}