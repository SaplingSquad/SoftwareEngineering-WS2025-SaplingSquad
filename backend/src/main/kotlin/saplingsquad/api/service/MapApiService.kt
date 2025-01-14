package saplingsquad.api.service

import kotlinx.coroutines.flow.Flow
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service
import org.springframework.web.server.ResponseStatusException
import saplingsquad.api.MapApiDelegate
import saplingsquad.api.dateToMonthAndYear
import saplingsquad.api.models.*
import saplingsquad.api.placeholderIconUrl
import saplingsquad.api.toLonLatList
import saplingsquad.persistence.OrganizationsRepository
import saplingsquad.persistence.ProjectsRepository
import saplingsquad.persistence.RegionsRepository
import saplingsquad.persistence.SearchRepository
import saplingsquad.persistence.commands.SearchResultEntity
import saplingsquad.persistence.commands.SearchTypeFilter
import saplingsquad.utils.asHttpOkResponse
import saplingsquad.utils.flowOfList

@Service
class MapApiService(
    val organizationsRepository: OrganizationsRepository,
    val projectsRepository: ProjectsRepository,
    val regionsRepository: RegionsRepository,
    val searchRepository: SearchRepository,
) : MapApiDelegate {
    override suspend fun getMatches(
        answers: List<Int>?,
        maxMembers: Int?,
        searchText: String?,
        continentId: String?,
        regionId: String?,
        type: ObjectType?
    ): ResponseEntity<GetMatches200Response> {
        val typeFilter = when (type) {
            ObjectType.Organization -> SearchTypeFilter.Organizations
            ObjectType.Project -> SearchTypeFilter.Projects
            null -> SearchTypeFilter.All
        }
        val results = searchRepository.search(
            answers = answers ?: emptyList(),
            maxMembers = maxMembers,
            searchText = searchText,
            continentId = continentId,
            regionId = regionId,
            type = typeFilter
        ).map {
            Rankings(
                entry = toRankingEntry(it),
                percentageMatch = (it.score * 100).toInt()
            )
        }
        return GetMatches200Response(
            rankings = results,
            organizationLocations = if (typeFilter.loadOrganizations)
                convertSearchResultToOrgasGeoJson(results.asSequence())
            else null,
            projectLocations = if (typeFilter.loadProjects)
                convertSearchResultToProjectsJson(results.asSequence())
            else null
        ).asHttpOkResponse()
    }

    override suspend fun getOrganizationById(id: Int): ResponseEntity<GetOrganizationById200Response> {
        val result =
            organizationsRepository.readOrganizationAndTagsAndProjectsById(id) ?: throw ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "ID does not exist"
            )
        val org = result.org
        val tags = result.tags
        val projects = result.projects
        return GetOrganizationById200Response(
            id = org.orgId,
            name = org.name,
            description = org.description,
            foundingYear = org.foundingYear,
            memberCount = org.memberCount,
            webPageUrl = org.websiteUrl,
            donatePageUrl = org.donationUrl,
            regionName = org.regionName,
            iconUrl = placeholderIconUrl(org.orgId),
            imageUrls = emptyList(), //TODO maybe implement images sometime
            coordinates = org.coordinates.toLonLatList(),
            tags = tags.toList(),
            projects = projects.map { (proj, projTags) ->
                GetOrganizationById200ResponseAllOfProjectsInner(
                    id = proj.projectId,
                    name = proj.title,
                    description = proj.description,
                    dateFrom = proj.dateFrom?.let(::dateToMonthAndYear),
                    dateTo = proj.dateTo?.let(::dateToMonthAndYear),
                    iconUrl = placeholderIconUrl(org.orgId),
                    regionName = proj.regionName,
                    imageUrls = emptyList(),
                    webPageUrl = proj.websiteUrl,
                    donatePageUrl = proj.donationUrl,
                    coordinates = proj.coordinates.toLonLatList(),
                    tags = projTags.toList(),
                    orgaId = proj.orgId
                )
            }
        ).asHttpOkResponse()
    }


    private suspend fun convertSearchResultToOrgasGeoJson(orgas: Sequence<Rankings>): GeoJsonOrganizations {
        return GeoJsonOrganizations(
            type = GeoJsonOrganizations.Type.FeatureCollection,
            features = orgas
                .map { it.entry }
                .filterIsInstance<RankingsEntry.RankingResultOrganizationWithTypeWrapper>()
                .map {
                    GeoFeatureOrganization(
                        type = GeoFeatureOrganization.Type.Feature,
                        properties = GeoFeatureOrganizationProperties(
                            id = it.wrapped.content.id
                        ),
                        geometry = GeoGeometry(
                            type = GeoGeometry.Type.Point,
                            coordinates = it.wrapped.content.coordinates
                        )
                    )
                }
                .toList()
        )
    }

    override suspend fun getProjectById(id: Int): ResponseEntity<GetProjectById200Response> {
        val (project, tags) =
            projectsRepository.readProjectWithRegionAndTagsById(id) ?: throw ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "ID does not exist"
            )
        val (org, _, _) = organizationsRepository.readOrganizationAndTagsAndProjectsById(project.orgId)
            ?: throw ResponseStatusException(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Organization ID does not exist"
            )
        return GetProjectById200Response(
            id = project.projectId,
            orgaId = org.orgId,
            name = project.title,
            description = project.description,
            iconUrl = "https://picsum.photos/200?x=" + project.orgId, //TODO
            coordinates = project.coordinates.toLonLatList(),
            tags = tags.toList(),
            orgaName = org.name,
            regionName = project.regionName,
            dateFrom = project.dateFrom?.let(::dateToMonthAndYear),
            dateTo = project.dateTo?.let(::dateToMonthAndYear),
            imageUrls = emptyList(), //TODO
            webPageUrl = project.websiteUrl,
            donatePageUrl = project.donationUrl
        ).asHttpOkResponse()
    }

    private suspend fun convertSearchResultToProjectsJson(projects: Sequence<Rankings>): GeoJsonProjects {
        return GeoJsonProjects(
            type = GeoJsonProjects.Type.FeatureCollection,
            features = projects
                .map { it.entry }
                .filterIsInstance<RankingsEntry.RankingResultOrganizationWithTypeWrapper>()
                .map {
                    GeoFeatureProject(
                        type = GeoFeatureProject.Type.Feature,
                        properties = GeoFeatureProjectProperties(
                            id = it.wrapped.content.id
                        ),
                        geometry = GeoGeometry(
                            type = GeoGeometry.Type.Point,
                            coordinates = it.wrapped.content.coordinates
                        )
                    )
                }
                .toList()
        )
    }

    override fun getRegions(): ResponseEntity<Flow<GetRegions200ResponseInner>> {
        return flowOfList {
            regionsRepository.readRegions().map { (continent, regions) ->
                GetRegions200ResponseInner(
                    id = continent.continentId,
                    name = continent.continent,
                    regions = regions.map {
                        GetRegions200ResponseInnerRegionsInner(
                            id = it.regionId,
                            name = it.name
                        )
                    })
            }
        }.asHttpOkResponse()
    }

}

