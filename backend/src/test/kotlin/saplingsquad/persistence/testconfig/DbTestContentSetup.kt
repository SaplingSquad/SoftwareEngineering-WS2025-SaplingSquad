package saplingsquad.persistence.testconfig

import kotlinx.coroutines.runBlocking
import org.komapper.core.dsl.Meta
import org.komapper.core.dsl.QueryDsl
import org.komapper.core.dsl.metamodel.EntityMetamodel
import org.komapper.core.dsl.metamodel.PropertyMetamodel
import org.komapper.core.dsl.query.andThen
import org.komapper.r2dbc.R2dbcDatabase
import saplingsquad.persistence.ProjectWithRegionEntityAndTags
import saplingsquad.persistence.commands.RecalculateOrgaRegionName
import saplingsquad.persistence.commands.RecalculateProjectRegionName
import saplingsquad.persistence.commands.execute
import saplingsquad.persistence.tables.*
import java.sql.Connection
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

    val tags = tagsFromQuestions(questions)

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
                        tags
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

object ExampleRegions {
    private fun regionEntity(id: RegionId, continentId: ContinentId): RegionEntity {
        return RegionEntity(
            "RegionId$id",
            "region$id",
            "ContinentId$continentId",
            "Continent$continentId"
        )
    }

    private fun continentEntity(id: ContinentId): ContinentEntity {
        return ContinentEntity("ContinentId$id", "Continent$id")
    }

    val continents = List(3) { continentEntity(it.toString()) }

    val regions = List(10) {
        when (it) {
            in 0..3 -> regionEntity(it.toString(), "0")
            in 4..7 -> regionEntity(it.toString(), "2")
            else -> regionEntity(it.toString(), "2")
        }
    }

    internal suspend fun setupRegions(db: R2dbcDatabase) {
        db.runQuery {
            QueryDsl.create(Meta.continentEntity)
                .andThen(
                    QueryDsl.insert(Meta.continentEntity).multiple(
                        continents
                    )
                )
        }
        db.runQuery {
            QueryDsl.create(Meta.regionEntity)
                .andThen(
                    QueryDsl.insert(Meta.regionEntity).multiple(
                        regions
                    )
                )
        }
    }
}


/** Mock region names for coordinates
 * ```kotlin
 * "lat $lat lon $lon"
 * ```
 */
fun CoordinatesEmbedded.toRegionName(): String {
    return "lon $coordinatesLon lat $coordinatesLat"
}

object ExampleOrgas {
    private fun createOrgI(i: Int): OrganizationWithRegionEntity {
        val coordinates = CoordinatesEmbedded(i.toDouble(), i.toDouble())
        return OrganizationWithRegionEntity(
            orgId = i,
            name = "Org $i",
            description = "Description $i",
            foundingYear = 2000,
            memberCount = i,
            websiteUrl = "Website Url $i",
            donationUrl = "Donation Url $i",
            coordinates = coordinates,
            regionName = coordinates.toRegionName()
        )
    }

    val orgas = List(10) { idx -> createOrgI(idx) }

