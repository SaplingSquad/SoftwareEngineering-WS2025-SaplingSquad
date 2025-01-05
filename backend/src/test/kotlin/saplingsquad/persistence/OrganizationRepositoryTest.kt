package saplingsquad.persistence

import kotlinx.coroutines.flow.toList
import kotlinx.coroutines.test.runTest
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.test.context.junit.jupiter.SpringExtension
import saplingsquad.persistence.testconfig.ExampleOrgas
import saplingsquad.persistence.testconfig.PersistenceTestConfiguration
import kotlin.test.Test
import kotlin.test.assertContains
import kotlin.test.assertEquals

/**
 * Test correct behavior of [OrganizationsRepository]
 */
@ExtendWith(SpringExtension::class)
@PersistenceTestConfiguration
class OrganizationRepositoryTest {

    /** SUT */
    @Autowired
    lateinit var repository: OrganizationsRepository


    /**
     * Ensure that an empty filter returns every organization
     */
    @Test
    fun testNoFilterReadAll() = runTest {
        val result = repository.readOrganizations(emptyList()).toList()
        assertEquals(ExampleOrgas.orgas.size, result.size)
        assert(result.containsAll(ExampleOrgas.orgas))
    }

    /**
     * Ensure that also second best matches are included if the best matches would be less than 3
     * And also, the best matches are at the top of the list
     */
    @Test
    fun testFilterAtLeast3() = runTest {
        // Very specific filter, only 2 organizations (ids 5,6) in test setup have all those tags
        val result = repository.readOrganizations(listOf(2, 3)).toList()
        result.forEach(::println)
        assertEquals(7, result.size)
        assertContains(5..6, result[0].orgId)
        assertContains(5..6, result[1].orgId)
    }

    /**
     * Ensure that only the best matches are included if there are more than 3
     */
    @Test
    fun testFilterNonSpecific() = runTest {
        val result = repository.readOrganizations(listOf(1)).toList()
        assertEquals(5, result.size)
        for (r in result) {
            assertContains(0..4, r.orgId)
        }
    }

}