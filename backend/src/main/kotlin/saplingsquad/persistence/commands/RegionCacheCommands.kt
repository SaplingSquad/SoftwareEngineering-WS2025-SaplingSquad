package saplingsquad.persistence.commands

import org.komapper.annotation.KomapperCommand
import org.komapper.core.Many
import saplingsquad.persistence.tables.OrganizationId
import saplingsquad.persistence.tables.ProjectId

@KomapperCommand("call recalculate_region_of_organization(/*orgId*/0)")
data class RecalculateOrgaRegionName(val orgId: OrganizationId) : Many<Unit>({ select { } })

@KomapperCommand("call recalculate_region_of_project(/*projectId*/0)")
data class RecalculateProjectRegionName(val projectId: ProjectId) : Many<Unit>({ select { } })
