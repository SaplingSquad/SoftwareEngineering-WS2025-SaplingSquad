package saplingsquad.persistence.tables

import org.komapper.annotation.KomapperEntity
import org.komapper.annotation.KomapperId
import org.komapper.annotation.KomapperTable

@KomapperEntity
@KomapperTable("frage")
data class FrageEntity(
    @KomapperId
    val id: Int,
    val frage: String,
    val tag: Int
)