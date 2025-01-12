package saplingsquad.persistence.commands

import org.komapper.annotation.*
import org.komapper.core.Many
import org.komapper.core.dsl.query.ProjectionType
import saplingsquad.persistence.tables.*
import java.time.LocalDate

//language=sql
@KomapperCommand(
    """
with project_counts as (select org_id, count(project_id) as project_count 
                        from project 
                        group by org_id),
     org_taglist as (select org_id, array_agg(tag_id) as tags 
                     from organization_tags
                     group by org_id),
     proj_taglist as (select project_id, array_agg(tag_id) as tags 
                     from project_tags
                     group by project_id),
     combined as (select o.org_id            as combined_id,
                         o.org_id,               --shared
                         o.description,
                         o.website_url,
                         o.donation_url,
                         o.coordinates_lon,
                         o.coordinates_lat,
                         o.region_id,
                         o.region_name,
                         org_taglist.tags,
                         'orga'              as type,
                         o.name,                 --only orga
                         o.founding_year,
                         o.member_count,
                         project_counts.project_count,
                         null                as project_id, --only project
                         null                as title,
                         null                as date_from,
                         null                as date_to,
                         null                as org_name -- this is a field for projects
                  from organization_with_region as o
                    left outer join project_counts on o.org_id = project_counts.org_id
                    left outer join org_taglist on o.org_id = org_taglist.org_id
                  where 
                  /*>regionFilter*/
                  /*>continentFilter*/
                  /*>maxMembersFilter*/
                  /*% if searchTextFilter != null */
                    lower(o.name) /*>searchTextFilter*/ and
                  /*% end */
                  /*type.loadOrganizations*/true
                  union
                  select p.project_id      as combined_id,
                         p.org_id,     -- shared
                         p.description,
                         p.website_url,
                         p.donation_url,
                         p.coordinates_lon,
                         p.coordinates_lat,
                         p.region_id,
                         p.region_name,
                         proj_taglist.tags,
                         'proj'            as type,
                         null              as name,
                         null              as founding_year,
                         null              as member_count,
                         null              as project_count,
                         p.project_id, --only project
                         p.title,
                         p.date_from,
                         p.date_to,
                         organization.name as org_name
                  from project_with_region as p
                    join organization on p.org_id = organization.org_id -- for member count comparison
                    left outer join proj_taglist on p.project_id = proj_taglist.project_id
                  where 
                  /*>regionFilter*/
                  /*>continentFilter*/
                  /*>maxMembersFilter*/
                  /*% if searchTextFilter != null */
                    lower(p.title) /*>searchTextFilter*/ and
                  /*% end */
                  /*type.loadProjects*/true
                ),
     tags_from_answers as (select distinct question.tag_id
                           from question
                                    join filter_tag using (tag_id)
                           where question_id in /*answers*/(5, 1)),
     combined_orga_and_proj_tags as (select 'orga' as type,
                                            org_id as combined_id,
                                            tag_id
                                     from organization_tags
                                     union
                                     select 'proj'     as type,
                                            project_id as combined_id,
                                            tag_id
                                     from project_tags),
     intersect_with_tags as (select combined_orga_and_proj_tags.*
                             from combined_orga_and_proj_tags
                                      join tags_from_answers using (tag_id)),
     intersection_size as (select combined.combined_id, combined.type, count(tag_id) as intersection_size
                           from combined
                                    left join intersect_with_tags using (combined_id, type)
                           group by combined.combined_id, combined.type),
     tag_count_orgproj as (select combined_id, type, count(tag_id) as orgproj_count
                           from combined_orga_and_proj_tags
                           group by combined_id, type),
     tag_count_answers as (select count(tag_id) as answer_count from tags_from_answers),
     too_many_answer_tags_penalty
         as (select i.combined_id,
                    i.type,
                    case
                        when answer_count = 0 then 0
                        else greatest(0, answer_count - intersection_size)::numeric / greatest(1, answer_count)
                        end as penalty
             from intersection_size as i
                      cross join tag_count_answers),
     too_many_orgproj_tags_penalty
         as (select i.combined_id,
                    i.type,
                    case
                        when answer_count = 0 then 0
                        else greatest(0, orgproj_count - intersection_size)::numeric / greatest(1, orgproj_count)
                        end as penalty
             from intersection_size as i
                      join tag_count_orgproj using (combined_id, type)
                      cross join tag_count_answers),
     scored as (select i.combined_id,
                       i.type,
                       greatest(0, 1 - 0.5 * too_many_answer_tags_penalty.penalty -
                                   0.5 * too_many_orgproj_tags_penalty.penalty) as score
                from intersection_size as i
                         join too_many_orgproj_tags_penalty using (combined_id, type)
                         join too_many_answer_tags_penalty using (combined_id, type)),
     with_rank as (select *, row_number() over (order by score desc) as rank
                   from scored),
     min_filter_score as (select min(score) as min
                          from with_rank
                          where rank <= 3),
     result as (select score, combined.*
                from combined
                         join scored using (combined_id, type)
                         cross join min_filter_score
                where score >= min_filter_score.min
                order by score desc)
select *
from result
order by score desc;
"""
)
data class SearchCommand(
    val answers: List<Int>,
    val regionFilter: SearchFilterRegion?,
    val continentFilter: SearchFilterContinent?,
    val maxMembersFilter: SearchFilterMaxMembers?,
    val searchTextFilter: SearchTextFilter?,
    val type: SearchTypeFilter = SearchTypeFilter.All
) : Many<SearchResultEntity>({ selectAsSearchResultEntity(ProjectionType.NAME) })

