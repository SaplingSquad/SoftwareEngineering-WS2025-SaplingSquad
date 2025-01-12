package saplingsquad.api.service

import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import org.springframework.http.ResponseEntity
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken
import org.springframework.stereotype.Service
import saplingsquad.api.BookmarksApiDelegate
import saplingsquad.persistence.BookmarksRepository

@Service
class BookmarksApiService(private val bookmarksRepository: BookmarksRepository) : BookmarksApiDelegate {
    override suspend fun postOrganizationBookmark(userToken: JwtAuthenticationToken, id: Int): ResponseEntity<Unit> {
        bookmarksRepository.insertOrganizationBookmark(userToken.token.subject, id)
        return ResponseEntity.noContent().build()
    }

    override suspend fun postProjectBookmark(userToken: JwtAuthenticationToken, id: Int): ResponseEntity<Unit> {
        bookmarksRepository.insertProjectBookmark(userToken.token.subject, id)
        return ResponseEntity.noContent().build()
    }

    override suspend fun deleteOrganizationBookmark(userToken: JwtAuthenticationToken, id: Int): ResponseEntity<Unit> {
        bookmarksRepository.deleteOrganizationBookmark(userToken.token.subject, id)
        return ResponseEntity.noContent().build()
    }

    override suspend fun deleteProjectBookmark(userToken: JwtAuthenticationToken, id: Int): ResponseEntity<Unit> {
        bookmarksRepository.deleteProjectBookmark(userToken.token.subject, id)
        return ResponseEntity.noContent().build()
    }

    override fun getOrganizationBookmarks(userToken: JwtAuthenticationToken): ResponseEntity<Flow<Int>> {
        val result = bookmarksRepository.readOrganizationBookmarks(userToken.token.subject).map { e -> e.orgId }
        return ResponseEntity.ok().body(result)
    }

    override fun getProjectBookmarks(userToken: JwtAuthenticationToken): ResponseEntity<Flow<Int>> {
        val result = bookmarksRepository.readProjectBookmarks(userToken.token.subject).map { e -> e.projectId }
        return ResponseEntity.ok().body(result)
    }
}