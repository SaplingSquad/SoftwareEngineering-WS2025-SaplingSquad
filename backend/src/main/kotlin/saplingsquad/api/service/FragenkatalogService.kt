package saplingsquad.api.service

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import saplingsquad.api.models.Frage

interface FragenkatalogService {
    suspend fun readAll(): List<Frage>
}