package saplingsquad.persistence

import kotlinx.coroutines.test.runTest
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.test.context.junit.jupiter.SpringExtension
import saplingsquad.persistence.tables.RegionEntity
import saplingsquad.persistence.testconfig.ExampleRegions
import saplingsquad.persistence.testconfig.PersistenceTestConfiguration
import kotlin.test.Test
import kotlin.test.assertContains
import kotlin.test.assertEquals

/**
 * Test correct behavior of [RegionsRepository]
 */
@ExtendWith(SpringExtension::class)
@PersistenceTestConfiguration
class RegionsRepositoryTest {

    /** SUT */
    @Autowired
    lateinit var repository: RegionsRepository

    /**
     * Ensure that the correct test data is returned
     */
    @Test
    fun testReadRegions() = runTest {
        val results = repository.readRegions()
        assertEquals(ExampleRegions.continents.size, results.size)
        val regions = emptyList<RegionEntity>().toMutableList()
        for ((c, r) in results) {
            assertContains(ExampleRegions.continents, c)
            regions += r
        }
        assertEquals(ExampleRegions.regions, regions)
    }
}