private fun toRankingEntry(searchResultEntity: SearchResultEntity): RankingsEntry {
    return when (searchResultEntity.type) {
        SearchResultEntity.Type.Organization -> {
            val e = searchResultEntity.toOrganizationEntity()!!
            val org = e.org
            RankingsEntry.RankingResultOrganizationWithTypeWrapper(
                RankingResultOrganizationWithType(
                    type = RankingResultOrganizationWithType.Type.Organization,
                    content = RankingResultOrganizationWithTypeContent(
                        id = org.orgId,
                        name = org.name,
                        description = org.description,
                        iconUrl = placeholderIconUrl(org.orgId),
                        foundingYear = org.foundingYear,
                        memberCount = org.memberCount,
                        webPageUrl = org.websiteUrl,
                        donatePageUrl = org.donationUrl,
                        imageUrls = emptyList(), //TODO maybe implement images sometime
                        coordinates = org.coordinates.toLonLatList(),
                        regionName = org.regionName,
                        projectCount = e.projectCount,
                        tags = e.tags
                    )
                )
            )
        }

        SearchResultEntity.Type.Project -> {
            val e = searchResultEntity.toProjectEntity()!!
            val proj = e.proj
            RankingsEntry.RankingResultProjectWithTypeWrapper(
                RankingResultProjectWithType(
                    type = RankingResultProjectWithType.Type.Project,
                    content = RankingResultProjectWithTypeContent(
                        id = proj.projectId,
                        orgaId = proj.orgId,
                        name = proj.title,
                        description = proj.description,
                        iconUrl = placeholderIconUrl(proj.orgId),
                        dateFrom = proj.dateFrom?.let { dateToMonthAndYear(it) },
                        dateTo = proj.dateTo?.let { dateToMonthAndYear(it) },
                        webPageUrl = proj.websiteUrl,
                        donatePageUrl = proj.donationUrl,
                        imageUrls = emptyList(), //TODO maybe implement images sometime
                        coordinates = proj.coordinates.toLonLatList(),
                        regionName = proj.regionName,
                        orgaName = e.orgName,
                        tags = e.tags
                    )
                )
            )
        }
    }
}