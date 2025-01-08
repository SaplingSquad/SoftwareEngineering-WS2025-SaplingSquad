package saplingsquad.persistence

import kotlinx.coroutines.flow.toList
import kotlinx.coroutines.test.runTest
import org.junit.jupiter.api.extension.ExtendWith
import org.komapper.r2dbc.R2dbcDatabase
import org.komapper.tx.core.TransactionProperty
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.test.context.junit.jupiter.SpringExtension
import saplingsquad.persistence.tables.CoordinatesEmbedded
import saplingsquad.persistence.tables.OrganizationEntity
import saplingsquad.persistence.tables.ProjectEntity
import saplingsquad.persistence.testconfig.ExampleProjects
import saplingsquad.persistence.testconfig.PersistenceTestConfiguration
import java.time.LocalDate
import kotlin.test.Test
import kotlin.test.assertContains
import kotlin.test.assertEquals
import kotlin.test.assertIs

/**
 * Test correct behavior of [ProjectsRepository]
 */
@ExtendWith(SpringExtension::class)
@PersistenceTestConfiguration
class ProjectRepositoryTest {

    /** SUT */
    @Autowired
    lateinit var repository: ProjectsRepository


    // Supporting objects

    @Autowired
    lateinit var orgaRepository: OrganizationsRepository

    @Autowired
    lateinit var db: R2dbcDatabase

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

    /**
     * Ensure all project entities are correctly inserted
     * - all attributes are in DB
     * - project ids are auto-generated
     */
    @Test
    fun testCreateReadUpdateDeleteProject() = runTest {
        val placeholderProjectId = 200
        val placeholderProjectOrgId = 300

        val testOrg = OrganizationEntity(
            orgId = 0, // must be ignored
            name = "test-orga",
            description = "test-description",
            foundingYear = 2000,
            memberCount = 100,
            websiteUrl = "test-website-url",
            donationUrl = "test-donation-url",
            coordinates = CoordinatesEmbedded(50.0, 100.0)
        )
        val testTags = setOf(1, 2, 4)
        fun dateFromIdx(i: Int, end: Boolean) = when (i) {
            2 -> if (end) null else LocalDate.of(2000 - i, i + 1, i + 2)
            3 -> if (end) LocalDate.of(2000 + i, i + 1, i + 2) else null
            4 -> null
            else -> if (end) LocalDate.of(2000 + i, i + 1, i + 2) else LocalDate.of(2000 - i, i + 1, i + 2)
        }

        val testProjects = List(5) { i ->
            Pair(
                ProjectEntity(
                    projectId = placeholderProjectId,
                    orgId = placeholderProjectOrgId,
                    title = "test-proj $i",
                    description = "test-description $i",
                    dateFrom = dateFromIdx(i, false),
                    dateTo = dateFromIdx(i, true),
                    websiteUrl = if (i >= 4) null else "test-website-url $i",
                    donationUrl = if (i >= 3) null else "test-donation-url $i",
                    coordinates = CoordinatesEmbedded(i.toDouble(), 2 * i.toDouble()),
                ),
                if (i != 5) setOf(i, i + 1) else emptySet()
            )
        }
        val updateData = ProjectEntity(
            projectId = placeholderProjectId, // set this later in test
            orgId = placeholderProjectOrgId + 1, // must be ignored
            title = "test-proj-updated",
            description = "test-description-updated",
            dateFrom = null,
            dateTo = LocalDate.of(2024, 10, 10),
            websiteUrl = "test-website-url-updated",
            donationUrl = "test-donation-url-updated",
            coordinates = CoordinatesEmbedded(60.0, 90.0)
        )
        val updateTags = setOf(4, 5, 6)
        val accountId = "testaccount-1"
        db.withTransaction(transactionProperty = TransactionProperty.IsolationLevel.SERIALIZABLE) { tx ->
            val orgaId = run {
                val result = orgaRepository.tryRegisterOrganization(accountId, testOrg, testTags)
                val id = assertIs<OrganizationRegisterResult.Success>(result).id
                id
            }
            // Test insertion
            val projectIds = run {
                val projectIds = testProjects.map { (project, tags) ->
                    val result = repository.createProjectForAccount(accountId, project, tags)
                    val id = assertIs<ProjectCreateResult.Success>(result).id
                    // Check uses auto generated Id
                    assert(id >= 1000)
                    id
                }
                // Check no duplicate IDs
                assertEquals(projectIds.toSet().size, projectIds.size)

                val nonExistentResult = repository.createProjectForAccount(
                    "testaccount-2 (non-existent)",
                    testProjects[0].first,
                    testProjects[0].second
                )
                assertIs<ProjectCreateResult.OrganizationNotRegisteredYet>(nonExistentResult)
                projectIds
            }

            // Test retrieval
            val projects = run {
                val result = repository.readProjectsByAccount(accountId)
                val projects = assertIs<ProjectsReadFromAccountResult.Success>(result).projects
                assertEquals(testProjects.size, projects.size)

                // Check all ids match with created
                assertEquals(projectIds.toSet(), projects.map { it.first.projectId }.toSet())
                // Check correct orga id
                for (project in projects) {
                    assertEquals(orgaId, project.first.orgId)
                }

                //Check all match with test data
                assertEquals(
                    testProjects.toSet(),
                    projects.map {
                        Pair(
                            // Replace projectid and orgid in result set
                            it.first.copy(projectId = placeholderProjectId, orgId = placeholderProjectOrgId),
                            it.second
                        )
                    }.toSet()
                )

                val nonExistentResult = repository.readProjectsByAccount("testaccount-2 (non-existent)")
                assertIs<ProjectsReadFromAccountResult.OrganizationNotRegisteredYet>(nonExistentResult)
                projects
            }

            tx.setRollbackOnly() //Rollback this transaction (only used for this test)
        }
    }
}