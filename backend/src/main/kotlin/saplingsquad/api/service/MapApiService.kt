package saplingsquad.api.service

import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.toList
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service
import org.springframework.web.server.ResponseStatusException
import saplingsquad.api.MapApiDelegate
import saplingsquad.api.dateToMonthAndYear
import saplingsquad.api.models.*
import saplingsquad.api.toLonLatList
import saplingsquad.persistence.OrganizationsRepository
import saplingsquad.persistence.ProjectsRepository
import saplingsquad.persistence.RegionsRepository
import saplingsquad.persistence.tables.OrganizationEntity
import saplingsquad.persistence.tables.ProjectEntity
import saplingsquad.utils.asHttpOkResponse
import saplingsquad.utils.flowOfList

@Service
class MapApiService(
    val organizationsRepository: OrganizationsRepository,
    val projectsRepository: ProjectsRepository,
    val regionsRepository: RegionsRepository
) : MapApiDelegate {
    override suspend fun getMatches(
        answers: List<Int>?,
        maxMembers: Int?,
        searchText: String?,
        continentId: String?,
        regionId: String?,
        type: ObjectType?
    ): ResponseEntity<GetMatches200Response> {
        TODO("Not yet implemented")
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
            iconUrl = "https://picsum.photos/200?x=" + org.orgId, //TODO
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
                    iconUrl = "https://picsum.photos/200?x=" + proj.orgId, //TODO
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


    private suspend fun convertOrgasToGeoJson(orgas: Flow<OrganizationEntity>): ResponseEntity<GeoJsonOrganizations> {
        return GeoJsonOrganizations(
            type = GeoJsonOrganizations.Type.FeatureCollection,
            features = orgas
                .map {
                    GeoFeatureOrganization(
                        type = GeoFeatureOrganization.Type.Feature,
                        properties = GeoFeatureOrganizationProperties(
                            id = it.orgId
                        ),
                        geometry = GeoGeometry(
                            type = GeoGeometry.Type.Point,
                            coordinates = it.coordinates.toLonLatList()
                        )
                    )
                }
                .toList()
        ).asHttpOkResponse()
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

    private suspend fun convertProjectsToGeoJson(projects: Flow<ProjectEntity>): ResponseEntity<GeoJsonProjects> {
        return GeoJsonProjects(
            type = GeoJsonProjects.Type.FeatureCollection,
            features = projects
                .map {
                    GeoFeatureProject(
                        type = GeoFeatureProject.Type.Feature,
                        properties = GeoFeatureProjectProperties(
                            id = it.projectId
                        ),
                        geometry = GeoGeometry(
                            type = GeoGeometry.Type.Point,
                            coordinates = it.coordinates.toLonLatList()
                        )
                    )
                }
                .toList()
        ).asHttpOkResponse()
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
