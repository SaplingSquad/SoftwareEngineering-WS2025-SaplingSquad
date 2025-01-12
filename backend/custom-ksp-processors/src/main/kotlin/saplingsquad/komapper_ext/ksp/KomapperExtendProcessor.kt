package saplingsquad.komapper_ext.ksp

import com.google.devtools.ksp.KspExperimental
import com.google.devtools.ksp.getAnnotationsByType
import com.google.devtools.ksp.processing.CodeGenerator
import com.google.devtools.ksp.processing.Dependencies
import com.google.devtools.ksp.processing.Resolver
import com.google.devtools.ksp.processing.SymbolProcessor
import com.google.devtools.ksp.symbol.*
import com.google.devtools.ksp.visitor.KSEmptyVisitor
import saplingsquad.komapper_ext.annotations.KomapperUnionEntity
import saplingsquad.komapper_ext.annotations.KomapperUnionTableName
import java.io.PrintStream

private val ANNOTATION_CLASS = KomapperUnionEntity::class

/**
 * Merges two data classes into one
 * ```kotlin
 * data class A(
 *     @KomapperId
 *     val id: Int,
 *     val a: String
 * )
 *
 * data class B(
 *     val b: Double
 * )
 *
 * @KomapperUnionTableName("my_sql_table")
 * @KomapperUnionEntity("MergedClass", [A::class, B::class])
 * private class Merge {}
 * ```
 * generates
 *
 * ```kotlin
 * @KomapperEntity
 * @KomapperTableName("my_sql_table")
 * data class MergedClass(
 *     @KomapperId
 *     val id: Int,
 *     val a: String,
 *     val b: Double
 * ) {
 *     fun toA() = A(id = this.id,
 *                   a = this.a)
 *
 *     fun toB() = B(b = this.b)
 * }
 * ```
 */
class KomapperExtendProcessor(private val codeGenerator: CodeGenerator) : SymbolProcessor {
    override fun process(resolver: Resolver): List<KSAnnotated> {
        // Find all classes which are annotated with KomapperUnionEntity
        val annotated = resolver.getSymbolsWithAnnotation(ANNOTATION_CLASS.qualifiedName!!)
            .filterIsInstance<KSClassDeclaration>()
            .toList()

        val visitor = Visitor()

        // If multiple annotated classes are in a single file, group them together and only produce one output file per
        // input file, but possibly containing multiple generated classes
        val groupedByFile = annotated.groupBy { it.containingFile!! }


        for ((inputFile, classes) in groupedByFile) {
            PrintStream(
                codeGenerator.createNewFile(
                    dependencies = Dependencies(true, inputFile),
                    packageName = inputFile.packageName.asString(),
                    fileName = inputFile.fileName.removeSuffix(".kt")
                )
            ).use { fileStream ->
                fileStream.println("package ${inputFile.packageName.asString()}\n")

                // For each class in the input file, generate the code
                for (cl in classes) {
                    cl.accept(visitor, fileStream)
                }
            }
        }

        return emptyList()
    }

    inner class Visitor : KSEmptyVisitor<PrintStream, Unit>() {

        @OptIn(KspExperimental::class)
        override fun visitClassDeclaration(classDeclaration: KSClassDeclaration, data: PrintStream) {
            // Find the KomapperUnionEntity annotation object, we want this as a KSP KSAnnotation object instead of a
            // fully instantiated KomapperUnionEntity, because we want the classes as a list of KSP KSClassDeclaration
            // instead of KClass<*>, as the latter only partially exist at compile time (only some features, like the
            // classname are available, however the attributes are not).
            // KSClassDeclarations however DO provide the list of class attributes

            val annotation = classDeclaration.annotations.singleOrNull {
                it.annotationType.resolve().declaration.qualifiedName?.asString() == ANNOTATION_CLASS.qualifiedName!!
            }
                ?: throw IllegalArgumentException("${classDeclaration.simpleName} annotated with ${ANNOTATION_CLASS.simpleName} multiple times")


            // Find the KomapperUnionTableName annotation on this class, here we use a fully instantiated
            // KomapperUnionTableName object, makes reading the string parameter easier
            val tableNameAnnotations =
                classDeclaration.getAnnotationsByType(KomapperUnionTableName::class).toList()
            if (tableNameAnnotations.size > 1) {
                throw IllegalArgumentException("${classDeclaration.simpleName} annotated with ${KomapperUnionTableName::class.simpleName} multiple times")
            } else if (tableNameAnnotations.isEmpty()) {
                throw IllegalArgumentException("${classDeclaration.simpleName} is not annotated with ${KomapperUnionTableName::class.simpleName}")
            }
            val tableNameAnnotation = tableNameAnnotations.single()

            // read the arguments of the KomapperUnionEntity annotation
            val outputClassName = findStringValue(annotation, "resultName")
            val classesToMerge = findClassesValue(annotation, "classes")

            // check that all classes are data classes
            classesToMerge.forEach {
                if (Modifier.DATA !in it.modifiers)
                    throw IllegalArgumentException("${it.simpleName.asString()} is not a data class")
            }

            val properties = classesToMerge.map { it to it.primaryConstructor!!.parameters }
            val generator = ClassGenerator(data, outputClassName, tableNameAnnotation.tableName, properties)
            generator.generate()
        }

        override fun defaultHandler(node: KSNode, data: PrintStream) {
            return
        }
    }

