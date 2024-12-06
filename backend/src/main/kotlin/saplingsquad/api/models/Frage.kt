package saplingsquad.api.models

import kotlinx.serialization.Serializable

@Serializable
data class Frage(val id: Int, val frage: String, val tag: Int)
