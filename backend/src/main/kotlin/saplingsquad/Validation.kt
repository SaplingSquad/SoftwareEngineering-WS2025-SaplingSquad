package saplingsquad

import com.atlassian.oai.validator.OpenApiInteractionValidator
import com.atlassian.oai.validator.OpenApiInteractionValidator.SpecSource
import com.atlassian.oai.validator.interaction.ApiOperationResolver
import com.atlassian.oai.validator.model.Request.Method
import com.atlassian.oai.validator.model.SimpleRequest
import com.atlassian.oai.validator.model.SimpleResponse
import com.atlassian.oai.validator.util.OpenApiLoader
import io.ktor.http.*
import io.ktor.http.content.*
import io.ktor.server.application.*
import io.ktor.server.plugins.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.util.*
import io.ktor.util.pipeline.*
import io.ktor.utils.io.*
import io.swagger.v3.parser.core.models.ParseOptions


class OpenApiValidatePlugin(specSource: SpecSource) :
    BaseApplicationPlugin<ApplicationCallPipeline, OpenApiValidatePlugin.Configuration, OpenApiValidatePlugin> {

    data class Configuration(
        var specSource: SpecSource
    )

    private val configuration: Configuration = Configuration(specSource)

    override val key: AttributeKey<OpenApiValidatePlugin>
        get() = AttributeKey<OpenApiValidatePlugin>("OpenApiValidatePlugin")

    companion object {
        val ValidationPhase = PipelinePhase("Validation")
        fun specUrl(url: String): OpenApiValidatePlugin {
            return OpenApiValidatePlugin(SpecSource.specUrl(url))
        }

        fun inlineSpec(spec: String): OpenApiValidatePlugin {
            return OpenApiValidatePlugin(SpecSource.inline(spec))
        }
    }

    private suspend fun onReceive(
        call: PipelineCall,
        validator: OpenApiInteractionValidator,
        matcher: ApiOperationResolver
    ) {
        val request = call.request
        val resolvedOperation =
            matcher.findApiOperation(request.path(), ktorMethodToValidatorMethod(request.httpMethod))
        if (!resolvedOperation.isPathFound || !resolvedOperation.isOperationAllowed) {
            // Operation is not specified in OpenAPI spec => Skip validation
            call.application.log.debug("Skipping validation of request which is not defined in OpenAPI spec")
            throw NotFoundException()
        }
        if (!request.hasBody()) {
            // No request body => Skip validation
            return
        }
        val allowedContentTypes = resolvedOperation.apiOperation.operation.requestBody.content.keys
        request.rejectBodyIfNecessary(allowedContentTypes = allowedContentTypes)

        val body = call.receiveChannel()
        val report = validator.validateRequest(ktorRequestToValidatorRequest(call, body))
        if (report.hasErrors()) {
            throw BadRequestException(report.messages.joinToString("\n\n"))
        }
    }

    private suspend fun onSend(
        call: PipelineCall,
        body: Any,
        validator: OpenApiInteractionValidator,
        matcher: ApiOperationResolver
    ): Any {
        val request = call.request
        val resolvedOperation =
            matcher.findApiOperation(request.path(), ktorMethodToValidatorMethod(request.httpMethod))
        if (!resolvedOperation.isPathFound || !resolvedOperation.isOperationAllowed) {
            // Operation is not specified in OpenAPI spec => Skip validation
            call.application.log.debug("Skipping validation of response which is not defined in OpenAPI spec")
            return body
        }
        val status = call.response.status()?.value ?: 200
        if (!resolvedOperation.apiOperation.operation.responses.contains(status.toString())) {
            // Only validate the responses which have corresponding status codes in the Spec
            call.application.log.debug(
                "Skipping validation of status code which is not defined in OpenAPI spec: {}",
                call.response.status()
            )
            return body
        }
        call.application.log.debug("Validating...")
        val report = validator.validate(
            ktorRequestToValidatorRequest(call, null),
            ktorResponseToValidatorResponse(call, status, body)?.also {
                call.application.log.debug(
                    it.responseBody.get().toString(Charsets.UTF_8)
                )
            } ?: return body// Non-String response => Skip validation
        )
        if (report.hasErrors()) {
            call.application.log.error(report.messages.joinToString("\n\n"))
            return call.respond(HttpStatusCode.InternalServerError, "Internal Server Error")
        }
        return body
    }

    override fun install(
        pipeline: ApplicationCallPipeline,
        configure: Configuration.() -> Unit
    ): OpenApiValidatePlugin {
        configuration.apply(configure)
        val openapi = OpenApiLoader().loadApi(configuration.specSource, emptyList(), ParseOptions())
        val validator = OpenApiInteractionValidator.createFor(openapi).build()
        val matcher = ApiOperationResolver(openapi, null, false)
        pipeline.receivePipeline.insertPhaseAfter(ApplicationReceivePipeline.Before, ValidationPhase)
        pipeline.receivePipeline.intercept(ValidationPhase) {
            onReceive(call, validator, matcher)
            proceed()
        }
        pipeline.sendPipeline.insertPhaseBefore(ApplicationSendPipeline.After, ValidationPhase)
        pipeline.sendPipeline.intercept(ValidationPhase) { body ->
            val newBody = onSend(call, body, validator, matcher)
            proceedWith(newBody)
        }
        return this
    }
}

