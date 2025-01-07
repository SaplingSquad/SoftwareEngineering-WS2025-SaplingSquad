package saplingsquad.api.service

import kotlinx.coroutines.flow.Flow
import org.springframework.http.ResponseEntity
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken
import org.springframework.stereotype.Service
import saplingsquad.api.BookmarksApiDelegate

@Service
class BookmarksApiService() : BookmarksApiDelegate {

    override suspend fun bookmarkOrganization(userToken: JwtAuthenticationToken, orgaId: Int): ResponseEntity<Unit> {
        TODO("Not yet implemented")
    }

    override suspend fun bookmarkProject(userToken: JwtAuthenticationToken, projectId: Int): ResponseEntity<Unit> {
        TODO("Not yet implemented")
    }

    override suspend fun deleteOrganizationBookmark(
        userToken: JwtAuthenticationToken,
        orgaId: Int
    ): ResponseEntity<Unit> {
        TODO("Not yet implemented")
    }

    override suspend fun deleteProjectBookmark(
        userToken: JwtAuthenticationToken,
        projectId: Int
    ): ResponseEntity<Unit> {
        TODO("Not yet implemented")
    }

    override fun getOrganizationBookmarks(userToken: JwtAuthenticationToken): ResponseEntity<Flow<Int>> {
        TODO("Not yet implemented")
    }

    override fun getProjectBookmarks(userToken: JwtAuthenticationToken): ResponseEntity<Flow<Int>> {
        TODO("Not yet implemented")
    }

}
