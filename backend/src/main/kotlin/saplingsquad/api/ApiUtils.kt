package saplingsquad.api

import org.springframework.http.HttpStatus
import org.springframework.web.server.ResponseStatusException
import saplingsquad.persistence.tables.CoordinatesEmbedded
import saplingsquad.persistence.tables.OrganizationId
import java.math.BigDecimal
import java.math.RoundingMode
import java.time.LocalDate
import java.time.YearMonth
import java.time.format.DateTimeParseException
import kotlin.math.absoluteValue
import kotlin.random.Random
import kotlin.random.nextInt

fun CoordinatesEmbedded.toLonLatList(precision: Int? = 6): List<BigDecimal> {
    return listOf(
        coordinatesLon.toBigDecimal().withPrecision(precision),
        coordinatesLat.toBigDecimal().withPrecision(precision)
    )
}


enum class ListToCoordinatesErrorType {
    WRONG_SIZE,
    OUT_OF_RANGE
}

fun listToCoordinates(
    list: List<BigDecimal>,
    throwOnError: (input: List<BigDecimal>, error: ListToCoordinatesErrorType) -> Throwable = { input, error ->
        when (error) {
            ListToCoordinatesErrorType.WRONG_SIZE -> ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Coordinates array has wrong size (${list.size})"
            )

            ListToCoordinatesErrorType.OUT_OF_RANGE -> ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Lon/Lat values are out of range $list"
            )
        }
    }
): CoordinatesEmbedded {
    if (list.size != 2) throw throwOnError(list, ListToCoordinatesErrorType.WRONG_SIZE)
    val coordinates = CoordinatesEmbedded(list[0].toDouble(), list[1].toDouble())
    if (coordinates.coordinatesLon !in -180.0..180.0 || coordinates.coordinatesLat !in -90.0..90.0) {
        throw throwOnError(list, ListToCoordinatesErrorType.OUT_OF_RANGE)
    }
    return coordinates
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
fun monthAndYearToDate(
    isoYearAndMonth: String,
    dateContext: DateContext,
    throwOnError: (input: String, reason: Throwable) -> Throwable = { input, _ ->
        ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid date format: $input")
    }
): LocalDate {
    val yearMonth = try {
        YearMonth.parse(isoYearAndMonth)
    } catch (e: DateTimeParseException) {
        throw throwOnError(isoYearAndMonth, e)
    }
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

/**
 * TODO implement support for icon upload in the future
 */
fun placeholderIconUrl(orgId: OrganizationId): String {
    return "https://picsum.photos/seed/$orgId/200"
}

/**
 * TODO implement support for image upload in the future
 */
fun placeholderImageUrls(projectOrOrgaId: Int): List<String> {
    val random = Random(projectOrOrgaId)
    val numImages = random.nextInt(9..15)
    return (1..numImages)
        .map { "$it$projectOrOrgaId".hashCode().absoluteValue }
        .map {
            // Generate a deterministic pseudorandom width based on the image index and orga/project id
            val w = Random(it).nextInt(512..1536)
            // Random Picsum image based on the image index and orga/project id with random width and height 512px
            "https://picsum.photos/seed/$it/$w/512"
        }.toList()
}
