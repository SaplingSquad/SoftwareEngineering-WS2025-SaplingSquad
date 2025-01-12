package saplingsquad.persistence

import org.komapper.core.dsl.QueryDsl
import org.komapper.r2dbc.R2dbcDatabase
import org.springframework.stereotype.Repository
import saplingsquad.persistence.commands.*

@Repository
class SearchRepository(private val db: R2dbcDatabase) {
    suspend fun search(
        answers: List<Int>,
        maxMembers: Int?,
        searchText: String?,
        continentId: String?,
        regionId: String?,
        type: SearchTypeFilter
    ): List<SearchResultEntity> {
        val maxMembersFilter = maxMembers?.let { SearchFilterMaxMembers(it) }
        val searchTextFilter = searchText?.let { SearchTextFilter(it) }
        val continentFilter = continentId?.let { SearchFilterContinent(it) }
        val regionFilter = regionId?.let { SearchFilterRegion(it) }
        return db.runQuery {
            QueryDsl.execute(
                SearchCommand(
                    answers,
                    regionFilter,
                    continentFilter,
                    maxMembersFilter,
                    searchTextFilter,
                    type
                )
            )
        }
    }
}