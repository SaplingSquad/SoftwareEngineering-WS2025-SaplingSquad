package saplingsquad.persistence.testconfig

import kotlinx.coroutines.runBlocking
import org.komapper.core.dsl.Meta
import org.komapper.core.dsl.QueryDsl
import org.komapper.core.dsl.metamodel.EntityMetamodel
import org.komapper.core.dsl.metamodel.PropertyMetamodel
import org.komapper.core.dsl.query.andThen
import org.komapper.r2dbc.R2dbcDatabase
import saplingsquad.persistence.tables.*
import java.time.LocalDate


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
            foundingYear = 2000,
            memberCount = i,
            websiteUrl = "Website Url $i",
            donationUrl = "Donation Url $i",
            coordinates = CoordinatesEmbedded(i.toDouble(), i.toDouble())
        )
    }

    val orgas = List(10) { idx -> createOrgI(idx) }

    // We want a dataset where:
    // Some orgas have some common tags
    // Some orgas have some multiple tags
    // Some orgas have only one tag
    fun tagsOfOrga(o: OrganizationEntity) =
        when (o.orgId) {
            in 0..4 -> listOf(0, 1, 2)
            in 5..6 -> listOf(2, 3)
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

    val organizationBookmarks = orgas.flatMap { org ->
        val orgId = org.orgId
        when (orgId) {
            in 0..3 -> listOf(1)
            in 4..5 -> emptyList()
            else -> listOf(orgId)
        }.map { i -> OrganizationBookmarksEntity("UserId $i", orgId) }
    }

    internal suspend fun setupOrgas(db: R2dbcDatabase) {
        // Make id auto incremented by hand
        // GENERATED BY DEFAULT AS IDENTITY instead of
        // GENERATED ALWAYS AS IDENTITY (Komapper would create tables like this)
        val organizationEntityNoAutoIncrement = Meta.organizationEntity.clone(disableAutoIncrement = true)
        val makeAutoIncrementStatement = makeColumnAutoIncrementSqlStatement(
            Meta.organizationEntity,
            Meta.organizationEntity.orgId,
            1000
        )
        db.runQuery(
            QueryDsl.create(organizationEntityNoAutoIncrement)
                .andThen(QueryDsl.executeScript(makeAutoIncrementStatement))
                .andThen(
                    QueryDsl.insert(organizationEntityNoAutoIncrement).multiple(
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
        db.runQuery {
            QueryDsl.create(Meta.organizationBookmarksEntity)
                .andThen(
                    QueryDsl.insert(Meta.organizationBookmarksEntity).multiple(
                        organizationBookmarks
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
            dateFrom = LocalDate.of(2020, 1, 1),
            dateTo = LocalDate.of(2020, 1, 1),
            websiteUrl = "Website Url $1",
            donationUrl = "Donation Url $1",
            coordinates = CoordinatesEmbedded(i.toDouble(), i.toDouble())
        )
    }

    // Create unique projectIds with 1 to 3 projects per organization
    fun projectIdsForOrga(orgId: OrganizationId): List<ProjectId> {
        val n = orgId + 10
        return when (orgId) {
            in 0..3 -> listOf(n, 2 * n, 3 * n)
            in 4..5 -> listOf(4 * n, 5 * n)
            else -> listOf(6 * n)
        }
    }

    val projects = List(10) { orgId ->
        projectIdsForOrga(orgId).map { projectId -> createProjectI(projectId, orgId) }
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

    val projectBookmarks = projects.flatMap { project ->
        val i = projects.indexOf(project)
        when (i) {
            in 0..3 -> listOf(1)
            in 4..5 -> emptyList()
            else -> listOf(i)
        }.map { e -> ProjectBookmarksEntity("UserId $e", project.projectId) }
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
        db.runQuery {
            QueryDsl.create(Meta.projectBookmarksEntity)
                .andThen(
                    QueryDsl.insert(Meta.projectBookmarksEntity).multiple(
                        projectBookmarks
                    )
                )
        }
    }
}

fun setupDb(db: R2dbcDatabase) = runBlocking {
    db.runQuery {
        QueryDsl.executeScript("SET SESSION CHARACTERISTICS AS TRANSACTION ISOLATION LEVEL SERIALIZABLE")
    }
    ExampleQuestionsAndTags.setupQuestions(db)
    ExampleOrgas.setupOrgas(db)
    ExampleProjects.setupProjects(db)
    db.runQuery {
        QueryDsl.create(Meta.organizationAccountEntity)
    }

}

private fun <ENTITY : Any, ID : Any, META : EntityMetamodel<ENTITY, ID, META>, EXTERIOR : Any, INTERIOR : Any> makeColumnAutoIncrementSqlStatement(
    metamodel: EntityMetamodel<ENTITY, ID, META>,
    column: PropertyMetamodel<ENTITY, EXTERIOR, INTERIOR>,
    startId: Int
): String {
    return """
        ALTER TABLE "${metamodel.getCanonicalTableName { it }}" 
        ALTER COLUMN "${column.columnName}" INTEGER GENERATED BY DEFAULT AS IDENTITY (RESTART WITH ${startId});
    """.trimIndent()
}