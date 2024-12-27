package saplingsquad.api.service

import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service
import saplingsquad.api.BookmarksApiDelegate

@Service
class BookmarksApiService() : BookmarksApiDelegate  {
    override suspend fun bookmarkOrganization(orgaId: Int): ResponseEntity<Unit> {
        TODO("Not yet implemented")
    }

    override suspend fun bookmarkProject(projectId: Int): ResponseEntity<Unit> {
        TODO("Not yet implemented")
    }

    override suspend fun deleteOrganizationBookmark(orgaId: Int): ResponseEntity<Unit> {
        TODO("Not yet implemented")
    }

    override suspend fun deleteProjectBookmark(projectId: Int): ResponseEntity<Unit> {
        TODO("Not yet implemented")
    }
}
