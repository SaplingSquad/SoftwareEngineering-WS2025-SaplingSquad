package saplingsquad.api.service

import kotlinx.coroutines.flow.Flow
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service
import saplingsquad.api.MapApiDelegate
import saplingsquad.api.models.*
import saplingsquad.persistence.OrganizationsRepository
import saplingsquad.persistence.ProjectsRepository
import saplingsquad.persistence.RegionsRepository
import saplingsquad.utils.asHttpOkResponse
import java.math.MathContext

@Service
class MapApiService(
    val organizationsRepository: OrganizationsRepository,
    val projectsRepository: ProjectsRepository,
    val regionsRepository: RegionsRepository
) : MapApiDelegate {
    override suspend fun getOrganization(orgaId: Int): ResponseEntity<OrganizationDescriptions> {
        TODO("Not yet implemented")
    }

    override fun getOrganizations(): ResponseEntity<Flow<GetOrganizations200ResponseInner>> {
        TODO("Not yet implemented")
    }

    override suspend fun getOrganizationsLocations(answers: Map<String, String>?): ResponseEntity<GeoJsonOrganizations> {
        return GeoJsonOrganizations(
            type = GeoJsonOrganizations.Type.FeatureCollection,
            features = organizationsRepository
                .readOrganizations()
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
        ).asHttpOkResponse()
    }

    override suspend fun getProject(projectId: Int): ResponseEntity<ProjectDescriptions> {
        TODO("Not yet implemented")
    }

    override fun getProjects(): ResponseEntity<Flow<GetProjects200ResponseInner>> {
        TODO("Not yet implemented")
    }

    override suspend fun getProjectsLocations(answers: Map<String, String>?): ResponseEntity<GeoJsonProjects> {
        return GeoJsonProjects(
            type = GeoJsonProjects.Type.FeatureCollection,
            features = projectsRepository
                .readProjects()
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
        ).asHttpOkResponse()
    }

    override suspend fun getRegion(regionId: Int): ResponseEntity<RegionDescriptions> {
        TODO("Not yet implemented")
    }

    override suspend fun getRegions(answers: Map<String, String>?): ResponseEntity<GeoJsonRegions> {
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
