package saplingsquad.api

import saplingsquad.persistence.tables.CoordinatesEmbedded
import java.math.BigDecimal
import java.math.RoundingMode

fun CoordinatesEmbedded.toLonLatList(precision: Int? = 6): List<BigDecimal> {
    return listOf(
        coordinatesLon.toBigDecimal().withPrecision(precision),
        coordinatesLat.toBigDecimal().withPrecision(precision)
    )
}

private fun BigDecimal.withPrecision(precision: Int?): BigDecimal {
    if (precision == null) {
        return this
    }
    return this.setScale(precision, RoundingMode.HALF_UP)
}