    // We want a dataset where:
    // Some orgas have some common tags
    // Some orgas have some multiple tags
    // Some orgas have only one tag
    fun tagsOfOrga(o: OrganizationWithRegionEntity) =
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
                .andThen(QueryDsl.executeScript(createRegionCacheFunctionsAndTablesSqlStatement(Type.Organization)))
                .andThen(
                    QueryDsl.insert(organizationEntityNoAutoIncrement).multiple(
                        orgas.map { it.toOrganizationEntity() }
                    )
                )
        )
        for (orga in orgas) {
            db.runQuery {
                QueryDsl.execute(RecalculateOrgaRegionName(orga.orgId))
            }
        }
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

    private fun createProjectI(i: Int, orgId: Int): ProjectWithRegionEntity {
        val coordinates = CoordinatesEmbedded(i.toDouble(), i.toDouble())
        return ProjectWithRegionEntity(
            projectId = i,
            orgId = orgId,
            title = "Project $i",
            description = "Description $i",
            dateFrom = LocalDate.of(2020, 1, 1),
            dateTo = LocalDate.of(2020, 1, 1),
            websiteUrl = "Website Url $1",
            donationUrl = "Donation Url $1",
            coordinates = coordinates,
            regionName = coordinates.toRegionName()
        )
    }

    // Create unique projectIds with 1 to 3 projects per organization
    private fun projectIdsForOrga(orgId: OrganizationId): List<ProjectId> {
        val n = orgId + 10
        return when (orgId) {
            in 0..3 -> listOf(n, 2 * n, 3 * n)
            in 4..5 -> listOf(4 * n, 5 * n)
            else -> listOf(6 * n)
        }
    }

    private fun projectWithTagForId(id: ProjectId): ProjectWithRegionEntityAndTags? {
        return projects.find { it.projectId == id }?.let { p ->
            Pair(p, tagsOfProject(p).toSet())
        }
    }

    fun projectsWithTagsForOrga(orgId: OrganizationId): List<ProjectWithRegionEntityAndTags> {
        return projectIdsForOrga(orgId).mapNotNull(::projectWithTagForId)
    }

    val projects = List(10) { orgId ->
        projectIdsForOrga(orgId).map { projectId -> createProjectI(projectId, orgId) }
    }.flatten()

    private fun tagsOfProject(p: ProjectWithRegionEntity) =
        when (p.orgId) {
            in 0..1 -> listOf(0, 1, 2)
            in 2..6 -> listOf(2, 3)
            else -> listOf(p.orgId)
        }

    private val projectTags = projects
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
        // Make id auto incremented by hand
        // GENERATED BY DEFAULT AS IDENTITY instead of
        // GENERATED ALWAYS AS IDENTITY (Komapper would create tables like this)
        val projectEntityNoAutoIncrement = Meta.projectEntity.clone(disableAutoIncrement = true)
        val makeAutoIncrementStatement = makeColumnAutoIncrementSqlStatement(
            Meta.projectEntity,
            Meta.projectEntity.projectId,
            1000
        )
        db.runQuery(
            QueryDsl.create(projectEntityNoAutoIncrement)
                .andThen(QueryDsl.executeScript(makeAutoIncrementStatement))
                .andThen(QueryDsl.executeScript(createRegionCacheFunctionsAndTablesSqlStatement(Type.Project)))
                .andThen(
                    QueryDsl.insert(projectEntityNoAutoIncrement).multiple(
                        projects.map { it.toProjectEntity() }
                    )
                )
        )
        for (project in projects) {
            db.runQuery {
                QueryDsl.execute(RecalculateProjectRegionName(project.projectId))
            }
        }
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
    ExampleRegions.setupRegions(db)
    db.runQuery {
        QueryDsl.create(Meta.organizationAccountEntity)
    }
    db.runQuery {
        QueryDsl.create(Meta.answerEntity)
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

enum class Type(val tableName: String, val idColName: String) {
    Organization("organization", "org_id"),
    Project("project", "project_id");

    val functionName =
        "saplingsquad.persistence.testconfig.H2Static.recalculateRegionOf${tableName.replaceFirstChar { it.uppercaseChar() }}"
}

/**
 * Create the region_cache table for organization or project (similar to
 * resources/db/changelog/0020-org-proj-add-regionname.sql)
 * Create a mock version of the region calculation SQL function.
 * The "region" of a coordinate is as in [CoordinatesEmbedded.toRegionName] just
 * ```kotlin
 * "lat $lat lon $lon"
 * ```
 */
private fun createRegionCacheFunctionsAndTablesSqlStatement(type: Type): String {
    val tab = type.tableName
    val id = type.idColName
    //language=H2
    return """
        create table ${tab}_region_cache
        (
            $id integer primary key references $tab on delete cascade,
            region_id text
        );
        
        create alias recalculate_region_of_${tab} for "${type.functionName}";
        
        create view ${tab}_with_region as 
        select $tab.*, c.region_id, c.region_id as region_name --use id as id and name
        from $tab
                left join ${tab}_region_cache as c using ($id);
    """.trimIndent()
}

/**
 * H2 only allows JVM static methods as SQL procedures => create JVM methods which manually execute some SQL code
 */
object H2Static {
    @JvmStatic
    fun recalculateRegionOfOrganization(conn: Connection, id: OrganizationId) {
        val prep = conn.prepareStatement(recalculate_region_statement(Type.Organization))
        prep.setInt(1, id)
        prep.execute()
    }

    @JvmStatic
    fun recalculateRegionOfProject(conn: Connection, id: ProjectId) {
        val prep = conn.prepareStatement(recalculate_region_statement(Type.Project))
        prep.setInt(1, id)
        prep.execute()
    }

    @JvmStatic
    private fun recalculate_region_statement(type: Type): String {
        val tab = type.tableName
        val id = type.idColName
        //language=H2
        return """ 
            merge into ${tab}_region_cache as target
            using (select t.$id, 'lon ' || t.coordinates_lon || ' lat ' || t.coordinates_lat as region_id
                    from $tab as t
                    where t.$id = ?) as incoming
            on (target.$id = incoming.$id)
            when matched then
                update set target.region_id = incoming.region_id
            when not matched then
                insert ($id, region_id) values (incoming.$id, incoming.region_id)
        """
    }
}