package saplingsquad.komapper_ext.annotations

import kotlin.reflect.KClass

/**
 * This annotation **must be combined with** [KomapperUnionTableName]
 *
 * This annotation allows to generate a new `data class` which contains all attributes from all data classes in the
 * [classes] parameter. It also copies the annotations of the attributes in the constructor.
 *
 * At the moment, an overlap in the attributes of all [classes] is **not** supported
 *
 * The annotated class itself is does not have any impact on the generated code (except if it is explicitly included in
 * the [classes] parameter)
 * @param resultName The name of the generated data class
 * @param classes All the data classes which should be concatenated to a single class
 */
@Target(AnnotationTarget.CLASS)
@Retention(AnnotationRetention.SOURCE)
annotation class KomapperUnionEntity(val resultName: String, val classes: Array<KClass<*>>)

/**
 * This annotation must be combined with [KomapperUnionEntity] and will annotate the generated class with
 * `@org.komapper.annotation.KomapperEntity` and `@org.komapper.annotation.KomapperTable` and passes the [tableName] to
 * `@KomapperTable`
 */
@Target(AnnotationTarget.CLASS)
@Retention(AnnotationRetention.SOURCE)
annotation class KomapperUnionTableName(val tableName: String)
