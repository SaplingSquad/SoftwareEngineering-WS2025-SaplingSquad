package saplingsquad.api.service

import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.toList
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service
import saplingsquad.api.MapApiDelegate
import saplingsquad.api.models.*
import saplingsquad.persistence.OrganizationsRepository
import saplingsquad.persistence.ProjectsRepository
import saplingsquad.persistence.RegionsRepository
import saplingsquad.utils.asHttpOkResponse

@Service
class MapApiService(
    val organizationsRepository: OrganizationsRepository,
    val projectsRepository: ProjectsRepository,
    val regionsRepository: RegionsRepository
) : MapApiDelegate {
    override suspend fun getOrganizationDetails(orgaId: Int): ResponseEntity<OrganizationDescriptions> {
        TODO("Not yet implemented")
    }

    override fun getOrganizations(): ResponseEntity<Flow<GetOrganizations200ResponseInner>> {
        TODO("Not yet implemented")
    }

    override suspend fun getOrganizationsLocations(answers: List<Int>?): ResponseEntity<GeoJsonOrganizations> {
        return GeoJsonOrganizations(
            type = GeoJsonOrganizations.Type.FeatureCollection,
            features = organizationsRepository
                .readOrganizations(answers ?: emptyList())
                .map {
                    GeoFeatureOrganization(
                        type = GeoFeatureOrganization.Type.Feature,
                        properties = GeoFeatureOrganizationProperties(
                            orgaId = it.orgId
                        ),
                        geometry = GeoGeometry(
                            type = GeoGeometry.Type.Point,
                            coordinates = listOf(
                                it.coordinates.coordinatesLon.toBigDecimal(),
                                it.coordinates.coordinatesLat.toBigDecimal()
                            )
                        )
                    )
                }
                .toList()
        ).asHttpOkResponse()
    }

    override suspend fun getProject(projectId: Int): ResponseEntity<ProjectDescriptions> {
        TODO("Not yet implemented")
    }

    override fun getProjects(): ResponseEntity<Flow<GetProjects200ResponseInner>> {
        TODO("Not yet implemented")
    }

    override suspend fun getProjectsLocations(answers: List<Int>?): ResponseEntity<GeoJsonProjects> {
        return GeoJsonProjects(
            type = GeoJsonProjects.Type.FeatureCollection,
            features = projectsRepository
                .readProjects(answers ?: emptyList())
                .map {
                    GeoFeatureProject(
                        type = GeoFeatureProject.Type.Feature,
                        properties = GeoFeatureProjectProperties(
                            projectId = it.projectId
                        ),
                        geometry = GeoGeometry(
                            type = GeoGeometry.Type.Point,
                            coordinates = listOf(
                                it.coordinates.coordinatesLon.toBigDecimal(),
                                it.coordinates.coordinatesLat.toBigDecimal()
                            )
                        )
                    )
                }
                .toList()
        ).asHttpOkResponse()
    }

    override suspend fun getRegion(regionId: Int): ResponseEntity<RegionDescriptions> {
        TODO("Not yet implemented")
    }

    override suspend fun getRegions(answers: List<Int>?): ResponseEntity<GeoJsonRegions> {
        return GeoJsonRegions(
            type = GeoJsonRegions.Type.FeatureCollection,
            features = regionsRepository
                .readRegions()
                .map {
                    GeoFeatureRegion(
                        type = GeoFeatureRegion.Type.Feature,
                        properties = GeoFeatureRegionProperties(
                            regionId = it.regionId,
                            name = it.name
                        ),
                        geometry = GeoGeometry(
                            type = GeoGeometry.Type.Point,
                            coordinates = listOf(
                                it.coordinates.coordinatesLon.toBigDecimal(),
                                it.coordinates.coordinatesLat.toBigDecimal()
                            )
                        )
                    )
                }
        ).asHttpOkResponse()
    }

}
