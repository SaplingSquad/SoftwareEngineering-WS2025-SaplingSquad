package saplingsquad.api.service

import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service
import saplingsquad.api.FragenkatalogApiDelegate
import saplingsquad.api.models.Frage
import saplingsquad.persistence.FragenkatalogRepository

@Service
class FragenkatalogApiService(private val repository: FragenkatalogRepository) : FragenkatalogApiDelegate {

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


