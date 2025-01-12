package saplingsquad.komapper_ext.ksp

import com.google.devtools.ksp.KspExperimental
import com.google.devtools.ksp.getAnnotationsByType
import com.google.devtools.ksp.processing.*
import com.google.devtools.ksp.symbol.*
import com.google.devtools.ksp.visitor.KSEmptyVisitor
import saplingsquad.komapper_ext.annotations.KomapperUnionEntity
import saplingsquad.komapper_ext.annotations.KomapperUnionTableName
import java.io.PrintStream

private val ANNOTATION_CLASS = KomapperUnionEntity::class

class KomapperExtendProcessor(private val codeGenerator: CodeGenerator, private val logger: KSPLogger) :
    SymbolProcessor {
    override fun process(resolver: Resolver): List<KSAnnotated> {
        val annotated = resolver.getSymbolsWithAnnotation(ANNOTATION_CLASS.qualifiedName!!)
            .filterIsInstance<KSClassDeclaration>()
            .toList()

        val visitor = Visitor()
        val groupedByFile = annotated.groupBy { it.containingFile!! }


        groupedByFile.forEach {
            PrintStream(
                codeGenerator.createNewFile(
                    dependencies = Dependencies(true, it.key),
                    packageName = it.key.packageName.asString(),
                    fileName = it.key.fileName.removeSuffix(".kt")
                )
            ).use { file ->
                file.println("package ${it.key.packageName.asString()}\n")

                it.value.forEach { cl ->
                    cl.accept(visitor, file)
                }
            }

        }

        return emptyList()
    }

    inner class Visitor : KSEmptyVisitor<PrintStream, Unit>() {

        @OptIn(KspExperimental::class)
        override fun visitClassDeclaration(classDeclaration: KSClassDeclaration, data: PrintStream) {
            val annotation = classDeclaration.annotations.singleOrNull {
                it.annotationType.resolve().declaration.qualifiedName?.asString() == ANNOTATION_CLASS.qualifiedName!!
            }
                ?: throw IllegalArgumentException("${classDeclaration.simpleName} annotated with ${ANNOTATION_CLASS.simpleName} multiple times")
            val tableNameAnnotations =
                classDeclaration.getAnnotationsByType(KomapperUnionTableName::class).toList()
            if (tableNameAnnotations.size > 1) {
                throw IllegalArgumentException("${classDeclaration.simpleName} annotated with ${KomapperUnionTableName::class.simpleName} multiple times")
            } else if (tableNameAnnotations.isEmpty()) {
                throw IllegalArgumentException("${classDeclaration.simpleName} is not annotated with ${KomapperUnionTableName::class.simpleName}")
            }
            val tableNameAnnotation = tableNameAnnotations.single()

            val outputClassName = findStringValue(annotation, "resultName")

            val classesToMerge = findClassesValue(annotation, "classes")

            // check that all are data class
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
        private val file: PrintStream,
        private val className: String,
        private val tableName: String,
        private val properties: List<Pair<KSClassDeclaration, List<KSValueParameter>>>,
    ) {
        fun generate() {
            annotations()
            classDef()

            properties()
        }


        private fun annotations() {
            file.println("@org.komapper.annotation.KomapperTable(\"${tableName}\")")
            file.println("@org.komapper.annotation.KomapperEntity")
        }

        private fun classDef() {
            file.println("data class $className")
        }

        private fun properties() {
            file.println("(")
            for (prop in properties.flatMap { it.second }) {
                for (annotation in prop.annotations) {
                    file.print("    @${annotation.annotationType.resolve().declaration.qualifiedName!!.asString()}(")
                    annotationArguments(annotation.arguments)
                    file.println(")")
                }
                property(prop)
            }
            file.println(") {")
            for ((cl, props) in properties) {
                val privateModifiers = listOf(Modifier.PRIVATE, Modifier.PROTECTED)
                if (cl.modifiers.none { it in privateModifiers }) {
                    if (Modifier.INTERNAL in cl.modifiers) {
                        file.print("    internal ")
                    }
                    file.println("    fun to${cl.simpleName.asString()}(): ${cl.qualifiedName!!.asString()} =")
                    file.println("        ${cl.qualifiedName!!.asString()}(")
                    for (prop in props) {
                        val propName = prop.name!!.asString()
                        file.println("            $propName = this.$propName,")
                    }
                    file.println("        )")
                }
            }
            file.println("}")
        }

        private fun property(prop: KSValueParameter) {
            file.print("    val ${prop.name!!.asString()}:")
            type(prop.type)
            file.println(",")
        }

        private fun type(t: KSTypeReference) {
            val type = t.resolve()
            val propName = type.declaration.qualifiedName!!.asString()
            val nullable = if (type.isMarkedNullable) "?" else ""
            file.print("${propName}${nullable}")
        }

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

    private fun findValue(annotation: KSAnnotation, name: String): Any? {
        return annotation.arguments.single { it.name?.getShortName() == name }.value
    }

    fun findStringValue(annotation: KSAnnotation, name: String): String {
        val value = findValue(annotation, name)
        if (value !is String) {
            throw IllegalArgumentException()
        }
        return value
    }

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
