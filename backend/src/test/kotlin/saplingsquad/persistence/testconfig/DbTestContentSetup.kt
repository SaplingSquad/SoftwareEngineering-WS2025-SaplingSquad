package saplingsquad.persistence.testconfig

import kotlinx.coroutines.runBlocking
import org.komapper.core.dsl.Meta
import org.komapper.core.dsl.QueryDsl
import org.komapper.core.dsl.query.andThen
import org.komapper.r2dbc.R2dbcDatabase
import saplingsquad.persistence.tables.*


object ExampleQuestionsAndTags {

    private fun createQuestionI(i: Int): QuestionEntity {
        return QuestionEntity(
            questionId = i,
            questionTitle = "Question $i",
            question = "Content $i",
            imageUrl = if (i % 2 == 0) "image$i.png" else null,
            tagId = i
        )
    }

    val questions = List(10) { idx -> createQuestionI(idx) }

    private fun tagsFromQuestions(list: List<QuestionEntity>): List<FilterTagEntity> {
        return list
            .map { it.tagId }
            .distinct()
            .map {
                FilterTagEntity(
                    tagId = it,
                    name = "Tag $it"
                )
            }
    }

    internal suspend fun setupQuestions(db: R2dbcDatabase) {
        db.runQuery {
            QueryDsl.create(Meta.filterTagEntity)
                .andThen(
                    QueryDsl.insert(Meta.filterTagEntity).multiple(
                        tagsFromQuestions(questions)
                    )
                )
        }
        db.runQuery(
            QueryDsl.create(Meta.questionEntity)
                .andThen(
                    QueryDsl.insert(Meta.questionEntity).multiple(
                        questions
                    )
                )
        )
    }
}

object ExampleOrgas {
    private fun createOrgI(i: Int): OrganizationEntity {
        return OrganizationEntity(
            orgId = i,
            name = "Org $i",
            description = "Description $i",
            coordinates = CoordinatesEmbedded(i.toDouble(), i.toDouble())
        )
    }

    val orgas = List(10) { idx -> createOrgI(idx) }

    // We want a dataset where:
    // Some orgas have some common tags
    // Some orgas have some multiple tags
    // Some orgas have only one tag
    private fun tagsOfOrga(o: OrganizationEntity) =
        when (o.orgId) {
            in 0..1 -> listOf(0, 1, 2)
            in 2..6 -> listOf(2, 3)
            // tag id := Orga id
            else -> listOf(o.orgId)
        }

    private val orgaTags = orgas
        .map(::tagsOfOrga)
        .flatMapIndexed { idx, tags ->
            tags.map { tagId ->
                OrganizationTagsEntity(
                    orgId = idx,
                    tagId = tagId
                )
            }
        }

    internal suspend fun setupOrgas(db: R2dbcDatabase) {
        db.runQuery(
            QueryDsl.create(Meta.organizationEntity)
                .andThen(
                    QueryDsl.insert(Meta.organizationEntity).multiple(
                        orgas
                    )
                )
        )
        db.runQuery {
            QueryDsl.create(Meta.organizationTagsEntity)
                .andThen(
                    QueryDsl.insert(Meta.organizationTagsEntity).multiple(
                        orgaTags
                    )
                )
        }
    }
}

object ExampleProjects {

    private fun createProjectI(i: Int, orgId: Int): ProjectEntity {
        return ProjectEntity(
            projectId = i,
            orgId = orgId,
            title = "Project $i",
            description = "Description $i",
            coordinates = CoordinatesEmbedded(i.toDouble(), i.toDouble())
        )
    }

    // Create unique projectIds with 1 to 3 projects per organization
    val projects = List(10) { orgId ->
        val n = orgId + 10
        when (orgId) {
            in 0..3 -> listOf(n, 2 * n, 3 * n)
            in 4..5 -> listOf(4 * n, 5 * n)
            else -> listOf(6 * n)
        }.map { projectId -> createProjectI(projectId, orgId) }
    }.flatten()

    private fun tagsOfProject(p: ProjectEntity) =
        when (p.orgId) {
            in 0..1 -> listOf(0, 1, 2)
            in 2..6 -> listOf(2, 3)
            else -> listOf(p.orgId)
        }

    val projectTags = projects
        .flatMap { project ->
            tagsOfProject(project).map { tagId ->
                ProjectTagsEntity(
                    projectId = project.projectId,
                    tagId = tagId
                )
            }
        }

    internal suspend fun setupProjects(db: R2dbcDatabase) {

        db.runQuery(
            QueryDsl.create(Meta.projectEntity)
                .andThen(
                    QueryDsl.insert(Meta.projectEntity).multiple(
                        projects
                    )
                )
        )
        db.runQuery {
            QueryDsl.create(Meta.projectTagsEntity)
                .andThen(
                    QueryDsl.insert(Meta.projectTagsEntity).multiple(
                        projectTags
                    )
                )
        }
    }
}

fun setupDb(db: R2dbcDatabase) = runBlocking {
    ExampleQuestionsAndTags.setupQuestions(db)
    ExampleOrgas.setupOrgas(db)
    ExampleProjects.setupProjects(db)
}
