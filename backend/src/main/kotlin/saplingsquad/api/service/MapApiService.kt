package saplingsquad.api.service

import kotlinx.coroutines.flow.Flow
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service
import saplingsquad.api.MapApiDelegate
import saplingsquad.api.models.*

@Service
class MapApiService() : MapApiDelegate {
    override suspend fun getAssociation(assocId: Int): ResponseEntity<AssociationInformations> {
        TODO("Not yet implemented")
    }

    override fun getAssociations(): ResponseEntity<Flow<GetAssociations200ResponseInner>> {
        TODO("Not yet implemented")
    }

    override fun getAssociationsLocations(): ResponseEntity<Flow<GetAssociationsLocations200ResponseInner>> {
        TODO("Not yet implemented")
    }

    override suspend fun getProject(projectId: Int): ResponseEntity<ProjectInformations> {
        TODO("Not yet implemented")
    }

    override fun getProjects(): ResponseEntity<Flow<GetProjects200ResponseInner>> {
        TODO("Not yet implemented")
    }

    override fun getProjectsLocations(): ResponseEntity<Flow<GetProjectsLocations200ResponseInner>> {
        TODO("Not yet implemented")
    }

    override suspend fun getRegion(regionId: Int): ResponseEntity<RegionInformations> {
        TODO("Not yet implemented")
    }

    override fun getRegions(): ResponseEntity<Flow<GetRegions200ResponseInner>> {
        TODO("Not yet implemented")
    }
}
