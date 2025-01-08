package saplingsquad.persistence

import kotlinx.coroutines.flow.toList
import kotlinx.coroutines.test.runTest
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.test.context.junit.jupiter.SpringExtension
import saplingsquad.persistence.testconfig.ExampleOrgas
import saplingsquad.persistence.testconfig.ExampleProjects
import saplingsquad.persistence.testconfig.PersistenceTestConfiguration
import kotlin.test.Test
import kotlin.test.assertEquals

/**
 * Test correct behavior of [BookmarksRepository]
 */
@ExtendWith(SpringExtension::class)
@PersistenceTestConfiguration
class BookmarksRepositoryTest {

    /** SUT */
    @Autowired
    lateinit var repository: BookmarksRepository

    /**
     * Ensure that the correct test data is returned
     */
    @Test
    fun testReadAll() = runTest {
        val projectResults = repository.readProjectBookmarks("UserId 1").toList()
        assertEquals(4, projectResults.size)
        assert(projectResults.containsAll(ExampleProjects.projectBookmarks.subList(0, 3)))

        val orgResults = repository.readOrganizationBookmarks("UserId 6").toList()
        assertEquals(ExampleOrgas.organizationBookmarks[4], orgResults.first())

        val empty = repository.readOrganizationBookmarks("UserId 4").toList()
        assert(empty.isEmpty())
    }

    /**
     * Ensure that the correct project entry is deleted and inserted
     */
    @Test
    fun testDeleteAndInsertProjectBookmark() = runTest {
        repository.deleteProjectBookmark("UserId 1", 10)
        val deleteResults = repository.readProjectBookmarks("UserId 1").toList()
        assertEquals(3, deleteResults.size)
        assert(deleteResults.containsAll(ExampleProjects.projectBookmarks.subList(1, 3)))

        repository.insertProjectBookmark("UserId 1", 10)
        val insertResults = repository.readProjectBookmarks("UserId 1").toList()
        assertEquals(4, insertResults.size)
        assert(insertResults.contains(ExampleProjects.projectBookmarks[0]))
    }

    /**
     * Ensure that the correct organization entry is deleted and inserted
     */
    @Test
    fun testDeleteAndInsertOrganizationBookmark() = runTest {
        repository.deleteOrganizationBookmark("UserId 7", 7)
        val deleteResults = repository.readOrganizationBookmarks("UserId 7").toList()
        assert(deleteResults.isEmpty())

        repository.insertOrganizationBookmark("UserId 7", 7)
        val insertResults = repository.readOrganizationBookmarks("UserId 7").toList()
        assertEquals(1, insertResults.size)
        assert(insertResults.contains(ExampleOrgas.organizationBookmarks[5]))

        // Test robustness
        repository.deleteOrganizationBookmark("Non Existing Id", 1)
    }
}