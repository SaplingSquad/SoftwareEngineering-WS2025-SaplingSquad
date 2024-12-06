package saplingsquad.api.service

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import saplingsquad.api.models.Frage
import saplingsquad.persistence.FragenkatalogRepository

class FragenkatalogServiceImpl(private val repository: FragenkatalogRepository) : FragenkatalogService {

    override suspend fun readAll(): List<Frage> = withContext(Dispatchers.IO) {
        return@withContext repository.readAll()
            .map {
                Frage(
                    id = it.id,
                    frage = it.frage,
                    tagId = it.tag
                )
            }
    }
}