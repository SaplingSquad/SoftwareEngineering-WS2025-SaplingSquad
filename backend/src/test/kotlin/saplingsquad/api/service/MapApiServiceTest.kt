package saplingsquad.api.service

import kotlinx.coroutines.test.runTest
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mock
import org.mockito.junit.jupiter.MockitoExtension
import org.mockito.kotlin.wheneverBlocking
import org.springframework.http.HttpStatus
import saplingsquad.api.models.*
import saplingsquad.api.placeholderIconUrl
import saplingsquad.api.placeholderImageUrls
import saplingsquad.api.toLonLatList
import saplingsquad.persistence.OrganizationsRepository
import saplingsquad.persistence.ProjectsRepository
import saplingsquad.persistence.RegionsRepository
import saplingsquad.persistence.SearchRepository
import saplingsquad.persistence.commands.SearchResultEntity
import saplingsquad.persistence.commands.SearchTypeFilter
import saplingsquad.persistence.tables.CoordinatesEmbedded
import saplingsquad.persistence.tables.OrganizationId
import saplingsquad.persistence.tables.ProjectId
import java.time.LocalDate
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertNotNull
import kotlin.test.assertNull


/**
 * Test correct behavior of [MapApiService]
 */
@ExtendWith(MockitoExtension::class)
class MapApiServiceTest {
    /**
     * Mock the persistence layer
     */
    @Mock
    lateinit var organizationsRepository: OrganizationsRepository

    @Mock
    lateinit var projectsRepository: ProjectsRepository

    @Mock
    lateinit var regionsRepository: RegionsRepository

    @Mock
    lateinit var searchRepository: SearchRepository

    private val exampleSearchResultEntities = listOf(
        organizationSearchResultEntity(1.0, 1),
        organizationSearchResultEntity(0.98, 2),
        projectSearchResultEntity(0.9, 10, 1),
        projectSearchResultEntity(0.9, 11, 1),
        projectSearchResultEntity(0.865, 12, 2),
        organizationSearchResultEntity(0.4, 3),
    )

    private val resultRankings = listOf(
        organizationRanking(100, 1),
        organizationRanking(98, 2),
        projectRanking(90, 10, 1),
        projectRanking(90, 11, 1),
        projectRanking(86, 12, 2),
        organizationRanking(40, 3),
    )

    private val onlyOrgasResultRankings =
        resultRankings.filter { it.entry is RankingsEntry.RankingResultOrganizationWithTypeWrapper }
    private val onlyProjectsResultRankings =
        resultRankings.filter { it.entry is RankingsEntry.RankingResultProjectWithTypeWrapper }

    private fun organizationSearchResultEntity(score: Double, id: OrganizationId) =
        SearchResultEntity(
            score = score,
            SearchResultEntity.Type.Organization,
            orgId = id,
            name = "org-$id",
            description = "description-$id",
            websiteUrl = "website-$id",
            donationUrl = "donation-$id",
            coordinates = CoordinatesEmbedded(1.0, 2.0 * id),
            regionName = "region-$id",
            foundingYear = 1900 + id,
            memberCount = id * 10,
            projectCount = id + 1,
            tags = listOf(3, id),
            projectId = null,
            title = null,
            dateFrom = null,
            dateTo = null,
            orgName = null,
        )

    private fun organizationRanking(score: Int, id: OrganizationId) = Rankings(
        RankingsEntry.RankingResultOrganizationWithTypeWrapper(
            RankingResultOrganizationWithType(
                RankingResultOrganizationWithType.Type.Organization, RankingResultOrganizationWithTypeContent(
                    id = id,
                    name = "org-$id",
                    description = "description-$id",
                    iconUrl = placeholderIconUrl(id),
                    coordinates = CoordinatesEmbedded(1.0, 2.0 * id).toLonLatList(),
                    imageUrls = placeholderImageUrls(id),
                    webPageUrl = "website-$id",
                    donatePageUrl = "donation-$id",
                    regionName = "region-$id",
                    foundingYear = 1900 + id,
                    memberCount = id * 10,
                    projectCount = id + 1,
                    tags = listOf(3, id),
                )
            ),
        ),
        percentageMatch = score
    )


