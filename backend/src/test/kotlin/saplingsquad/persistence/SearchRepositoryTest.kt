package saplingsquad.persistence

import kotlinx.coroutines.test.runTest
import org.junit.jupiter.api.extension.ExtendWith
import org.komapper.r2dbc.R2dbcDatabase
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.test.context.junit.jupiter.SpringExtension
import saplingsquad.persistence.commands.SearchResultEntity
import saplingsquad.persistence.commands.SearchTypeFilter
import saplingsquad.persistence.testconfig.PersistenceTestConfiguration
import kotlin.test.Test
import kotlin.test.assertNotNull
import kotlin.test.assertNull

/**
 * Test correct behavior of [OrganizationsRepository]
 */
@ExtendWith(SpringExtension::class)
@PersistenceTestConfiguration
class SearchRepositoryTest {

    /** SUT */
    @Autowired
    lateinit var repository: SearchRepository

    @Autowired
    lateinit var db: R2dbcDatabase

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
}
