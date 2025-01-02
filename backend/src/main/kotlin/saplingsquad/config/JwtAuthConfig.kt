package saplingsquad.config;

import org.apache.logging.log4j.LogManager
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.authorization.AuthenticatedReactiveAuthorizationManager
import org.springframework.security.authorization.AuthorizationDecision
import org.springframework.security.authorization.ReactiveAuthorizationManager
import org.springframework.security.config.Customizer
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity
import org.springframework.security.config.web.server.ServerHttpSecurity
import org.springframework.security.core.Authentication
import org.springframework.security.oauth2.client.oidc.web.server.logout.OidcClientInitiatedServerLogoutSuccessHandler
import org.springframework.security.oauth2.client.registration.ReactiveClientRegistrationRepository
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken
import org.springframework.security.oauth2.server.resource.authentication.JwtIssuerReactiveAuthenticationManagerResolver
import org.springframework.security.web.server.SecurityWebFilterChain
import org.springframework.security.web.server.authorization.AuthorizationContext
import saplingsquad.utils.reactiveAuthorizationManagersAllOf

@Configuration
@EnableWebFluxSecurity
class JwtAuthConfig(
    val config: AppConfig
) {

    @Bean
    fun springSecurityFilterChain(
        http: ServerHttpSecurity,
        clientRegistrationRepository: ReactiveClientRegistrationRepository,
    ): SecurityWebFilterChain {
        val authResolver = JwtIssuerReactiveAuthenticationManagerResolver.fromTrustedIssuers(
            config.oauth2.usersIssuer.issuerUri,
            config.oauth2.orgasIssuer.issuerUri
        )
        val authManagers = AuthManagers(config)
        val generatedAuthorizationManager = GeneratedAuthorizationManager(authManagers)
        http
            .authorizeExchange(generatedAuthorizationManager::generatedExchangeAuthorization)
            .authorizeExchange { exchanges ->
                exchanges.anyExchange().permitAll()
            }
            .oauth2ResourceServer { oauth2 ->
                oauth2.authenticationManagerResolver(authResolver)
            }
        if (config.showTokenEndpoints) {
            http
                .oauth2Login(Customizer.withDefaults())
                .logout {
                    it.logoutSuccessHandler(OidcClientInitiatedServerLogoutSuccessHandler(clientRegistrationRepository))
                }
        }
        return http.build()
    }

}


class AuthManagers(private val config: AppConfig) : UserTypeAuthorizationManagerProvider {
    private val authenticatedAuthorizationManager =
        AuthenticatedReactiveAuthorizationManager.authenticated<AuthorizationContext>()
    private val logger = LogManager.getLogger()

    override fun forUserType(userType: UserType): ReactiveAuthorizationManager<AuthorizationContext> {
        return reactiveAuthorizationManagersAllOf(
            authenticatedAuthorizationManager,
            correctIssuerForUserTypeAuthorization(userType)
        )
    }

    private fun correctIssuerForUserTypeAuthorization(userType: UserType) =
        ReactiveAuthorizationManager<AuthorizationContext> { authentication, _ ->
            authentication
                .filter { it.isOfType<JwtAuthenticationToken>() }
                .cast(JwtAuthenticationToken::class.java)
                .map { auth -> compareIssuer(auth, userType) }
                .defaultIfEmpty(false)
                .map { AuthorizationDecision(it) }
        }

    private fun issuerOfType(type: UserType): String {
        return when (type) {
            UserType.USER_TOKEN -> config.oauth2.usersIssuer.issuerUri
            UserType.ORGA_TOKEN -> config.oauth2.orgasIssuer.issuerUri
        }
    }

    private fun compareIssuer(auth: JwtAuthenticationToken, userType: UserType): Boolean {
        return issuerOfType(userType) == auth.token.issuer.toString()
    }

    private inline fun <reified T> Authentication.isOfType(): Boolean {
        if (this is T) {
            return true
        } else {
            logger.info("Invalid token class: Expected ${T::class.java}, got ${this::class.java}")
            return false
        }
    }
}

