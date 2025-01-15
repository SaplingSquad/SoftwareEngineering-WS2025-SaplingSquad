package saplingsquad.persistence

import kotlinx.coroutines.test.runTest
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.test.context.junit.jupiter.SpringExtension
import saplingsquad.persistence.commands.SearchResultEntity
import saplingsquad.persistence.commands.SearchTypeFilter
import saplingsquad.persistence.testconfig.ExampleOrgas
import saplingsquad.persistence.testconfig.ExampleProjects
import saplingsquad.persistence.testconfig.PersistenceTestConfiguration
import kotlin.test.*

/**
 * Test correct behavior of [OrganizationsRepository]
 */
@ExtendWith(SpringExtension::class)
@PersistenceTestConfiguration
class SearchRepositoryTest {

    /** SUT */
    @Autowired
    lateinit var repository: SearchRepository

    /**
     * Test the conversion to Project and Organization from [SearchTypeFilter.All]
     */
    @Test
    fun testConversion() = runTest {
        val results = repository.search(emptyList(), null, null, null, null, SearchTypeFilter.All)
        for (result in results) {
            val pr = result.toProjectEntity()
            val org = result.toOrganizationEntity()
            when (result.type) {
                SearchResultEntity.Type.Project -> {
                    assertNotNull(pr)
                    assertNull(org)
                }

                SearchResultEntity.Type.Organization -> {
                    assertNotNull(org)
                    assertNull(pr)
                }
            }
        }
    }

    /**
     * Ensure that an empty filter returns every organization
     */
    @Test
    fun testNoFilterReadAll() = runTest {
        val result = repository.search(emptyList(), null, null, null, null, SearchTypeFilter.Organizations).map {
            it.toOrganizationEntity()!!.org
        }
        assertEquals(ExampleOrgas.orgas.size, result.size)
        assert(result.containsAll(ExampleOrgas.orgas))
    }

    /**
     * Ensure that also second-best matches are included if the best matches would be less than 3
     * And also, the best matches are at the top of the list
     */
    @Test
    fun testFilterAtLeast3() = runTest {
        // Very specific filter, only 2 organizations (ids 5,6) in test setup have all those tags
        val result = repository.search(listOf(2, 3), 10, null, null, null, SearchTypeFilter.Organizations)
            .map { it.also { println(it) }.toOrganizationEntity()!!.org }
        assertEquals(7, result.size)
        assertContains(5..6, result[0].orgId)
        assertContains(5..6, result[1].orgId)
    }

    /**
     * Ensure that only the best matches are included if there are more than 3
     */
    @Test
    fun testFilterNonSpecific() = runTest {
        val result = repository.search(listOf(1), null, null, null, null, SearchTypeFilter.Organizations)
            .map { it.toOrganizationEntity()!!.org }
        assertEquals(5, result.size)
        for (r in result) {
            assertContains(0..4, r.orgId)
        }
    }

    /**
     * Ensure that an empty filter returns every project
     */
    @Test
    fun testNoFilterReadAllProjects() = runTest {
        val result = repository.search(emptyList(), null, null, null, null, SearchTypeFilter.Projects)
            .map { it.toProjectEntity()!!.proj }
        assertEquals(ExampleProjects.projects.size, result.size)
        assert(result.containsAll(ExampleProjects.projects))
    }

    /**
     * Ensure that also second-best matches are included if the best matches would be less than 3
     * And also, the best matches are at the top of the list
     */
    @Test
    fun testFilterAtLeast3Projects() = runTest {
        // Matches only one project in the test set
        val result = repository.search(listOf(7), null, null, null, null, SearchTypeFilter.Projects)
            .map { it.toProjectEntity()!!.proj }
        assert(result.size >= 3)
        assertEquals(7, result[0].orgId)
        assertEquals((7 + 10) * 6, result[0].projectId)
    }

    /**
     * Ensure that only the best matches are included if there are more than 3
     */
    @Test
    fun testFilterNonSpecificProjects() = runTest {
        val result = repository.search(listOf(3), null, null, null, null, SearchTypeFilter.Projects)
            .map { it.toProjectEntity()!!.proj }
        assertEquals(11, result.size)
        for (r in result) {
            // In this test set all projects with the same orgaId have the same tags
            assertContains(2..6, r.orgId)
        }
    }
}
