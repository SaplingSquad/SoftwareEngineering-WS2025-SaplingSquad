package saplingsquad.persistence

import kotlinx.coroutines.test.runTest
import org.junit.jupiter.api.extension.ExtendWith
import org.komapper.r2dbc.R2dbcDatabase
import org.komapper.tx.core.TransactionProperty
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.test.context.junit.jupiter.SpringExtension
import saplingsquad.persistence.tables.*
import saplingsquad.persistence.testconfig.ExampleOrgas
import saplingsquad.persistence.testconfig.PersistenceTestConfiguration
import saplingsquad.persistence.testconfig.toRegionName
import java.time.LocalDate
import kotlin.test.*

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
     * Ensure all project entities are correctly inserted
     * - all attributes are in DB
     * - project ids are auto-generated
     */
    @Test
    fun testCreateReadUpdateDeleteProject() = runTest {
        val placeholderProjectId = 200
        val placeholderProjectOrgId = 300
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

        val accountId = "test account-1"
        val nonExistentAccountId = "test account-2 (non-existent)"
        val testOrg = OrganizationEntity(
            orgId = 0, // must be ignored
            name = "test-orga",
            description = "test-description",
            foundingYear = 2000,
            memberCount = 100,
            websiteUrl = "test-website-url",
            donationUrl = "test-donation-url",
            coordinates = CoordinatesEmbedded(50.0, 20.0)
        )
        val testTags = setOf(1, 2, 4)
        db.withTransaction(transactionProperty = TransactionProperty.IsolationLevel.SERIALIZABLE) { tx ->
            val orgaId = run {
                val result = orgaRepository.tryRegisterOrganization(accountId, testOrg, testTags)
                val id = result.assertSuccess()
                id
            }
            // Test insertion
            val projectIds = insertProject(testProjects, accountId, nonExistentAccountId)
            // Test retrieval
            retrieveProject(
                accountId,
                testProjects,
                projectIds,
                orgaId,
                placeholderProjectId,
                placeholderProjectOrgId,
                nonExistentAccountId
            )
            // Test update
            updateProject(projectIds, placeholderProjectOrgId, accountId, orgaId)
            // Test delete
            deleteProject(projectIds, accountId, testProjects)
            // Rollback this transaction (it is only used for this test)
            tx.setRollbackOnly()
        }
    }

    private fun dateFromIdx(i: Int, end: Boolean) = when (i) {
        2 -> if (end) null else LocalDate.of(2000 - i, i + 1, i + 2)
        3 -> if (end) LocalDate.of(2000 + i, i + 1, i + 2) else null
        4 -> null
        else -> if (end) LocalDate.of(2000 + i, i + 1, i + 2) else LocalDate.of(2000 - i, i + 1, i + 2)
    }

    private suspend fun insertProject(
        testProjects: List<Pair<ProjectEntity, Set<Int>>>,
        accountId: String,
        nonExistentAccountId: String
    ): List<ProjectId> {
        val projectIds = testProjects.map { (project, tags) ->
            val result = repository.createProjectForAccount(accountId, project, tags)
            val id = assertIs<ProjectCrRdResult.Success<Int>>(result).value
            // Check uses auto generated ID
            assert(id >= 1000)
            id
        }
        // Check no duplicate IDs
        assertEquals(projectIds.toSet().size, projectIds.size)

        val nonExistentResult = repository.createProjectForAccount(
            nonExistentAccountId,
            testProjects[0].first,
            testProjects[0].second
        )
        assertIs<ProjectCrRdResult.OrganizationNotRegisteredYet>(nonExistentResult)
        return projectIds
    }

    private suspend fun retrieveProject(
        accountId: String,
        testProjects: List<Pair<ProjectEntity, Set<Int>>>,
        projectIds: List<Int>,
        orgaId: OrganizationId,
        placeholderProjectId: Int,
        placeholderProjectOrgId: Int,
        nonExistentAccountId: String
    ) {
        val result = repository.readProjectsByAccount(accountId)
        val projects = assertIs<ProjectCrRdResult.Success<List<ProjectWithRegionEntityAndTags>>>(result).value
        assertEquals(testProjects.size, projects.size)
        // Check all ids match with created
        assertEquals(projectIds.toSet(), projects.map { it.first.projectId }.toSet())
        // Check correct orga id
        for (project in projects) {
            assertEquals(orgaId, project.first.orgId)
        }
        //Check all match with test data (excluding regionName)
        assertEquals(
            testProjects.toSet(),
            projects.map {
                Pair(
                    // Replace projectId and orgId in result set
                    it.first.copy(projectId = placeholderProjectId, orgId = placeholderProjectOrgId)
                        .toProjectEntity(),
                    it.second
                )
            }.toSet()
        )
        // Check region name computed correctly
        for (p in projects) {
            assertEquals(p.first.coordinates.toRegionName(), p.first.regionName)
        }
        // Check requests for non-existing values are handled correctly
        val nonExistentResult = repository.readProjectsByAccount(nonExistentAccountId)
        assertIs<ProjectCrRdResult.OrganizationNotRegisteredYet>(nonExistentResult)
    }

    private suspend fun updateProject(
        projectIds: List<Int>,
        placeholderProjectOrgId: Int,
        accountId: String,
        orgaId: OrganizationId
    ) {
        val toUpdateProjectId = projectIds[2]
        val updateData = ProjectEntity(
            projectId = toUpdateProjectId, // set this later in test
            orgId = placeholderProjectOrgId + 1, // must be ignored
            title = "test-proj-updated",
            description = "test-description-updated",
            dateFrom = null,
            dateTo = LocalDate.of(2024, 10, 10),
            websiteUrl = "test-website-url-updated",
            donationUrl = "test-donation-url-updated",
            coordinates = CoordinatesEmbedded(60.0, -10.0)
        )
        val updateTags = setOf(2, 4, 5)
        val result = repository.updateProjectOfAccount(accountId, updateData, updateTags)
        assertEquals(ProjectUpdDelResult.Success, result)

        val retrieveUpdated = repository.readProjectsByAccount(accountId).assertSuccess()
            .single { it.first.projectId == toUpdateProjectId }
        // Check values were updated
        assertEquals(updateData.copy(orgId = orgaId), retrieveUpdated.first.toProjectEntity())
        // Check region name was updated
        assertEquals(retrieveUpdated.first.coordinates.toRegionName(), retrieveUpdated.first.regionName)

        val wrongAccountResult =
            repository.updateProjectOfAccount(accountId, updateData.copy(projectId = 10), updateTags)
        assertEquals(ProjectUpdDelResult.ProjectDoesNotBelongToAccount, wrongAccountResult)

        // ids of ExampleProject.projects start from 10
        val nonExistentProjectResult =
            repository.updateProjectOfAccount(accountId, updateData.copy(projectId = 9), updateTags)
        assertEquals(ProjectUpdDelResult.NonExistentProjectId, nonExistentProjectResult)
    }

    private suspend fun deleteProject(
        projectIds: List<Int>,
        accountId: String,
        testProjects: List<Pair<ProjectEntity, Set<Int>>>
    ) {
        val removeWithId = projectIds[3]
        val result = repository.deleteProjectOfAccount(accountId, removeWithId)
        assertEquals(ProjectUpdDelResult.Success, result)

        val readProjectsResult = repository.readProjectsByAccount(accountId).assertSuccess()
        assertEquals(testProjects.size - 1, readProjectsResult.size)
        assert(readProjectsResult.none { it.first.projectId == removeWithId })

        val wrongAccountResult = repository.deleteProjectOfAccount(accountId, 10)
        assertEquals(ProjectUpdDelResult.ProjectDoesNotBelongToAccount, wrongAccountResult)

        val nonExistentProjectResult = repository.deleteProjectOfAccount(accountId, 9)
        assertEquals(ProjectUpdDelResult.NonExistentProjectId, nonExistentProjectResult)
    }

    /**
     * Ensure the correct project and its tags are returned for the given id
     */
    @Test
    fun testReadProjectById() = runTest {
        val result = repository.readProjectWithRegionAndTagsById(10)
        assertNotNull(result)
        val (project, tags) = result
        val orga = ExampleOrgas.orgas[0]
        assertEquals(orga.orgId, project.orgId)
        val orgTags = ExampleOrgas.tagsOfOrga(orga)
        // In this test set a project has the same tags as its org
        assertContentEquals(tags, orgTags)
    }
}

private fun OrganizationRegisterResult.assertSuccess(): OrganizationId {
    return assertIs<OrganizationRegisterResult.Success>(this).id
}

private fun <T> ProjectCrRdResult<T>.assertSuccess(): T {
    return assertIs<ProjectCrRdResult.Success<T>>(this).value
}