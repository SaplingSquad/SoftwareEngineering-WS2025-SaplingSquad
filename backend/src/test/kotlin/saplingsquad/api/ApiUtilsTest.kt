package saplingsquad.api

import org.junit.jupiter.api.assertThrows
import org.springframework.web.server.ResponseStatusException
import saplingsquad.persistence.tables.CoordinatesEmbedded
import java.time.LocalDate
import kotlin.test.Test
import kotlin.test.assertEquals

class ApiUtilsTest {

    @Test
    fun testYearMonthDateParser() {
        val januaryStart = LocalDate.of(2025, 1, 1)
        val januaryEnd = LocalDate.of(2025, 1, 31)

        val februaryEnd = LocalDate.of(2025, 2, 28)
        val februaryLeapEnd = LocalDate.of(2024, 2, 29)

        val novemberStart = LocalDate.of(2025, 11, 1)
        val novemberEnd = LocalDate.of(2025, 11, 30)
        assertFormatAndParseYearMonthDate(januaryStart, "2025-01", DateContext.START_DATE)
        assertFormatAndParseYearMonthDate(januaryEnd, "2025-01", DateContext.END_DATE)

        assertFormatAndParseYearMonthDate(februaryEnd, "2025-02", DateContext.END_DATE)
        assertFormatAndParseYearMonthDate(februaryLeapEnd, "2024-02", DateContext.END_DATE)

        assertFormatAndParseYearMonthDate(novemberStart, "2025-11", DateContext.START_DATE)
        assertFormatAndParseYearMonthDate(novemberEnd, "2025-11", DateContext.END_DATE)

        assertThrows<ResponseStatusException> { monthAndYearToDate("202-11", DateContext.START_DATE) }
        assertThrows<ResponseStatusException> { monthAndYearToDate("2025-13", DateContext.START_DATE) }
        assertThrows<ResponseStatusException> { monthAndYearToDate("2025-11-11", DateContext.START_DATE) }
    }

    private fun assertFormatAndParseYearMonthDate(date: LocalDate, asString: String, context: DateContext) {
        assertEquals(date, monthAndYearToDate(asString, context))
        assertEquals(asString, dateToMonthAndYear(date))
    }

    @Test
    fun testCoordinatesToList() {
        val longitude = 100.5
        val latitude = -20.0
        val coordinates = CoordinatesEmbedded(coordinatesLon = longitude, coordinatesLat = latitude)
        val list = coordinates.toLonLatList()
        assertEquals(longitude, list[0].toDouble())
        assertEquals(latitude, list[1].toDouble())
    }

    @Test
    fun testListToCoordinates() {
        val longitude = 100.5.toBigDecimal()
        val latitude = (-20.0).toBigDecimal()
        val list = listOf(longitude, latitude)
        val coordinates = listToCoordinates(list)
        assertEquals(longitude, coordinates.coordinatesLon.toBigDecimal())
        assertEquals(latitude, coordinates.coordinatesLat.toBigDecimal())

        assertThrows<ResponseStatusException> {
            listToCoordinates(listOf(200.toBigDecimal(), 10.toBigDecimal()))
        }
        assertThrows<ResponseStatusException> {
            listToCoordinates(listOf(100.toBigDecimal(), (-100).toBigDecimal()))
        }
        assertThrows<ResponseStatusException> {
            listToCoordinates(listOf(20.toBigDecimal(), 20.toBigDecimal(), 20.toBigDecimal()))
        }
    }
}