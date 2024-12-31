package saplingsquad.devlogin

import org.springframework.http.ResponseEntity
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient
import org.springframework.security.oauth2.client.annotation.RegisteredOAuth2AuthorizedClient
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping

/**
 * Only for dev purposes
 */
@Controller
class ShowToken {
    @GetMapping("/showUserToken")
    fun showUserToken(@RegisteredOAuth2AuthorizedClient("keycloak-users") client: OAuth2AuthorizedClient): ResponseEntity<String> {
        return ResponseEntity.ofNullable(client.accessToken.tokenValue)
    }

    @GetMapping("/showOrgaToken")
    fun showOrgaToken(@RegisteredOAuth2AuthorizedClient("keycloak-orgas") client: OAuth2AuthorizedClient): ResponseEntity<String> {
        return ResponseEntity.ofNullable(client.accessToken.tokenValue)
    }
}