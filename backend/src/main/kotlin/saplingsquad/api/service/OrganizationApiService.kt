package saplingsquad.api.service

import kotlinx.coroutines.flow.Flow
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken
import org.springframework.stereotype.Service
import org.springframework.web.server.ResponseStatusException
import saplingsquad.api.OrganizationApiDelegate
import saplingsquad.api.listToCoordinates
import saplingsquad.api.models.*
import saplingsquad.api.toLonLatList
import saplingsquad.persistence.OrganizationRegisterResult
import saplingsquad.persistence.OrganizationUpdateResult
import saplingsquad.persistence.OrganizationsRepository
import saplingsquad.persistence.tables.OrganizationEntity
import saplingsquad.utils.asHttpOkResponse

@Service
class OrganizationApiService(private val organizationsRepository: OrganizationsRepository) : OrganizationApiDelegate {
    override suspend fun registerOrganization(
        orgaToken: JwtAuthenticationToken,
        organization: Organization
    ): ResponseEntity<Int> {
        val result = organizationsRepository.tryRegisterOrganization(
            orgaToken.token.subject, OrganizationEntity(
                orgId = 0, // Will be autogenerated (i.e. ignored by komapper)
                name = organization.name,
                description = organization.description,
                foundingYear = organization.foundingYear,
                memberCount = organization.memberCount,
                websiteUrl = organization.webpageUrl,
                donationUrl = organization.donatePageUrl,
                coordinates = listToCoordinates(organization.coordinates)
            )
        )
        return when (result) {
            is OrganizationRegisterResult.AlreadyRegistered ->
                throw ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Already registered an organization with this account"
                )

            is OrganizationRegisterResult.Success -> ResponseEntity.ok()
                .contentType(MediaType.TEXT_PLAIN)
                .body(result.id)
        }
    }

    override suspend fun getOrganization(orgaToken: JwtAuthenticationToken): ResponseEntity<GetOrganizationDetails200Response> {
        return organizationsRepository
            .readOrganizationOfAccount(orgaToken.token.subject)!!
            .let {
                GetOrganizationDetails200Response(
                    orgaId = it.orgId,
                    name = it.name,
                    description = it.description,
                    foundingYear = it.foundingYear,
                    memberCount = it.memberCount,
                    webpageUrl = it.websiteUrl,
                    donatePageUrl = it.donationUrl,
                    imageUrls = emptyList(), //TODO maybe implement images sometime
                    coordinates = it.coordinates.toLonLatList()
                )
            }
            .asHttpOkResponse()
    }

    override suspend fun updateOrganization(
        orgaToken: JwtAuthenticationToken,
        getOrganizationDetails200Response: GetOrganizationDetails200Response?
    ): ResponseEntity<Unit> {
        val organization = getOrganizationDetails200Response ?: throw ResponseStatusException(
            HttpStatus.BAD_REQUEST, "Missing body"
        )
        val result = organizationsRepository.updateOrganizationOfAccount(
            orgaToken.token.subject, OrganizationEntity(
                orgId = organization.orgaId,
                name = organization.name,
                description = organization.description,
                foundingYear = organization.foundingYear,
                memberCount = organization.memberCount,
                websiteUrl = organization.webpageUrl,
                donationUrl = organization.donatePageUrl,
                coordinates = listToCoordinates(organization.coordinates)
            )
        )
        return when (result) {
            OrganizationUpdateResult.Success -> ResponseEntity.ok().build()
            OrganizationUpdateResult.NoOrganizationRegsitered -> throw ResponseStatusException(
                HttpStatus.BAD_REQUEST, "No organization registered yet"
            )

            OrganizationUpdateResult.WrongOrganizationId -> throw ResponseStatusException(
                HttpStatus.BAD_REQUEST, "Wrong organization ID in body"
            )
        }
    }

    override suspend fun createProject(orgaToken: JwtAuthenticationToken, project: Project?): ResponseEntity<Int> {
        TODO("Not yet implemented")
    }

    override fun getProjectForOrga(orgaToken: JwtAuthenticationToken): ResponseEntity<Flow<GetProjectForOrga200ResponseInner>> {
        TODO("Not yet implemented")
    }

    override suspend fun updateProject(
        orgaToken: JwtAuthenticationToken,
        projectDescriptions: GetProject200Response?
    ): ResponseEntity<Unit> {
        TODO("Not yet implemented")
    }

    override suspend fun deleteProject(orgaToken: JwtAuthenticationToken, projectId: Int): ResponseEntity<Unit> {
        TODO("Not yet implemented")
    }
}
