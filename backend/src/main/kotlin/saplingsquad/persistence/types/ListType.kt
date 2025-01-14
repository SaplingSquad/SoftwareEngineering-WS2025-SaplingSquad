package saplingsquad.persistence.types

import io.r2dbc.spi.Row
import io.r2dbc.spi.Statement
import org.komapper.r2dbc.spi.R2dbcUserDefinedDataType
import kotlin.reflect.KType
import kotlin.reflect.typeOf

/**
 * Tells komapper how to construct a List<Int> from a database column value.
 * Array columns are usually mapped to java int[] or Integer[].
 * However, arrays and Kotlin data classes don't go well together, so we want to use List<Int> in data classes instead.
 * For this, we need to tell komapper how to interpret a value as List<Int>.
 *
 * This class is registered in META-INF/services/org.komapper.r2dbc.spi.R2dbcUserDefinedDataType
 */
class ListType : R2dbcUserDefinedDataType<List<Int>> {
    override val name: String = "integer array"
    override val r2dbcType: Class<Array<Int>> = Array<Int>::class.java
    override val type: KType = typeOf<List<Int>>()

    override fun getValue(row: Row, index: Int): List<Int>? {
        return castValue(row.get(index))
    }

    private fun castValue(v: Any?): List<Int>? {
        v ?: return null
        val cl = v.javaClass
        if (!cl.isArray) throw IllegalArgumentException("Not an array (${cl}")
        val compType = cl.componentType
        when {
            compType == Int::class.javaPrimitiveType -> {
                return (v as IntArray).toList()
            }

            compType == Int::class.javaObjectType -> {
                @Suppress("UNCHECKED_CAST")
                return (v as Array<Int>).toList()
            }

            compType.isAssignableFrom(Int::class.javaObjectType) -> {
                return (v as Array<*>).asSequence().map { it as Int }.toList()
            }

            else -> {
                throw IllegalArgumentException("Array component type is not int/assignable from Integer: $compType")
            }
        }
    }

    override fun getValue(row: Row, columnLabel: String): List<Int>? {
        return castValue(row.get(columnLabel))
    }

    override fun toString(value: List<Int>): String {
        return value.toString()
    }

    override fun setValue(statement: Statement, name: String, value: List<Int>) {
        statement.bind(name, value.toIntArray())
    }

    override fun setValue(statement: Statement, index: Int, value: List<Int>) {
        statement.bind(index, value.toIntArray())
    }

}