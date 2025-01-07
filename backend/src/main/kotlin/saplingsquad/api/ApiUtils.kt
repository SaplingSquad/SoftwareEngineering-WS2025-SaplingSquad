package saplingsquad.api

import org.springframework.http.HttpStatus
import org.springframework.web.server.ResponseStatusException
import saplingsquad.persistence.tables.CoordinatesEmbedded
import java.math.BigDecimal
import java.math.RoundingMode
import java.time.LocalDate
import java.time.YearMonth

fun CoordinatesEmbedded.toLonLatList(precision: Int? = 6): List<BigDecimal> {
    return listOf(
        coordinatesLon.toBigDecimal().withPrecision(precision),
        coordinatesLat.toBigDecimal().withPrecision(precision)
    )
}

fun listToCoordinates(
    list: List<BigDecimal>,
    throwOnError: (size: Int) -> Throwable = { size ->
        ResponseStatusException(HttpStatus.BAD_REQUEST, "Coordinates array has wrong size (${size})")
    }
): CoordinatesEmbedded {
    if (list.size != 2) throw throwOnError(list.size)
    return CoordinatesEmbedded(list[0].toDouble(), list[1].toDouble())
}

private fun BigDecimal.withPrecision(precision: Int?): BigDecimal {
    if (precision == null) {
        return this
    }
    return this.setScale(precision, RoundingMode.HALF_UP)
}


/**
 * Options for [monthAndYearToDate]
 */
enum class DateContext {
    START_DATE,
    END_DATE
}

/**
 * Converts a `yyyy-mm` string to a local date, depending on the date context.
 * If it is supposed to be a start date, use the first day of the month
 * If it is supposed to be an end date, use the last day of the month
 */
fun monthAndYearToDate(isoYearAndMonth: String, dateContext: DateContext): LocalDate {
    val yearMonth = YearMonth.parse(isoYearAndMonth)
    return when (dateContext) {
        DateContext.START_DATE -> yearMonth.atDay(1)
        DateContext.END_DATE -> yearMonth.atEndOfMonth()
    }
}

/**
 * Keeps only year and month from a date and returns it in `yyyy-mm` format
 */
fun dateToMonthAndYear(date: LocalDate): String {
    return YearMonth.from(date).toString()
}