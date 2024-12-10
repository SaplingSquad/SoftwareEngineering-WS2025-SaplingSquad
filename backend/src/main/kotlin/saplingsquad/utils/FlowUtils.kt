package saplingsquad.utils

import kotlinx.coroutines.flow.*
import org.springframework.http.ResponseEntity

/**
 * Utility method to convert a list which is **produced in a coroutine** to a Flow of its elements.
 * Helpful if one Layer returns a complete (asynchronously computed) list instead of a Flow,
 * but the next layer wants to work with flows
 */
fun <T> flowOfList(block: suspend () -> List<T>): Flow<T> {
    return flow {
        emitAll(block().asFlow())
    }
}

/**
 * @see flowOfList
 */
@JvmName("flowOfListExt") //Same JVM signature otherwise
fun <T> (suspend () -> List<T>).flowOfList(): Flow<T> {
    return flowOfList(this)
}

/**
 * Converts an object to a Status Code 200 Response Entity with the object as its body.
 */
fun <T> T.asHttpOkResponse(): ResponseEntity<T> {
    return ResponseEntity.ok().body(this)
}

/**
 * [Flow.singleOrNull] returns null if 0 or >1 elements.
 * This only returns null if 0 elements, throws [IllegalStateException] if >1 elements.
 *
 * Working on flows avoids accidentally loading large datasets into memory when only one element is expected
 */
suspend fun <T> Flow<T>.atMostOne(): T? {
    return this
        .take(2)
        .fold<T, T?>(null) { prev, v ->
            if (prev != null) {
                throw IllegalStateException("Expected at most one element")
            } else {
                v
            }
        }
}
