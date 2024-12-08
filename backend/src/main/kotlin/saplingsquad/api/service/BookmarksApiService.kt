package saplingsquad.api.service

import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service
import saplingsquad.api.BookmarksApiDelegate

@Service
class BookmarksApiService() : BookmarksApiDelegate  {
    override suspend fun bookmarkAssocisation(userToken: String, assocId: Int): ResponseEntity<Unit> {
        TODO("Not yet implemented")
    }

    override suspend fun bookmarkProject(userToken: String, projectId: Int): ResponseEntity<Unit> {
        TODO("Not yet implemented")
    }

    override suspend fun deleteAssociationBookmark(userToken: String, assocId: Int): ResponseEntity<Unit> {
        TODO("Not yet implemented")
    }

    override suspend fun deleteProjectBookmark(userToken: String, projectId: Int): ResponseEntity<Unit> {
        TODO("Not yet implemented")
    }
}
