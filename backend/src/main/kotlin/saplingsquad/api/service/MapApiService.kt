package saplingsquad.api.service

import kotlinx.coroutines.flow.Flow
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service
import saplingsquad.api.MapApiDelegate
import saplingsquad.api.models.*
import saplingsquad.persistence.OrganizationsRepository
import saplingsquad.utils.asHttpOkResponse

@Service
class MapApiService(val organizationsRepository: OrganizationsRepository) : MapApiDelegate {
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
                            //TODO change api to double
                            coordinates = listOf(
                                it.coordinates.coordinatesLon.toInt(),
                                it.coordinates.coordinatesLat.toInt()
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
        TODO("Not yet implemented")
    }

    override suspend fun getRegion(regionId: Int): ResponseEntity<RegionDescriptions> {
        TODO("Not yet implemented")
    }

    override suspend fun getRegions(answers: Map<String, String>?): ResponseEntity<GeoJsonRegions> {
        TODO("Not yet implemented")
    }
}
