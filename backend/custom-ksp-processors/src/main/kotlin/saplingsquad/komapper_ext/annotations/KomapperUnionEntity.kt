package saplingsquad.komapper_ext.annotations

import kotlin.reflect.KClass

@Target(AnnotationTarget.CLASS)
@Retention(AnnotationRetention.SOURCE)
annotation class KomapperUnionEntity(val resultName: String, val classes: Array<KClass<*>>)

@Target(AnnotationTarget.CLASS)
@Retention(AnnotationRetention.SOURCE)
annotation class KomapperUnionTableName(val tableName: String)
