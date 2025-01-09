package saplingsquad.persistence

import kotlinx.coroutines.flow.toList
import kotlinx.coroutines.test.runTest
import org.junit.jupiter.api.extension.ExtendWith
import org.komapper.core.dsl.Meta
import org.komapper.core.dsl.QueryDsl
import org.komapper.core.dsl.query.single
import org.komapper.r2dbc.R2dbcDatabase
import org.komapper.tx.core.TransactionProperty
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.test.context.junit.jupiter.SpringExtension
import saplingsquad.persistence.tables.CoordinatesEmbedded
import saplingsquad.persistence.tables.OrganizationEntity
import saplingsquad.persistence.tables.organizationEntity
import saplingsquad.persistence.testconfig.ExampleOrgas
import saplingsquad.persistence.testconfig.ExampleProjects
import saplingsquad.persistence.testconfig.PersistenceTestConfiguration
import kotlin.test.*

/**
 * Test correct behavior of [OrganizationsRepository]
 */
@ExtendWith(SpringExtension::class)
@PersistenceTestConfiguration
class OrganizationRepositoryTest {

    /** SUT */
    @Autowired
    lateinit var repository: OrganizationsRepository

    @Autowired
    lateinit var db: R2dbcDatabase

    @Test
    fun testGetById() = runTest {
        for (org in ExampleOrgas.orgas) {
            val result = repository.readOrganizationAndTagsAndProjectsById(org.orgId)
            assertNotNull(result)
            assertEquals(org, result.org)
            assertEquals(ExampleOrgas.tagsOfOrga(org).toSet(), result.tags)
            assertEquals(ExampleProjects.projectIdsForOrga(org.orgId), result.projectIds)
        }
        val notExistent = repository.readOrganizationAndTagsAndProjectsById(-1)
        assertNull(notExistent)
    }

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

    /**
     * Ensure that the organization entity is correctly inserted
     * - all attributes are in DB
     * - orga id was auto-generated
     */
    @Test
    fun registerReadAndUpdateOrganization() = runTest {
        val placeholderOrgId = 100
        val testOrg = OrganizationEntity(
            orgId = placeholderOrgId, // must be ignored
            name = "test-orga",
            description = "test-description",
            foundingYear = 2000,
            memberCount = 100,
            websiteUrl = "test-website-url",
            donationUrl = "test-donation-url",
            coordinates = CoordinatesEmbedded(50.0, 100.0)
        )
        val testTags = setOf(1, 2, 4)
        val updateData = OrganizationEntity(
            orgId = placeholderOrgId + 1, // must be ignored
            name = "test-orga-updated",
            description = "test-description-updated",
            foundingYear = 1999,
            memberCount = 99,
            websiteUrl = "test-website-url-updated",
            donationUrl = "test-donation-url-updated",
            coordinates = CoordinatesEmbedded(60.0, 90.0)
        )
        val updateTags = setOf(4, 5, 6)
        val accountId = "testaccount-1"
        db.withTransaction(transactionProperty = TransactionProperty.IsolationLevel.SERIALIZABLE) { tx ->
            run {
                val result = repository.readOrganizationAndTagsOfAccount(accountId)
                assertNull(result)
            }
            // Test registration
            val newId = run {
                val result = repository.tryRegisterOrganization(accountId, testOrg, testTags)
                val id = assertIs<OrganizationRegisterResult.Success>(result).id
                val inDb = db.runQuery {
                    QueryDsl.from(Meta.organizationEntity).where {
                        Meta.organizationEntity.orgId eq id
                    }.single()
                }
                assert(inDb.orgId >= 1000) // Used auto generated id
                assertEquals(testOrg, inDb.copy(orgId = placeholderOrgId))//reset orgId for comparison
                id
            }
            // Test retrieval
            run {
                val result = repository.readOrganizationAndTagsOfAccount(accountId)
                assertEquals(testOrg.copy(orgId = newId), result?.first)
                assertEquals(testTags, result?.second)

                val nonExistentResult = repository.readOrganizationAndTagsOfAccount("testaccount-2 (non-existent)")
                assertNull(nonExistentResult)

            }
            // Test update
            run {
                val nonExistentResult =
                    repository.updateOrganizationOfAccount("testaccount-2 (non-existent)", updateData, updateTags)
                assertEquals(OrganizationUpdateResult.NoOrganizationRegistered, nonExistentResult)

                val wrongIdResult = repository.updateOrganizationOfAccount(accountId, updateData, updateTags)
                assertEquals(OrganizationUpdateResult.WrongOrganizationId, wrongIdResult)

                val result =
                    repository.updateOrganizationOfAccount(accountId, updateData.copy(orgId = newId), updateTags)
                assertEquals(OrganizationUpdateResult.Success, result)

                val updatedResult = repository.readOrganizationAndTagsOfAccount(accountId)
                assertEquals(updateData.copy(orgId = newId), updatedResult?.first)
                assertEquals(updateTags, updatedResult?.second)
            }

            tx.setRollbackOnly() //Rollback this transaction (only used for this test)
        }
    }
}