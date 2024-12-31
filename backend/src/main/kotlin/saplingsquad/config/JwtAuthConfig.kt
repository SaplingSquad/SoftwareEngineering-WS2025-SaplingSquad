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
import org.springframework.stereotype.Component
import saplingsquad.utils.booleanAnd

@Configuration
@EnableWebFluxSecurity
class JwtAuthConfig(
    val config: AppConfig
) {

    @Bean
    fun springSecurityFilterChain(
        http: ServerHttpSecurity,
        clientRegistrationRepository: ReactiveClientRegistrationRepository,
        generatedAuthorizationManager: GeneratedAuthorizationManager
    ): SecurityWebFilterChain {
        val authResolver = JwtIssuerReactiveAuthenticationManagerResolver.fromTrustedIssuers(
            config.oauth2.usersIssuer.issuerUri,
            config.oauth2.orgasIssuer.issuerUri
        )
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

@Component
class AuthResolverFactory(config: AppConfig) : AuthorizationManagerFactory {
    private val authenticatedAuthorizationManager =
        AuthenticatedReactiveAuthorizationManager.authenticated<AuthorizationContext>()
    private val logger = LogManager.getLogger()

    private val typeOfIssuers = mapOf(
        config.oauth2.usersIssuer.issuerUri to UserType.USER_TOKEN,
        config.oauth2.orgasIssuer.issuerUri to UserType.ORGA_TOKEN
    )

    override fun getAuthorizationManager(userType: UserType): ReactiveAuthorizationManager<AuthorizationContext> {

        return ReactiveAuthorizationManager { authentication, obj ->
            val authenticated = authenticatedAuthorizationManager.check(authentication, obj)
                .map(AuthorizationDecision::isGranted)
            val correctType = authentication
                .filter { it.isOfType<JwtAuthenticationToken>() }
                .cast(JwtAuthenticationToken::class.java)
                .map { auth -> compareIssuer(auth, userType) }
                .defaultIfEmpty(false)
            return@ReactiveAuthorizationManager authenticated.booleanAnd(correctType)
                .map { AuthorizationDecision(it) }
        }
    }

    private fun compareIssuer(auth: JwtAuthenticationToken, userType: UserType): Boolean {
        // Error on unknown token issuer to detect potential configuration mistakes
        val tokenUserType = typeOfIssuers[auth.token.issuer.toString()]
            ?: throw IllegalArgumentException("Unknown issuer: ${auth.token.issuer}")
        return tokenUserType == userType
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

