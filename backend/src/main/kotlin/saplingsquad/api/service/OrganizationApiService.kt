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

    override suspend fun updateOrganization(organizationDescriptions: OrganizationDescriptions?): ResponseEntity<Unit> {
        TODO("Not yet implemented")
    }

    override suspend fun createProject(project: Project?): ResponseEntity<Int> {
        TODO("Not yet implemented")
    }

    override suspend fun updateProject(projectDescriptions: ProjectDescriptions?): ResponseEntity<Unit> {
        TODO("Not yet implemented")
    }

    override suspend fun deleteProject(projectId: Int): ResponseEntity<Unit> {
        TODO("Not yet implemented")
    }
}