enum class SearchTypeFilter(val loadOrganizations: Boolean, val loadProjects: Boolean) {
    Projects(false, true),
    Organizations(true, false),
    All(true, true);
}

@KomapperPartial(
    """
    region_id = /*regionId*/'germany' and
    """,
)
data class SearchFilterRegion(val regionId: String)

@KomapperPartial(
    """
    continent_id = /*continentId*/'europe' and
    """,
)
data class SearchFilterContinent(val continentId: String)

@KomapperPartial(
    """
    member_count < /*maxMembers*/1000 and
    """,
)
data class SearchFilterMaxMembers(val maxMembers: Int)

@KomapperPartial(
    """
    like '%' || lower(/*searchString*/'test') || '%'
    """,
)
data class SearchTextFilter(val searchString: String)

@KomapperEntity
@KomapperProjection
data class SearchResultEntity(
    val score: Double,
    // Discriminator
    @KomapperId
    @KomapperEnum(EnumType.PROPERTY, hint = "asString")
    val type: Type,
    // Shared
    //Organiztaion id is shared, it is primary key on organization and foreign key on project
    @KomapperId
    val orgId: OrganizationId,
    val description: String,
    val websiteUrl: String?,
    val donationUrl: String?,
    @KomapperEmbedded
    val coordinates: CoordinatesEmbedded,
    val regionName: String,
    val tags: List<TagId>,

    // Organization
    val name: String?, //made nullable
    val foundingYear: Int?,
    val memberCount: Int?,
    val projectCount: Int?, //made nullable

    // Project
    @KomapperId
    val projectId: ProjectId?, //made nullable
    val title: String?, //made nullable
    val dateFrom: LocalDate?,
    val dateTo: LocalDate?,
    val orgName: String?, //made nullable
) {
    enum class Type(val asString: String) {
        Project("proj"),
        Organization("orga"),
    }

    data class OrganizationWithProjectCount(
        val org: OrganizationWithRegionEntity,
        val tags: List<TagId>,
        val projectCount: Int
    )

    data class ProjectWithOrgName(val proj: ProjectWithRegionEntity, val tags: List<TagId>, val orgName: String)

    fun toOrganizationEntity(): OrganizationWithProjectCount? =
        if (type == Type.Organization) OrganizationWithProjectCount(
            org = OrganizationWithRegionEntity(
                orgId = orgId,
                name = name!!,
                description = description,
                foundingYear = foundingYear,
                memberCount = memberCount,
                websiteUrl = websiteUrl!!,
                donationUrl = donationUrl,
                coordinates = coordinates,
                regionName = regionName,
            ),
            projectCount = projectCount!!,
            tags = tags
        ) else null

    fun toProjectEntity(): ProjectWithOrgName? = if (type == Type.Project) ProjectWithOrgName(
        proj = ProjectWithRegionEntity(
            projectId = projectId!!,
            orgId = orgId,
            title = title!!,
            description = description,
            dateFrom = dateFrom,
            dateTo = dateTo,
            websiteUrl = websiteUrl,
            donationUrl = donationUrl,
            coordinates = coordinates,
            regionName = regionName,
        ),
        orgName = orgName!!,
        tags = tags
    ) else null
}