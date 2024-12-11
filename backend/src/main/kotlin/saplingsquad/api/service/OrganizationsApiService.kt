package saplingsquad.api.service

import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service
import saplingsquad.api.OrganizationsApiDelegate
import saplingsquad.api.models.Organization
import saplingsquad.api.models.OrganizationInformations
import saplingsquad.api.models.Project
import saplingsquad.api.models.ProjectInformations

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
        organizationInformations: OrganizationInformations?
    ): ResponseEntity<Unit> {
        TODO("Not yet implemented")
    }

    override suspend fun updateProject(
        userToken: String,
        projectInformations: ProjectInformations?
    ): ResponseEntity<Unit> {
        TODO("Not yet implemented")
    }
}
