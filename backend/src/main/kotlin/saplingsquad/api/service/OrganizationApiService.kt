package saplingsquad.api.service

import kotlinx.coroutines.flow.Flow
import org.springframework.http.ResponseEntity
import org.springframework.http.server.reactive.ServerHttpRequest
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken
import org.springframework.stereotype.Service
import saplingsquad.api.OrganizationApiDelegate
import saplingsquad.api.models.*

@Service
class OrganizationApiService() : OrganizationApiDelegate {
    override suspend fun registerOrganization(
        orgaToken: JwtAuthenticationToken,
        organization: Organization
    ): ResponseEntity<Int> {
        TODO("Not yet implemented")
    }

    override suspend fun getOrganization(orgaToken: JwtAuthenticationToken): ResponseEntity<Organization> {
        TODO("Not yet implemented")
    }

    override suspend fun updateOrganization(
        orgaToken: JwtAuthenticationToken,
        organizationDescriptions: OrganizationDescriptions?
    ): ResponseEntity<Unit> {
        TODO("Not yet implemented")
    }

    override suspend fun createProject(orgaToken: JwtAuthenticationToken, project: Project?): ResponseEntity<Int> {
        TODO("Not yet implemented")
    }

    override fun getProjectForOrga(orgaToken: JwtAuthenticationToken): ResponseEntity<Flow<GetProjectForOrga200ResponseInner>> {
        TODO("Not yet implemented")
    }

    override suspend fun updateProject(
        orgaToken: JwtAuthenticationToken,
        projectDescriptions: ProjectDescriptions?
    ): ResponseEntity<Unit> {
        TODO("Not yet implemented")
    }

    override suspend fun deleteProject(orgaToken: JwtAuthenticationToken, projectId: Int): ResponseEntity<Unit> {
        TODO("Not yet implemented")
    }
}
