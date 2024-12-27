package saplingsquad.api.service

import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service
import saplingsquad.api.OrganizationApiDelegate
import saplingsquad.api.models.*

@Service
class OrganizationApiService() : OrganizationApiDelegate {
    override suspend fun registerOrganization(organization: Organization): ResponseEntity<Int> {
        TODO("Not yet implemented")
    }

    override suspend fun updateOrganization(
        orgaToken: String,
        organizationDescriptions: OrganizationDescriptions?
    ): ResponseEntity<Unit> {
        TODO("Not yet implemented")
    }

    override suspend fun createProject(project: Project?): ResponseEntity<Int> {
        TODO("Not yet implemented")
    }

    override suspend fun updateProject(
        orgaToken: String,
        projectDescriptions: ProjectDescriptions?
    ): ResponseEntity<Unit> {
        TODO("Not yet implemented")
    }

    override suspend fun deleteProject(orgaToken: String, projectId: Int): ResponseEntity<Unit> {
        TODO("Not yet implemented")
    }
}
