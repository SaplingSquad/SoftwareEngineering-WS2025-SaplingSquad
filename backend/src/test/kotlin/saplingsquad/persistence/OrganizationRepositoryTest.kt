package saplingsquad.persistence

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
import saplingsquad.persistence.tables.OrganizationId
import saplingsquad.persistence.tables.organizationEntity
import saplingsquad.persistence.testconfig.ExampleOrgas
import saplingsquad.persistence.testconfig.ExampleProjects
import saplingsquad.persistence.testconfig.PersistenceTestConfiguration
import saplingsquad.persistence.testconfig.toRegionName
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
            assertEquals(ExampleProjects.projectsWithTagsForOrga(org.orgId).toSet(), result.projects.toSet())
        }
        val notExistent = repository.readOrganizationAndTagsAndProjectsById(-1)
        assertNull(notExistent)
    }


    /**
     * Ensure that the organization entity is correctly inserted
     * - all attributes are in DB
     * - orga id was auto-generated
     */
    @Test
    fun testRegisterReadAndUpdateOrganization() = runTest {
        val placeholderOrgId = 100
        val testOrg = OrganizationEntity(
            orgId = placeholderOrgId, // must be ignored
            name = "test-orga",
            description = "test-description",
            foundingYear = 2000,
            memberCount = 100,
            websiteUrl = "test-website-url",
            donationUrl = "test-donation-url",
            coordinates = CoordinatesEmbedded(50.0, 10.0)
        )
        val testTags = setOf(1, 2, 4)

        val accountId = "test account-1"
        db.withTransaction(transactionProperty = TransactionProperty.IsolationLevel.SERIALIZABLE) { tx ->
            run {
                val result = repository.readOrganizationAndTagsOfAccount(accountId)
                assertNull(result)
            }
            // Test registration
            val newId = registerOrga(accountId, testOrg, testTags, placeholderOrgId)

            // Test duplicates
            val dup = repository.tryRegisterOrganization(accountId, testOrg, testTags)
            assertIs<OrganizationRegisterResult.AlreadyRegistered>(dup)

            // Test retrieval
            retrieveOrga(accountId, testOrg, newId, testTags)

            val updateData = OrganizationEntity(
                orgId = placeholderOrgId + 1, // must be ignored
                name = "test-orga-updated",
                description = "test-description-updated",
                foundingYear = 1999,
                memberCount = 99,
                websiteUrl = "test-website-url-updated",
                donationUrl = "test-donation-url-updated",
                coordinates = CoordinatesEmbedded(60.0, 80.0)
            )
            val updateTags = setOf(4, 5, 6)

            // Test update
            updateOrga(updateData, updateTags, accountId, newId)

            // Rollback this transaction (it is only used for this test)
            tx.setRollbackOnly()
        }
    }

    private suspend fun registerOrga(
        accountId: String,
        testOrg: OrganizationEntity,
        testTags: Set<Int>,
        placeholderOrgId: Int
    ): OrganizationId {
        val result = repository.tryRegisterOrganization(accountId, testOrg, testTags)
        val id = assertIs<OrganizationRegisterResult.Success>(result).id
        val inDb = db.runQuery {
            QueryDsl.from(Meta.organizationEntity).where {
                Meta.organizationEntity.orgId eq id
            }.single()
        }
        assert(inDb.orgId >= 1000) // Used auto generated id
        assertEquals(testOrg, inDb.copy(orgId = placeholderOrgId))//reset orgId for comparison
        return id
    }

    private suspend fun retrieveOrga(
        accountId: String,
        testOrg: OrganizationEntity,
        newId: OrganizationId,
        testTags: Set<Int>
    ) {
        val result = repository.readOrganizationAndTagsOfAccount(accountId)
        assertEquals(testOrg.copy(orgId = newId), result?.first?.toOrganizationEntity())
        assertEquals(testOrg.coordinates.toRegionName(), result?.first?.regionName)
        assertEquals(testTags, result?.second)

        val nonExistentResult = repository.readOrganizationAndTagsOfAccount("test account-2 (non-existent)")
        assertNull(nonExistentResult)
    }

    private suspend fun updateOrga(
        updateData: OrganizationEntity,
        updateTags: Set<Int>,
        accountId: String,
        newId: OrganizationId
    ) {
        val nonExistentResult =
            repository.updateOrganizationOfAccount("test account-2 (non-existent)", updateData, updateTags)
        assertEquals(OrganizationUpdateResult.NoOrganizationRegistered, nonExistentResult)

        val result =
            repository.updateOrganizationOfAccount(accountId, updateData.copy(orgId = newId), updateTags)
        assertEquals(OrganizationUpdateResult.Success, result)

        val updatedResult = repository.readOrganizationAndTagsOfAccount(accountId)
        assertEquals(updateData.copy(orgId = newId), updatedResult?.first?.toOrganizationEntity())
        assertEquals(updateData.coordinates.toRegionName(), updatedResult?.first?.regionName)
        assertEquals(updateTags, updatedResult?.second)
    }
}