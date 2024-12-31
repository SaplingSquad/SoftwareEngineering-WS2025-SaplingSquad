package api.service

import kotlinx.coroutines.flow.flowOf
import kotlinx.coroutines.test.runTest
import org.junit.jupiter.api.assertThrows
import reactor.core.publisher.Mono
import saplingsquad.utils.atMostOne
import saplingsquad.utils.booleanAnd
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertNull
import kotlin.test.fail

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

    @Test
    fun testMonoBooleanAnd() {
        val TRUE = Mono.just(true)
        val FALSE = Mono.just(false)
        assertEquals(true, TRUE.booleanAnd(TRUE).block())
        assertEquals(false, TRUE.booleanAnd(FALSE).block())
        assertEquals(false, FALSE.booleanAnd(TRUE).block())
        assertEquals(false, FALSE.booleanAnd(FALSE).block())
        //short-circuiting
        FALSE.booleanAnd(Mono.defer { fail("should not be called") }).block()
    }
}