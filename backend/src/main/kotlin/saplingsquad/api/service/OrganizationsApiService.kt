package saplingsquad.api.service

import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service
import saplingsquad.api.OrganizationsApiDelegate
import saplingsquad.api.models.*

@Service
class OrganizationsApiService() : OrganizationsApiDelegate  {
    override suspend fun createOrganization(organization: Organization?): ResponseEntity<Unit> {
        TODO("Not yet implemented")
    }

    override suspend fun createProject(project: Project?): ResponseEntity<Unit> {
        TODO("Not yet implemented")
    }

    override suspend fun deleteOrganization(userToken: String, orgaId: Int): ResponseEntity<Unit> {
        TODO("Not yet implemented")
    }

    override suspend fun deleteProject(userToken: String, projectId: Int): ResponseEntity<Unit> {
        TODO("Not yet implemented")
    }

    override suspend fun updateOrganization(
        userToken: String,
        organizationDescriptions: OrganizationDescriptions?
    ): ResponseEntity<Unit> {
        TODO("Not yet implemented")
    }

    override suspend fun updateProject(
        userToken: String,
        projectDescriptions: ProjectDescriptions?
    ): ResponseEntity<Unit> {
        TODO("Not yet implemented")
    }

}
