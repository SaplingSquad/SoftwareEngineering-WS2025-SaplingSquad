package api

import saplingsquad.api.DateContext
import saplingsquad.api.dateToMonthAndYear
import saplingsquad.api.monthAndYearToDate
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
    }

    private fun assertFormatAndParseYearMonthDate(date: LocalDate, asString: String, context: DateContext) {
        assertEquals(date, monthAndYearToDate(asString, context))
        assertEquals(asString, dateToMonthAndYear(date))
    }
}