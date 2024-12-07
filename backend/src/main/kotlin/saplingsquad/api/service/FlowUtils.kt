package saplingsquad.api.service

import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.asFlow
import kotlinx.coroutines.flow.emitAll
import kotlinx.coroutines.flow.flow
import org.springframework.http.ResponseEntity

fun <T> flowOfList(block: suspend () -> List<T>): Flow<T> {
    return flow {
        emitAll(block().asFlow())
    }
}

fun <T> Flow<T>.asHttpOkResponse(): ResponseEntity<Flow<T>> {
    return ResponseEntity.ok().body(this)
}
