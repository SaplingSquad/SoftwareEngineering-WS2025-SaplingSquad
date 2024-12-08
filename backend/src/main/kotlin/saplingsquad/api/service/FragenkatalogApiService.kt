package saplingsquad.api.service

import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service
import saplingsquad.api.FragenkatalogApiDelegate
import saplingsquad.api.models.Frage
import saplingsquad.persistence.FragenkatalogRepository

/**
 * Connection layer between the REST API and the Persistence layer
 * The [FragenkatalogApiDelegate] interface, as well as the REST API controller are generated from the OpenAPI spec.
 * The controller receives the incoming requests and delegates them to this service.
 */
@Service
class FragenkatalogApiService(private val repository: FragenkatalogRepository) : FragenkatalogApiDelegate {

    /**
     * API Endpoint to get a list of all questions.
     */
    override fun fragenkatalogGet(): ResponseEntity<Flow<Frage>> =
        flowOfList {
            repository.readAll()
        }.map {
            Frage(
                id = it.id,
                frage = it.frage,
                tagId = it.tag
            )
        }.asHttpOkResponse()
}


