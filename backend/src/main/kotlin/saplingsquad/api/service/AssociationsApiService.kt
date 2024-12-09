package saplingsquad.api.service

import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service
import saplingsquad.api.AssociationsApiDelegate
import saplingsquad.api.models.Association
import saplingsquad.api.models.AssociationInformations
import saplingsquad.api.models.Project
import saplingsquad.api.models.ProjectInformations

@Service
class AssociationsApiService() : AssociationsApiDelegate  {
    override suspend fun createAssociation(association: Association?): ResponseEntity<Unit> {
        TODO("Not yet implemented")
    }

    override suspend fun createProject(project: Project?): ResponseEntity<Unit> {
        TODO("Not yet implemented")
    }

    override suspend fun deleteAssociation(userToken: String, assocId: Int): ResponseEntity<Unit> {
        TODO("Not yet implemented")
    }

    override suspend fun deleteProject(userToken: String, projectId: Int): ResponseEntity<Unit> {
        TODO("Not yet implemented")
    }

    override suspend fun updateAssociation(
        userToken: String,
        associationInformations: AssociationInformations?
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