    private fun projectSearchResultEntity(score: Double, id: ProjectId, orgId: OrganizationId) =
        SearchResultEntity(
            score = score,
            SearchResultEntity.Type.Project,
            projectId = id,
            orgId = orgId,
            title = "p-$id",
            description = "description-$id",
            websiteUrl = "website-$id",
            donationUrl = "donation-$id",
            coordinates = CoordinatesEmbedded(-2.0 * id, -3.0),
            regionName = "region-$id",
            dateFrom = LocalDate.of(2020 + id, 1, 1),
            dateTo = LocalDate.of(2021 + id, 12, 12),
            tags = listOf(5, id, orgId),
            orgName = "org-$orgId",
            foundingYear = null,
            memberCount = null,
            projectCount = null,
            name = null,
        )

    private fun projectRanking(score: Int, id: ProjectId, orgId: OrganizationId) = Rankings(
        RankingsEntry.RankingResultProjectWithTypeWrapper(
            RankingResultProjectWithType(
                RankingResultProjectWithType.Type.Project, RankingResultProjectWithTypeContent(
                    id = id,
                    orgaId = orgId,
                    name = "p-$id",
                    description = "description-$id",
                    iconUrl = placeholderIconUrl(orgId),
                    coordinates = CoordinatesEmbedded(-2.0 * id, -3.0).toLonLatList(),
                    tags = listOf(5, id, orgId),
                    orgaName = "org-$orgId",
                    regionName = "region-$id",
                    dateFrom = "${2020 + id}-01",
                    dateTo = "${2021 + id}-12",
                    imageUrls = placeholderImageUrls(id),
                    webPageUrl = "website-$id",
                    donatePageUrl = "donation-$id"
                )
            ),
        ),
        percentageMatch = score
    )

    private data class SearchInput(
        val answers: List<Int>,
        val maxMembers: Int,
        val search: String,
        val cId: String,
        val rId: String,
    )

    @Test
    fun testGetMatches() = runTest {
        val service =
            MapApiService(organizationsRepository, projectsRepository, regionsRepository, searchRepository)
        val answers = listOf(1, 4, 5)
        val maxMembers = 5
        val search = "test"
        val cId = "continent-1"
        val rId = "region-1"
        val searchInput = SearchInput(answers, maxMembers, search, cId, rId)

        wheneverBlocking {
            searchRepository.search(answers, maxMembers, search, cId, rId, SearchTypeFilter.All)
        }.thenReturn(exampleSearchResultEntities)
        wheneverBlocking {
            searchRepository.search(answers, maxMembers, search, cId, rId, SearchTypeFilter.Organizations)
        }.thenReturn(exampleSearchResultEntities.filter { it.type == SearchResultEntity.Type.Organization })
        wheneverBlocking {
            searchRepository.search(answers, maxMembers, search, cId, rId, SearchTypeFilter.Projects)
        }.thenReturn(exampleSearchResultEntities.filter { it.type == SearchResultEntity.Type.Project })


        checkMatchAllTypes(service, searchInput)
        checkMatchOrgasOnly(service, searchInput)
        checkMatchProjectsOnly(service, searchInput)
    }

    private suspend fun checkMatchAllTypes(
        service: MapApiService,
        s: SearchInput
    ) {
        val res = service.getMatches(s.answers, s.maxMembers, s.search, s.cId, s.rId, null)
        assertEquals(HttpStatus.OK, res.statusCode)
        val body = assertNotNull(res.body)
        assertEquals(resultRankings, body.rankings.toList())
        assertNotNull(body.organizationLocations)
        assertEquals(3, body.organizationLocations!!.features.size)
        assertNotNull(body.projectLocations)
        assertEquals(3, body.projectLocations!!.features.size)
    }

    private suspend fun checkMatchOrgasOnly(
        service: MapApiService,
        s: SearchInput
    ) {
        val res = service.getMatches(s.answers, s.maxMembers, s.search, s.cId, s.rId, ObjectType.Organization)
        assertEquals(HttpStatus.OK, res.statusCode)
        val body = assertNotNull(res.body)
        assertEquals(onlyOrgasResultRankings, body.rankings.toList())
        assertNotNull(body.organizationLocations)
        assertEquals(3, body.organizationLocations!!.features.size)
        assertNull(body.projectLocations)
    }

    private suspend fun checkMatchProjectsOnly(
        service: MapApiService,
        s: SearchInput,
    ) {
        val res = service.getMatches(s.answers, s.maxMembers, s.search, s.cId, s.rId, ObjectType.Project)
        assertEquals(HttpStatus.OK, res.statusCode)
        val body = assertNotNull(res.body)
        assertEquals(onlyProjectsResultRankings, body.rankings.toList())
        assertNotNull(body.projectLocations)
        assertEquals(3, body.projectLocations!!.features.size)
        assertNull(body.organizationLocations)
    }
}