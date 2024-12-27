package saplingsquad.api.service

import kotlinx.coroutines.flow.Flow
import org.springframework.http.ResponseEntity
import org.springframework.http.server.reactive.ServerHttpRequest
import org.springframework.stereotype.Service
import saplingsquad.api.OrganizationApiDelegate
import saplingsquad.api.models.*

@Service
class OrganizationApiService() : OrganizationApiDelegate {
    override suspend fun registerOrganization(
        rawRequest: ServerHttpRequest,
        organization: Organization
    ): ResponseEntity<Int> {
        TODO("Not yet implemented")
    }

    override suspend fun getOrganization(rawRequest: ServerHttpRequest): ResponseEntity<Organization> {
        TODO("Not yet implemented")
    }

    override suspend fun updateOrganization(
        rawRequest: ServerHttpRequest,
        organizationDescriptions: OrganizationDescriptions?
    ): ResponseEntity<Unit> {
        TODO("Not yet implemented")
    }

    override suspend fun createProject(rawRequest: ServerHttpRequest, project: Project?): ResponseEntity<Int> {
        TODO("Not yet implemented")
    }

    override fun getProjectForOrga(rawRequest: ServerHttpRequest): ResponseEntity<Flow<GetProjectForOrga200ResponseInner>> {
        TODO("Not yet implemented")
    }

    override suspend fun updateProject(
        rawRequest: ServerHttpRequest,
        projectDescriptions: ProjectDescriptions?
    ): ResponseEntity<Unit> {
        TODO("Not yet implemented")
    }

    override suspend fun deleteProject(rawRequest: ServerHttpRequest, projectId: Int): ResponseEntity<Unit> {
        TODO("Not yet implemented")
    }
}
