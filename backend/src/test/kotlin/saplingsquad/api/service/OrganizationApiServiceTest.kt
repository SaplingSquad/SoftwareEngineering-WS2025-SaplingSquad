package saplingsquad.api.service

import kotlinx.coroutines.test.runTest
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mock
import org.mockito.junit.jupiter.MockitoExtension
import org.mockito.kotlin.wheneverBlocking
import org.springframework.http.HttpStatus
import org.springframework.security.oauth2.jwt.Jwt
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken
import saplingsquad.api.models.GetOrganizationSelf200Response
import saplingsquad.api.placeholderImageUrls
import saplingsquad.api.toLonLatList
import saplingsquad.persistence.OrganizationEntityAndTags
import saplingsquad.persistence.OrganizationsRepository
import saplingsquad.persistence.ProjectsRepository
import saplingsquad.persistence.tables.CoordinatesEmbedded
import saplingsquad.persistence.tables.OrganizationWithRegionEntity
import java.time.Instant
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertNotNull

/**
 * Test correct behavior of [OrganizationApiServiceTest]
 */
@ExtendWith(MockitoExtension::class)
class OrganizationApiServiceTest {

    /**
     * Mock the persistence layer
     */
    @Mock
    lateinit var organizationsRepository: OrganizationsRepository

    @Mock
    lateinit var projectsRepository: ProjectsRepository

    private val userId: String = "testaccount-1"
    private val testToken: JwtAuthenticationToken = JwtAuthenticationToken(
        Jwt.withTokenValue("token")
            .issuedAt(Instant.MIN)
            .expiresAt(Instant.MAX)
            .header("test", "header")
            .subject(userId)
            .build()
    )

    /**
     * Test GET /organization
     */
    @Test
    fun testGetOrganizationSelf() = runTest {
        val testTags = setOf(2, 3, 4)
        val testOrga = OrganizationEntityAndTags(
            OrganizationWithRegionEntity(
                orgId = 1,
                name = "org 1",
                description = "description 1",
                foundingYear = 1111,
                memberCount = 11,
                websiteUrl = "url 1",
                donationUrl = "donate 1",
                coordinates = CoordinatesEmbedded(1.0, 1.0),
                regionName = "region 1"
            ),
            testTags
        )

        wheneverBlocking {
            organizationsRepository.readOrganizationAndTagsOfAccount(testToken.token.subject)
        }.thenReturn(testOrga)

        val testImageUrls = placeholderImageUrls(1)
        val expectedBody = GetOrganizationSelf200Response(
            id = 1,
            name = "org 1",
            description = "description 1",
            foundingYear = 1111,
            memberCount = 11,
            webPageUrl = "url 1",
            donatePageUrl = "donate 1",
            regionName = "region 1",
            iconUrl = "https://picsum.photos/seed/1/200",
            imageUrls = testImageUrls,
            coordinates = CoordinatesEmbedded(1.0, 1.0).toLonLatList(),
            tags = testTags.toList()
        )

        val service = OrganizationApiService(organizationsRepository, projectsRepository)
        val response = service.getOrganizationSelf(testToken)

        assertEquals(response.statusCode, HttpStatus.OK)
        assertNotNull(response)
        assertEquals(expectedBody, response.body!!)
    }
}
