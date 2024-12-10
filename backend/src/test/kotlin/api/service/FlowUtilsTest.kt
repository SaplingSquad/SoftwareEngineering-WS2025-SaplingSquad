package api.service

import kotlinx.coroutines.flow.flowOf
import kotlinx.coroutines.test.runTest
import org.junit.jupiter.api.assertThrows
import saplingsquad.utils.atMostOne
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertNull

class FlowUtilsTest {

    @Test
    fun testAtMostOne() = runTest {
        val flowEmpty = flowOf<Int>()
        assertNull(flowEmpty.atMostOne())

        val flowSingle = flowOf(5)
        assertEquals(5, flowSingle.atMostOne())

        val flowMultiple = flowOf(5, 6)
        assertThrows<IllegalStateException> { flowMultiple.atMostOne() }
    }
}