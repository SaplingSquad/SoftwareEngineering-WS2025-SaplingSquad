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

    override suspend fun getOrganizationById(orgaId: Int): ResponseEntity<GetOrganizationById200Response> {
        val result =
            organizationsRepository.readOrganizationAndTagsAndProjectsById(orgaId) ?: throw ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "ID does not exist"
            )
        val org = result.org
        val tags = result.tags
        val projects = result.projects
        return GetOrganizationById200Response(
            orgaId = org.orgId,
            name = org.name,
            description = org.description,
            foundingYear = org.foundingYear,
            memberCount = org.memberCount,
            webpageUrl = org.websiteUrl,
            donatePageUrl = org.donationUrl,
            regionName = null, //TODO calculate and send region name
            iconUrl = "https://picsum.photos/200?x="+org.orgId, //TODO
            imageUrls = emptyList(), //TODO maybe implement images sometime
            coordinates = org.coordinates.toLonLatList(),
            tags = tags.toList(),
            projects = projects.map { (proj, projTags) ->
                GetOrganizationById200ResponseAllOfProjectsInner(
                    projectId = proj.projectId,
                    name = proj.title,
                    description = proj.description,
                    dateFrom = proj.dateFrom?.let(::dateToMonthAndYear),
                    dateTo = proj.dateTo?.let(::dateToMonthAndYear),
                    iconUrl = "https://picsum.photos/200?x="+proj.orgId, //TODO
                    regionName = null, //TODO calculate and send region name
                    imageUrls = emptyList(),
                    webpageUrl = proj.websiteUrl,
                    donatePageUrl = proj.donationUrl,
                    coordinates = proj.coordinates.toLonLatList(),
                    tags = projTags.toList(),
                    orgaId = proj.orgId
                )
            }
        ).asHttpOkResponse()
    }


    private suspend fun converOrgasToGeoJson(orgas: Flow<OrganizationEntity>): ResponseEntity<GeoJsonOrganizations> {
        return GeoJsonOrganizations(
            type = GeoJsonOrganizations.Type.FeatureCollection,
            features = orgas
                .map {
                    GeoFeatureOrganization(
                        type = GeoFeatureOrganization.Type.Feature,
                        properties = GeoFeatureOrganizationProperties(
                            orgaId = it.orgId
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

    override suspend fun getProjectById(projectId: Int): ResponseEntity<GetOrganizationById200ResponseAllOfProjectsInner> {
        TODO("Not yet implemented")
    }

    private suspend fun convertProjectsToGeoJson(projects: Flow<ProjectEntity>): ResponseEntity<GeoJsonProjects> {
        return GeoJsonProjects(
            type = GeoJsonProjects.Type.FeatureCollection,
            features = projects
                .map {
                    GeoFeatureProject(
                        type = GeoFeatureProject.Type.Feature,
                        properties = GeoFeatureProjectProperties(
                            projectId = it.projectId
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
        TODO("Not yet implemented")
    }

}
