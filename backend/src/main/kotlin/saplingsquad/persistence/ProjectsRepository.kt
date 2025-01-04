package saplingsquad.persistence;

import kotlinx.coroutines.flow.Flow
import org.komapper.core.dsl.Meta
import org.komapper.core.dsl.QueryDsl
import org.komapper.core.dsl.query.bind
import org.komapper.r2dbc.R2dbcDatabase
import org.springframework.stereotype.Repository
import saplingsquad.persistence.tables.ProjectEntity
import saplingsquad.persistence.tables.projectEntity

@Repository
class ProjectsRepository(private val db: R2dbcDatabase) {

    suspend fun readProjects(answers: List<Int>): Flow<ProjectEntity> =
        db.flowQuery() {
            filterByTagsSqlQuery(answers)
        }
}

private fun filterByTagsSqlQuery(answers: List<Int>) = QueryDsl
    .fromTemplate(
        """
        with tags_from_answers as (select distinct question.tag_id
                                   from question
                                            join filter_tag using (tag_id)
                                   where question_id in /*answers*/(1, 2, 3)),
             intersect_with_tags as (select project_tags.*
                                     from project_tags
                                              join tags_from_answers using (tag_id)),
             intersection_size as (select project.project_id, count(tag_id) as intersection_size
                                   from project
                                            left join intersect_with_tags using (project_id)
                                   group by project.project_id),
             with_rank as (select *, row_number() over (order by intersection_size desc) as rank
                           from intersection_size),
             min_filter_intersection_size as (select min(intersection_size)
                                              from with_rank
                                              where rank <= 3),
             result as (select project.*
                        from project
                                 join intersection_size using (project_id)
                        where intersection_size >= (select * from min_filter_intersection_size)
                        order by intersection_size desc)
        select *
        from result;
        """.trimIndent()
    )
    .bind("answers", answers)
    .selectAsEntity(Meta.projectEntity)
