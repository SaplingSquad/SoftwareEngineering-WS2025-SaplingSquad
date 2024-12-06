package saplingsquad.api.service

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import saplingsquad.api.models.Frage
import saplingsquad.persistence.tables.FragenkatalogRepository

class FragenkatalogService(private val repository: FragenkatalogRepository) {

    suspend fun readAll(): List<Frage> = withContext(Dispatchers.IO) {
        return@withContext repository.readAll()
            .map {
                Frage(
                    id = it.id,
                    frage = it.frage,
                    tag = it.tag
                )
            }
    }
}