package saplingsquad.config

import org.springdoc.core.properties.SwaggerUiConfigProperties
import org.springframework.context.annotation.Configuration
import org.springframework.core.ResolvableType
import org.springframework.core.codec.AbstractSingleValueEncoder
import org.springframework.core.codec.Hints
import org.springframework.core.io.buffer.DataBuffer
import org.springframework.core.io.buffer.DataBufferFactory
import org.springframework.core.log.LogFormatUtils
import org.springframework.http.codec.ServerCodecConfigurer
import org.springframework.util.MimeType
import org.springframework.util.MimeTypeUtils
import org.springframework.web.reactive.config.CorsRegistry
import org.springframework.web.reactive.config.ResourceHandlerRegistry
import org.springframework.web.reactive.config.WebFluxConfigurer
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

/**
 * Spring configuration for various settings of Spring webflux
 */
@Configuration
class WebFluxConfig(
    /** This Configuration depends on some custom configuration properties*/
    val config: AppConfig,
    val swaggerUiConfig: SwaggerUiConfigProperties
) : WebFluxConfigurer {
    override fun addResourceHandlers(registry: ResourceHandlerRegistry) {
        super.addResourceHandlers(registry)
        val trimmedResources = config.resourcesUrlPath.trim('/')
        val trimmedSwaggerConfig = swaggerUiConfig.url.trim('/')
        registry
            .addResourceHandler(
                "/${trimmedResources}/**", // /api/rsc/example/file.txt -> /static/example/file.txt
                "/${trimmedSwaggerConfig}"
            ) // /api/spec.yaml -> /static/api/spec.yaml
            .addResourceLocations("classpath:/static/")
    }

    override fun addCorsMappings(registry: CorsRegistry) {
        if (config.allowWildcardCors) {
            registry.addMapping("/**")
                .allowedOrigins("*")
                .allowedMethods("*")
                .allowedHeaders("*")
        }
    }

    override fun configureHttpMessageCodecs(configurer: ServerCodecConfigurer) {
        configurer.customCodecs().registerWithDefaultConfig(IntToStringEncoder())
    }
}

class IntToStringEncoder : AbstractSingleValueEncoder<Int>(MimeTypeUtils.TEXT_PLAIN) {

    override fun canEncode(elementType: ResolvableType, mimeType: MimeType?): Boolean {
        if (super.canEncode(elementType, mimeType)) {
            return (elementType.toClass() == Int::class.javaObjectType
                    || elementType.toClass() == Int::class.javaPrimitiveType)
        }
        return false
    }

    override fun encode(
        t: Int,
        dataBufferFactory: DataBufferFactory,
        type: ResolvableType,
        mimeType: MimeType?,
        hints: MutableMap<String, Any>?
    ): Flux<DataBuffer> {
        return Mono.fromCallable { encodeValue(t, dataBufferFactory, type, mimeType, hints) }.flux()
    }

    override fun encodeValue(
        value: Int,
        bufferFactory: DataBufferFactory,
        valueType: ResolvableType,
        mimeType: MimeType?,
        hints: MutableMap<String, Any>?
    ): DataBuffer {
        if (!Hints.isLoggingSuppressed(hints)) {
            LogFormatUtils.traceDebug(logger) { traceOn ->
                val formatted = LogFormatUtils.formatValue(value, !traceOn)
                return@traceDebug Hints.getLogPrefix(hints) + "Encoding [" + formatted + "]"
            }
        }
        val valueAsStringBytes = value.toString().toByteArray(mimeType?.charset ?: Charsets.UTF_8)
        return bufferFactory.wrap(valueAsStringBytes)
    }
}