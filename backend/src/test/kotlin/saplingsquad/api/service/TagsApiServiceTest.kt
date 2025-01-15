package saplingsquad.api.service

import kotlinx.coroutines.flow.asFlow
import kotlinx.coroutines.flow.toList
import kotlinx.coroutines.test.runTest
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mock
import org.mockito.junit.jupiter.MockitoExtension
import org.mockito.kotlin.wheneverBlocking
import org.springframework.http.HttpStatus
import saplingsquad.api.models.GetTags200ResponseInner
import saplingsquad.persistence.QuestionsRepository
import saplingsquad.persistence.tables.FilterTagEntity
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertNotNull

/**
 * Test correct behavior of [TagsApiServiceTest]
 */
@ExtendWith(MockitoExtension::class)
class TagsApiServiceTest {

    /**
     * Mock the persistence layer
     */
    @Mock
    lateinit var repository: QuestionsRepository

    /**
     * Test GET /tags
     */
    @Test
    fun testGetTags() = runTest {
        val filterTagEntities = listOf(
            FilterTagEntity(tagId = 1, name = "Tag 1"),
            FilterTagEntity(tagId = 2, name = "Tag 2"),
            FilterTagEntity(tagId = 3, name = "Tag 3"),
            FilterTagEntity(tagId = 4, name = "Tag 4")
        )
        wheneverBlocking { repository.readAllTags() }.thenReturn(filterTagEntities.asFlow())

        val expectedBody = listOf(
            GetTags200ResponseInner(id = 1, name = "Tag 1"),
            GetTags200ResponseInner(id = 2, name = "Tag 2"),
            GetTags200ResponseInner(id = 3, name = "Tag 3"),
            GetTags200ResponseInner(id = 4, name = "Tag 4")
        )

        val service = TagsApiService(repository)
        val response = service.getTags()

        assertEquals(response.statusCode, HttpStatus.OK)
        assertNotNull(response)
        assertEquals(expectedBody, response.body!!.toList())
    }
}