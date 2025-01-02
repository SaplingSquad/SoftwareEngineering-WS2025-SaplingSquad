package saplingsquad.utils

import org.springframework.security.authorization.AuthorizationDecision
import org.springframework.security.authorization.AuthorizationResult
import org.springframework.security.authorization.ReactiveAuthorizationManager
import org.springframework.security.core.Authentication
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import java.util.*

fun <T> reactiveAuthorizationManagersAllOf(vararg managers: ReactiveAuthorizationManager<T>) =
    reactiveAuthorizationManagersAllOf(AuthorizationDecision(true), *managers)

/**
 * Adapted from Spring [AuthorizationManagers.allOf][org.springframework.security.authorization.AuthorizationManagers.allOf]
 */
fun <T> reactiveAuthorizationManagersAllOf(
    allAbstainDefaultDecision: AuthorizationDecision,
    vararg managers: ReactiveAuthorizationManager<T>
): ReactiveAuthorizationManager<T> {

    class AggregateDecision {
        var results = mutableListOf<AuthorizationResult>()
        var denialReason: AuthorizationResult? = null
    }

    class CompositeAuthorizationDecision(
        granted: Boolean,
        private val results: List<AuthorizationResult>
    ) : AuthorizationDecision(granted) {
        override fun toString(): String {
            return "CompositeAuthorizationDecision [results=" + this.results + ']'
        }
    }

    return ReactiveAuthorizationManagerCheckAdapter { authentication, obj ->
        Flux.fromArray(managers)
            .flatMap { manager -> manager.authorize(authentication, obj) }
            .filter(Objects::nonNull)
            .defaultIfEmpty(allAbstainDefaultDecision)
            .takeUntil { result -> !result.isGranted }
            .collect(::AggregateDecision) { aggregate, result ->
                aggregate.results.add(result)
                if (!result.isGranted) {
                    aggregate.denialReason = result
                }
            }.map { it.denialReason ?: CompositeAuthorizationDecision(true, it.results) }
    }

}

private fun interface ReactiveAuthorizationManagerCheckAdapter<T> : ReactiveAuthorizationManager<T> {
    @Deprecated("Use #authorize instead", ReplaceWith("authorize(authentication, obj)"))
    override fun check(authentication: Mono<Authentication>, obj: T): Mono<AuthorizationDecision> {
        return authorize(authentication, obj)
            .mapNotNull {
                when (it) {
                    null -> null
                    is AuthorizationDecision -> it
                    else -> throw IllegalArgumentException("please call #authorize or ensure that the result is of type AuthorizationDecision")
                }
            }
    }

    override fun authorize(authentication: Mono<Authentication>, obj: T): Mono<AuthorizationResult>
}

