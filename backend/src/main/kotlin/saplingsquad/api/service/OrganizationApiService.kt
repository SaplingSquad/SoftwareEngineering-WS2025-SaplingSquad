package saplingsquad.api.service

import kotlinx.coroutines.flow.Flow
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken
import org.springframework.stereotype.Service
import org.springframework.web.server.ResponseStatusException
import saplingsquad.api.*
import saplingsquad.api.models.GetOrganization200Response
import saplingsquad.api.models.GetProject200Response
import saplingsquad.api.models.Organization
import saplingsquad.api.models.Project
import saplingsquad.persistence.*
import saplingsquad.persistence.tables.OrganizationEntity
import saplingsquad.persistence.tables.ProjectEntity
import saplingsquad.utils.asHttpOkResponse
import saplingsquad.utils.flowOfList

@Service
class OrganizationApiService(
    private val organizationsRepository: OrganizationsRepository,
    private val projectsRepository: ProjectsRepository
) : OrganizationApiDelegate {
    override suspend fun registerOrganization(
        orgaToken: JwtAuthenticationToken,
        organization: Organization
    ): ResponseEntity<Int> {
        val result = organizationsRepository.tryRegisterOrganization(
            orgaToken.token.subject,
            OrganizationEntity(
                orgId = 0, // Will be autogenerated (i.e. ignored by komapper)
                name = organization.name,
                description = organization.description,
                foundingYear = organization.foundingYear,
                memberCount = organization.memberCount,
                websiteUrl = organization.webpageUrl,
                donationUrl = organization.donatePageUrl,
                coordinates = listToCoordinates(organization.coordinates)
            ),
            tags = organization.tags.toSet()
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

    override suspend fun getOrganization(orgaToken: JwtAuthenticationToken): ResponseEntity<GetOrganization200Response> {
        return organizationsRepository
            .readOrganizationAndTagsOfAccount(orgaToken.token.subject)!!
            .let { (org, tags) ->
                GetOrganization200Response(
                    orgaId = org.orgId,
                    name = org.name,
                    description = org.description,
                    foundingYear = org.foundingYear,
                    memberCount = org.memberCount,
                    webpageUrl = org.websiteUrl,
                    donatePageUrl = org.donationUrl,
                    imageUrls = emptyList(), //TODO maybe implement images sometime
                    coordinates = org.coordinates.toLonLatList(),
                    tags = tags.toList()
                )
            }
            .asHttpOkResponse()
    }

    override suspend fun updateOrganization(
        orgaToken: JwtAuthenticationToken,
        getOrganization200Response: GetOrganization200Response?
    ): ResponseEntity<Unit> {
        val organization = getOrganization200Response ?: throw ResponseStatusException(
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
                coordinates = listToCoordinates(organization.coordinates),
            ),
            organization.tags.toSet()
        )
        return when (result) {
            OrganizationUpdateResult.Success -> ResponseEntity.ok().build()
            OrganizationUpdateResult.NoOrganizationRegistered -> throw ResponseStatusException(
                HttpStatus.BAD_REQUEST, "No organization registered yet"
            )

            OrganizationUpdateResult.WrongOrganizationId -> throw ResponseStatusException(
                HttpStatus.BAD_REQUEST, "Wrong organization ID in body"
            )
        }
    }

    override suspend fun createProject(orgaToken: JwtAuthenticationToken, project: Project): ResponseEntity<Int> {
        val result = projectsRepository.createProjectForAccount(
            orgaToken.token.subject,
            ProjectEntity(
                projectId = 0, // Is going to be autogenerated (i.e. ignored by komapper)
                orgId = 0, // Is going to be set correctly by the repository
                title = project.name,
                description = project.description,
                dateFrom = project.dateFrom?.let { monthAndYearToDate(it, DateContext.START_DATE) },
                dateTo = project.dateTo?.let { monthAndYearToDate(it, DateContext.END_DATE) },
                websiteUrl = project.webpageUrl,
                donationUrl = project.donatePageUrl,
                coordinates = listToCoordinates(project.coordinates)
            ),
            tags = project.tags.toSet()
        )
        return when (result) {
            is ProjectCrRdResult.Success -> result.value.asHttpOkResponse()
            is ProjectCrRdResult.OrganizationNotRegisteredYet -> throw ResponseStatusException(
                HttpStatus.FORBIDDEN,
                "Organization registration not completed yet"
            )
        }
    }

    override fun getProjectForOrga(orgaToken: JwtAuthenticationToken): ResponseEntity<Flow<GetProject200Response>> {
        return flowOfList {
            when (val result = projectsRepository.readProjectsByAccount(orgaToken.token.subject)) {
                is ProjectCrRdResult.OrganizationNotRegisteredYet -> throw ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Organization registration not completed yet"
                )

                is ProjectCrRdResult.Success -> result.value.map { (proj, tags) ->
                    GetProject200Response(
                        projectId = proj.projectId,
                        name = proj.title,
                        description = proj.description,
                        dateFrom = proj.dateFrom?.let(::dateToMonthAndYear),
                        dateTo = proj.dateTo?.let(::dateToMonthAndYear),
                        imageUrls = emptyList(),
                        webpageUrl = proj.websiteUrl,
                        donatePageUrl = proj.donationUrl,
                        coordinates = proj.coordinates.toLonLatList(),
                        tags = tags.toList()
                    )
                }
            }
        }.asHttpOkResponse()
    }

    override suspend fun updateProject(
        orgaToken: JwtAuthenticationToken,
        getProject200Response: GetProject200Response
    ): ResponseEntity<Unit> {
        //noinspection UnnecessaryLocalVariable
        val proj = getProject200Response

        val result = projectsRepository.updateProjectOfAccount(
            orgaToken.token.subject,
            ProjectEntity(
                projectId = proj.projectId,
                orgId = 0, // must be ignored by repository
                title = proj.name,
                description = proj.description,
                dateFrom = proj.dateFrom?.let { monthAndYearToDate(it, DateContext.START_DATE) },
                dateTo = proj.dateTo?.let { monthAndYearToDate(it, DateContext.END_DATE) },
                websiteUrl = proj.webpageUrl,
                donationUrl = proj.donatePageUrl,
                coordinates = listToCoordinates(proj.coordinates)
            ),
            proj.tags.toSet()
        )
        return when (result) {
            ProjectUpdDelResult.Success -> ResponseEntity.ok().build()

            ProjectUpdDelResult.OrganizationNotRegisteredYet -> throw ResponseStatusException(
                HttpStatus.FORBIDDEN,
                "Organization registration not completed yet"
            )

            ProjectUpdDelResult.NonExistentProjectId, ProjectUpdDelResult.ProjectDoesNotBelongToAccount ->
                throw ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Invalid project id"
                )
        }
    }

    override suspend fun deleteProject(orgaToken: JwtAuthenticationToken, projectId: Int): ResponseEntity<Unit> {
        val result = projectsRepository.deleteProjectOfAccount(orgaToken.token.subject, projectId)
        return when (result) {
            ProjectUpdDelResult.Success -> ResponseEntity.ok().build()

            ProjectUpdDelResult.OrganizationNotRegisteredYet -> throw ResponseStatusException(
                HttpStatus.FORBIDDEN,
                "Organization registration not completed yet"
            )

            ProjectUpdDelResult.NonExistentProjectId, ProjectUpdDelResult.ProjectDoesNotBelongToAccount ->
                throw ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Invalid project id"
                )
        }
    }
}
