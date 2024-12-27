package saplingsquad.api.service

import org.springframework.http.ResponseEntity
import org.springframework.http.server.reactive.ServerHttpRequest
import org.springframework.stereotype.Service
import org.springframework.web.context.request.NativeWebRequest
import saplingsquad.api.BookmarksApiDelegate
import java.util.*

@Service
class BookmarksApiService() : BookmarksApiDelegate  {

    override suspend fun bookmarkOrganization(rawRequest: ServerHttpRequest, orgaId: Int): ResponseEntity<Unit> {
        TODO("Not yet implemented")
    }

    override suspend fun bookmarkProject(rawRequest: ServerHttpRequest, projectId: Int): ResponseEntity<Unit> {
        TODO("Not yet implemented")
    }

    override suspend fun deleteOrganizationBookmark(rawRequest: ServerHttpRequest, orgaId: Int): ResponseEntity<Unit> {
        TODO("Not yet implemented")
    }

    override suspend fun deleteProjectBookmark(rawRequest: ServerHttpRequest, projectId: Int): ResponseEntity<Unit> {
        TODO("Not yet implemented")
    }
}
