package saplingsquad.api.service

import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.runBlocking
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken
import org.springframework.stereotype.Service
import saplingsquad.api.BookmarksApiDelegate
import saplingsquad.persistence.BookmarksRepository

@Service
class BookmarksApiService(private val bookmarksRepository: BookmarksRepository) : BookmarksApiDelegate {
    override suspend fun bookmarkOrganization(userToken: JwtAuthenticationToken, orgaId: Int): ResponseEntity<Unit> {
        TODO("Not yet implemented")
    }

    override suspend fun bookmarkProject(userToken: JwtAuthenticationToken, projectId: Int): ResponseEntity<Unit> {
        TODO("Not yet implemented")
    }

    override suspend fun deleteOrganizationBookmark(
        userToken: JwtAuthenticationToken, orgaId: Int
    ): ResponseEntity<Unit> {
        TODO("Not yet implemented")
    }

    override suspend fun deleteProjectBookmark(
        userToken: JwtAuthenticationToken, projectId: Int
    ): ResponseEntity<Unit> {
        TODO("Not yet implemented")
    }

    override fun getOrganizationBookmarks(userToken: JwtAuthenticationToken): ResponseEntity<Flow<Int>> {
        val result = runBlocking<Flow<Int>> {
            bookmarksRepository.readOrganizationBookmarks(userToken.token.subject).map { e -> e.orgId }
        }
        return ResponseEntity.ok().contentType(MediaType.TEXT_PLAIN).body(result)
    }

    override fun getProjectBookmarks(userToken: JwtAuthenticationToken): ResponseEntity<Flow<Int>> {
        val result = runBlocking<Flow<Int>> {
            bookmarksRepository.readProjectBookmarks(userToken.token.subject).map { e -> e.projectId }
        }
        return ResponseEntity.ok().contentType(MediaType.TEXT_PLAIN).body(result)
    }
}