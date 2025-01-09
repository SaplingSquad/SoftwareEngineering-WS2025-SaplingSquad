package api.service

import kotlinx.coroutines.flow.flowOf
import kotlinx.coroutines.test.runTest
import org.junit.jupiter.api.assertThrows
import saplingsquad.utils.expectZeroOrOne
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertNull

class FlowUtilsTest {

    @Test
    fun testExpectZeroOrOne() = runTest {
        val flowEmpty = flowOf<Int>()
        assertNull(flowEmpty.expectZeroOrOne())

        val flowSingle = flowOf(5)
        assertEquals(5, flowSingle.expectZeroOrOne())

        val flowMultiple = flowOf(5, 6)
        assertThrows<IllegalStateException> { flowMultiple.expectZeroOrOne() }
    }
}