    class ClassGenerator(
        /** the output file stream */
        private val file: PrintStream,
        /** the name to use for the generated class */
        private val className: String,
        /** the table name for the @KomapperTable annotation */
        private val tableName: String,
        /** List of classes and their primary constructor parameters. These will be merged */
        private val properties: List<Pair<KSClassDeclaration, List<KSValueParameter>>>,
    ) {
        /**
         * Generate the merged class
         */
        fun generate() {
            annotations()
            classDef()
            file.println("(")
            properties()
            file.println(") {")
            converters()
            file.println("}")
        }


        /**
         * Generate the Komapper annotations
         */
        private fun annotations() {
            file.println("@org.komapper.annotation.KomapperTable(\"${tableName}\")")
            file.println("@org.komapper.annotation.KomapperEntity")
        }

        /**
         * Generate the start of the class definition
         */
        private fun classDef() {
            file.println("data class $className")
        }

        /**
         * Generate all the constructor properties and their annotations
         */
        private fun properties() {
            val allProperties = properties.flatMap { it.second }
            for (prop in allProperties) {
                for (annotation in prop.annotations) {
                    file.print("    @${annotation.annotationType.resolve().declaration.qualifiedName!!.asString()}(")
                    annotationArguments(annotation.arguments)
                    file.println(")")
                }
                property(prop)
            }
        }

        /**
         * For each of the non-private input classes, generate a function to extract only that class
         */
        private fun converters() {
            for ((cl, props) in properties) {
                val privateModifiers = listOf(Modifier.PRIVATE, Modifier.PROTECTED)
                if (cl.modifiers.none(privateModifiers::contains)) {
                    if (Modifier.INTERNAL in cl.modifiers) {
                        file.print("    internal ")
                    }
                    // Method signature
                    file.println("    fun to${cl.simpleName.asString()}(): ${cl.qualifiedName!!.asString()} =")
                    // construct object
                    file.println("        ${cl.qualifiedName!!.asString()}(")
                    for (prop in props) {
                        val propName = prop.name!!.asString()
                        file.println("            $propName = this.$propName,")
                    }
                    file.println("        )")
                }
            }
        }

        /**
         * Writes a single val property
         */
        private fun property(prop: KSValueParameter) {
            file.print("    val ${prop.name!!.asString()}:")
            type(prop.type)
            file.println(",")
        }

        /**
         * Writes a type, handles nullability
         */
        private fun type(t: KSTypeReference) {
            val type = t.resolve()
            val propName = type.declaration.qualifiedName!!.asString()
            val nullable = if (type.isMarkedNullable) "?" else ""
            file.print("${propName}${nullable}")
        }

        /**
         * reconstructs all arguments of an annotation
         */
        private fun annotationArguments(arguments: List<KSValueArgument>) {
            for (argument in arguments) {
                val argName = argument.name
                if (argName != null) {
                    file.print(argName.asString() + " = " + argument.value)
                } else {
                    file.print(argument.value)
                }
                file.print(", ")
            }
        }
    }

    /**
     * Read an argument value from a KSAnnotation
     */
    private fun findValue(annotation: KSAnnotation, name: String): Any? {
        return annotation.arguments.single { it.name?.getShortName() == name }.value
    }

    /**
     * Read a string argument value from a KSAnnotation
     */
    fun findStringValue(annotation: KSAnnotation, name: String): String {
        val value = findValue(annotation, name)
        if (value !is String) {
            throw IllegalArgumentException()
        }
        return value
    }

    /**
     * Read the value of an argument of original type `Array<KClass<*>>` from a [KSAnnotation].
     *
     * The return value however is [List&lt;KSClassDeclaration&gt;][KSClassDeclaration] instead of
     * [Array&lt;KClass&gt;][kotlin.reflect.KClass], as KSP processes annotations that way (and doesn't require a
     * `java.lang.ClassLoader` which isn't available at compile time)
     */
    fun findClassesValue(annotation: KSAnnotation, name: String): List<KSClassDeclaration> {
        val value = findValue(annotation, name)
        if (value !is List<*>) {
            throw IllegalArgumentException()
        }
        return value
            .map { it as? KSType }
            .map { it?.declaration as? KSClassDeclaration }
            .map { it ?: throw IllegalArgumentException() }
    }
}