const val MAX_PAYLOAD_SIZE: Long = 512 * 1024

private fun PipelineRequest.rejectBodyIfNecessary(
    maxPayloadSize: Long = MAX_PAYLOAD_SIZE,
    allowedContentTypes: Collection<String>
) {
    // Content length too large
    val contentLength = contentLength() ?: throw BadRequestException("Missing content length")
    if (contentLength > maxPayloadSize) {
        throw PayloadTooLargeException(maxPayloadSize)
    }
    // Unsupported content type
    val contentType = contentType()
    if (allowedContentTypes.none(contentType::match)) {
        val first = allowedContentTypes.firstOrNull()
        val firstContentType = first?.let { parseContentTypeOrNull(it) }
        if (firstContentType != null) {
            throw UnsupportedMediaTypeException(firstContentType)
        } else {
            throw BadRequestException("No body expected")
        }
    }
}

private fun parseContentTypeOrNull(contentType: String): ContentType? {
    return try {
        ContentType.parse(contentType)
    } catch (e: BadContentTypeFormatException) {
        null
    }
}

private suspend fun ktorRequestToValidatorRequest(call: PipelineCall, bodyChannel: ByteReadChannel?): SimpleRequest {
    val request = call.request
    var builder = SimpleRequest.Builder(request.httpMethod.value, request.path())
    for (header in request.headers.entries()) {
        builder = builder.withHeader(header.key, header.value)
    }
    for (query in request.queryParameters.entries()) {
        builder = builder.withQueryParam(query.key, query.value)
    }
    if (bodyChannel != null) {
        val body = bodyChannel.readRemaining().readText()
        builder = builder.withBody(body)
    }
    return builder.build()
}

private fun ktorResponseToValidatorResponse(call: PipelineCall, status: Int, body: Any): SimpleResponse? {
    if (body !is OutgoingContent) {
        call.application.log.warn("Responding with unknown type: ${body.javaClass} $body")
        return null
    }
    val response = call.response
    var builder = SimpleResponse.Builder(status)
    for (header in response.headers.allValues().entries()) {
        builder = builder.withHeader(header.key, header.value)
    }
    val outgoingAsString = outgoingContentToString(body)
    builder = builder.withBody(outgoingAsString!!.first)
    builder = builder.withHeader("Content-Type", outgoingAsString.second!!.toString())
    return builder.build()
}

private fun outgoingContentToString(content: OutgoingContent): Pair<String, ContentType?>? {
    return when (content) {
        is OutgoingContent.ByteArrayContent -> {
            if (content is TextContent) {
                Pair(content.text, content.contentType)
            } else {
                Pair(content.bytes().toString(content.contentType?.charset() ?: Charsets.UTF_8), content.contentType)
            }
        }

        is OutgoingContent.ContentWrapper -> outgoingContentToString(content.delegate())
        is OutgoingContent.ReadChannelContent -> null
        is OutgoingContent.WriteChannelContent -> null
        is OutgoingContent.NoContent -> null
        is OutgoingContent.ProtocolUpgrade -> null
    }
}

private fun PipelineRequest.hasBody(): Boolean {
    if (contentLength() != null) return true
    if (header(HttpHeaders.TransferEncoding) != null) return true
    return false
}


private fun ktorMethodToValidatorMethod(method: HttpMethod): Method {
    return when (method) {
        HttpMethod.Get -> Method.GET
        HttpMethod.Post -> Method.POST
        HttpMethod.Put -> Method.PUT
        HttpMethod.Patch -> Method.PATCH
        HttpMethod.Delete -> Method.DELETE
        HttpMethod.Head -> Method.HEAD
        HttpMethod.Options -> Method.OPTIONS
        else -> Method.valueOf(method.value)
    }
}