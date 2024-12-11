package saplingsquad.api.service

import kotlinx.coroutines.flow.Flow
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service
import saplingsquad.api.MapApiDelegate
import saplingsquad.api.models.*

@Service
class MapApiService() : MapApiDelegate {
    override suspend fun getOrganization(orgaId: Int): ResponseEntity<OrganizationInformations> {
        TODO("Not yet implemented")
    }

    override fun getOrganizations(): ResponseEntity<Flow<GetOrganizations200ResponseInner>> {
        TODO("Not yet implemented")
    }

    override suspend fun getOrganizationsLocations(answers: Map<String, Any>?): ResponseEntity<GeoJsonOrganizations> {
        TODO("Not yet implemented")
    }

    override suspend fun getProject(projectId: Int): ResponseEntity<ProjectInformations> {
        TODO("Not yet implemented")
    }

    override fun getProjects(): ResponseEntity<Flow<GetProjects200ResponseInner>> {
        TODO("Not yet implemented")
    }

    override suspend fun getProjectsLocations(answers: Map<String, Any>?): ResponseEntity<GeoJsonProjects> {
        TODO("Not yet implemented")
    }

    override suspend fun getRegion(regionId: Int): ResponseEntity<RegionInformations> {
        TODO("Not yet implemented")
    }

    override suspend fun getRegions(answers: Map<String, Any>?): ResponseEntity<GeoJsonRegions> {
        TODO("Not yet implemented")
    }
}
