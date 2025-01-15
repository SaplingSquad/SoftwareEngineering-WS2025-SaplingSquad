package saplingsquad.api.service

import kotlinx.coroutines.flow.asFlow
import kotlinx.coroutines.flow.toList
import kotlinx.coroutines.test.runTest
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mock
import org.mockito.junit.jupiter.MockitoExtension
import org.mockito.kotlin.verify
import org.mockito.kotlin.whenever
import org.springframework.http.HttpStatus
import org.springframework.security.oauth2.jwt.Jwt
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken
import saplingsquad.persistence.BookmarksRepository
import saplingsquad.persistence.tables.OrganizationBookmarksEntity
import saplingsquad.persistence.tables.ProjectBookmarksEntity
import java.time.Instant
import kotlin.test.assertEquals

/**
 * Test correct behavior of [BookmarksApiService]
 */
@ExtendWith(MockitoExtension::class)
class BookmarksApiServiceTest {

    /**
     * Mock the persistence layer
     */
    @Mock
    lateinit var repository: BookmarksRepository

    private val userId: String = "testaccount-1"
    private val testToken: JwtAuthenticationToken = JwtAuthenticationToken(
        Jwt.withTokenValue("token")
            .issuedAt(Instant.MIN)
            .expiresAt(Instant.MAX)
            .header("test", "header")
            .subject(userId)
            .build()
    )

    @Test
    fun testPostOrganizationBookmark() = runTest {
        val orgId = 50
        val service = BookmarksApiService(repository)
        val result = service.postOrganizationBookmark(testToken, orgId)
        assertEquals(HttpStatus.NO_CONTENT, result.statusCode)

        verify(repository).insertOrganizationBookmark(userId, orgId)
    }

    @Test
    fun testPostProjectBookmark() = runTest {
        val projectId = 100
        val service = BookmarksApiService(repository)
        val result = service.postProjectBookmark(testToken, projectId)
        assertEquals(HttpStatus.NO_CONTENT, result.statusCode)

        verify(repository).insertProjectBookmark(userId, projectId)
    }

    @Test
    fun testDeleteOrganizationBookmark() = runTest {
        val orgId = 50
        val service = BookmarksApiService(repository)
        val result = service.deleteOrganizationBookmark(testToken, orgId)
        assertEquals(HttpStatus.NO_CONTENT, result.statusCode)

        verify(repository).deleteOrganizationBookmark(userId, orgId)
    }

    @Test
    fun testDeleteProjectBookmark() = runTest {
        val projectId = 100
        val service = BookmarksApiService(repository)
        val result = service.deleteProjectBookmark(testToken, projectId)
        assertEquals(HttpStatus.NO_CONTENT, result.statusCode)

        verify(repository).deleteProjectBookmark(userId, projectId)
    }

    @Test
    fun testReadOrgaBookmarks() = runTest {
        val ids = listOf(1, 10, 40)
        val bookmarks = ids.map {
            OrganizationBookmarksEntity(accountId = userId, orgId = it)
        }
        whenever(repository.readOrganizationBookmarks(userId)).thenReturn(bookmarks.asFlow())

        val service = BookmarksApiService(repository)
        val result = service.getOrganizationBookmarks(testToken)

        assertEquals(HttpStatus.OK, result.statusCode)
        assertEquals(ids, result.body?.toList())
    }

    @Test
    fun testReadProjectBookmarks() = runTest {
        val ids = listOf(2, 30, 500)
        val bookmarks = ids.map {
            ProjectBookmarksEntity(accountId = userId, projectId = it)
        }
        whenever(repository.readProjectBookmarks(userId)).thenReturn(bookmarks.asFlow())

        val service = BookmarksApiService(repository)
        val result = service.getProjectBookmarks(testToken)

        assertEquals(HttpStatus.OK, result.statusCode)
        assertEquals(ids, result.body?.toList())
    }

}