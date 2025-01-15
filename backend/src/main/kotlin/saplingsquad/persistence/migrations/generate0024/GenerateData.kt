package saplingsquad.persistence.migrations.generate0024

import liquibase.Scope
import liquibase.change.ColumnConfig
import liquibase.change.custom.CustomSqlChange
import liquibase.database.Database
import liquibase.exception.ValidationErrors
import liquibase.resource.ResourceAccessor
import liquibase.statement.SqlStatement
import liquibase.statement.core.InsertStatement
import java.time.LocalDate
import kotlin.math.floor
import kotlin.math.max
import kotlin.math.pow
import kotlin.random.Random

/**
 * Generate some placeholder Organizations, Projects and Regions for demonstration purposes.
 * The names/titles are concatenations of random words, descriptions are lorem ipsum substrings.
 * Positions are randomly generated. To avoid an even distribution of points, (to see the pin clustering in action)
 * the probability with which an org/project/region is placed at some position is dependent on a perlin noise map
 *
 * However in the following step (changeset 0025), some of the organizations in the ocean are removed.
 *
 * Used by liquibase migration to load those into the Database
 */
@Suppress("unused")
class GenerateData : CustomSqlChange {

    companion object {
        /** Generate around 500 organizations **/
        private const val ORG_GENERATION_ATTEMPTS = 20000

        /** Generate around 2-3 organizations per project **/
        private const val PROJECT_GENERATION_ATTEMPTS = 100

        private const val MAX_NUM_TAGS = 10
        private val AVAILABLE_TAGS = (1..17).toList()
    }

    override fun getConfirmationMessage(): String {
        return "Organizations and Projects generated"
    }

    override fun setUp() {
        // Do nothing
    }

    override fun setFileOpener(resources: ResourceAccessor) {
        // Do nothing
    }

    override fun validate(db: Database): ValidationErrors {
        // Empty error collection
        return ValidationErrors()
    }

    /**
     * Called by liquibase to get the SQL statements for this Task
     */
    override fun generateStatements(db: Database?): Array<SqlStatement> {
        val statements = mutableListOf<SqlStatement>()
        generateOrganizations(statements)
        return statements.toTypedArray()
    }


    /**
     * Generate random organizations and their projects. [ORG_GENERATION_ATTEMPTS] attempts are made to create an organization.
     * With a ~2.5 success chance, this leads to 0.025*[ORG_GENERATION_ATTEMPTS] organizations.
     * Each successful organization then has [PROJECT_GENERATION_ATTEMPTS] attempts to create a project somewhere random.
     */
    private fun generateOrganizations(list: MutableList<SqlStatement>) {
        Scope.getCurrentScope().getLog(javaClass).info("Generating statements for organizations...")
        var projectIdCounter = 1
        for (i in 1..ORG_GENERATION_ATTEMPTS) {
            var point = randomPoint() ?: continue
            val org = Organization(
                i,
                randomName(),
                randomDescription(),
                randomFoundingYear(),
                randomMemberNumber(),
                generateWebsiteUrl(i),
                generateDonationUrl(i),
                point,
                randomTags()
            )
            insertOrganizationStatement(org, list)
            for (j in 1..PROJECT_GENERATION_ATTEMPTS) {
                point = randomPoint() ?: continue
                val timespan = randomTimespan()
                val proj = Project(
                    projectIdCounter,
                    org.id,
                    randomName(),
                    randomDescription(),
                    timespan.first,
                    timespan.second,
                    generateWebsiteUrl(org.id, projectIdCounter),
                    generateDonationUrl(org.id, projectIdCounter),
                    point,
                    randomTags()
                )
                insertProjectStatement(proj, list)
                projectIdCounter++
            }
        }
    }

    /**
     * Construct the SQL insert statement for organizations, also constructs the statements for insertion of
     * the organization's tags
     */
    private fun insertOrganizationStatement(org: Organization, list: MutableList<SqlStatement>) {
        val insertOrg = InsertStatement("postgres", "public", "organization")
            .addColumnValue("org_id", org.id)
            .addColumnValue("name", org.name)
            .addColumnValue("description", org.description)
            .addColumnValue("founding_year", org.foundingYear)
            .addColumnValue("member_count", org.members)
            .addColumnValue("website_url", org.websiteUrl)
            .addColumnValue("donation_url", org.donationUrl)
            .addColumnValue("coordinates_lon", org.coordinates.lon)
            .addColumnValue("coordinates_lat", org.coordinates.lat)

        list.add(insertOrg)

        org.tags.asSequence()
            .map {
                InsertStatement("postgres", "public", "organization_tags")
                    .addColumnValue("org_id", org.id)
                    .addColumnValue("tag_id", it)
            }
            .forEach(list::add)
    }

    /**
     * same as [insertOrganizationStatement]
     * @see insertOrganizationStatement
     */
    private fun insertProjectStatement(proj: Project, list: MutableList<SqlStatement>) {
        val insertOrg = InsertStatement("postgres", "public", "project")
            .addColumnValue("project_id", proj.id)
            .addColumnValue("org_id", proj.orgId)
            .addColumnValue("title", proj.title)
            .addColumnValue("description", proj.description)
            .addColumn(ColumnConfig.fromName("date_from").setValueDate(proj.timeFrom?.toString()))
            .addColumn(ColumnConfig.fromName("date_to").setValueDate(proj.timeTo?.toString()))
            .addColumnValue("website_url", proj.websiteUrl)
            .addColumnValue("donation_url", proj.donationUrl)
            .addColumnValue("coordinates_lon", proj.coordinates.lon)
            .addColumnValue("coordinates_lat", proj.coordinates.lat)

        list.add(insertOrg)

        proj.tags.asSequence()
            .map {
                InsertStatement("postgres", "public", "project_tags")
                    .addColumnValue("project_id", proj.id)
                    .addColumnValue("tag_id", it)
            }
            .forEach(list::add)
    }

    /**
     * Generate some random tags (each additional tag is added with less probability). Limited to [MAX_NUM_TAGS]
     */
    private fun randomTags(): Set<Int> {
        var probability = 1.0
        var i = 0
        val tags = mutableSetOf<Int>()
        while (Random.nextDouble() <= probability && i < MAX_NUM_TAGS) {
            tags.add(AVAILABLE_TAGS.random())
            probability *= 0.85
            i++
        }
        return tags
    }

    /**
     * Generate some random names: concatenate 3 random words from a list of words
     */
    private fun randomName(): String {
        val nameList = arrayOf(
            "Serendipity",
            "Quantum",
            "Tranquil",
            "Vortex",
            "Luminescence",
            "Kaleidoscope",
            "Zenith",
            "Obsidian",
            "Mosaic",
            "Ephemeral",
            "Wanderlust",
            "Labyrinth",
            "Aurora",
            "Elixir",
            "Nebula",
            "Verdant",
            "Cascade",
            "Paradox",
            "Solstice",
            "Mirage"
        )
        return nameList.random() + " " + nameList.random() + " " + nameList.random()
    }

    /**
     * Generate a random description: Random substring of lorem ipsum
     */
    private fun randomDescription(): String {
        // @formatter:off
        val lorem = "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.".repeat(10)
        // @formatter:on
        val start = Random.nextInt(0, lorem.length / 2)
        val end = Random.nextInt(start, lorem.length)
        return lorem.substring(start, end)
    }

    /**
     * Generates a random coordinate, but only succeeds if the perlin noise at that point has a large enough value.
     * Returns null otherwise
     */
    private fun randomPoint(): Coordinates? {
        val randomX = Random.nextDouble(-180.0, 180.0)
        val randomY = Random.nextDouble(-80.0, 80.0)
        val noise = samplePerlinNoiseAt(randomX, randomY)
        if (noise > 0.38) {
            return Coordinates(randomX, randomY)
        }
        return null
    }

    /**
     * Generate a random timespan or no timespan.
     *
     * 50% prob. for timespan, distributed as:
     * - 25% prob. for timespan with start and end
     * - 25% prob. for timespan with either start or end, distributed as:
     *     - 12.5% prob for timespan with only start
     *     - 12.5% prob for timespan with only end
     */
    private fun randomTimespan(): Pair<LocalDate?, LocalDate?> {
        val hasTimespan = Random.nextBoolean()
        if (!hasTimespan) return null to null

        val minDate = LocalDate.ofYearDay(1990, 1).toEpochDay()
        val maxDate = LocalDate.ofYearDay(2040, 1).toEpochDay()

        // make later dates more likely
        val fromDate = max(Random.nextLong(minDate, maxDate), Random.nextLong(minDate, maxDate))
        val toDate = Random.nextLong(fromDate, maxDate)

        val hasBoth = Random.nextBoolean()
        return if (hasBoth) {
            LocalDate.ofEpochDay(fromDate) to LocalDate.ofEpochDay(toDate)
        } else if (Random.nextBoolean()) {
            LocalDate.ofEpochDay(fromDate) to null
        } else {
            null to LocalDate.ofEpochDay(toDate)
        }
    }

    private fun randomFoundingYear(): Int {
        return Random.nextInt(1990, 2024)
    }

    private fun randomMemberNumber(): Int {
        // bias towards more smaller orgas
        val sqrt = kotlin.math.sqrt(6.0) // max 10^6
        val magnitude = Random.nextDouble(0.0, sqrt) * Random.nextDouble(0.0, sqrt)
        // Make orgas with very very few members less likely
        val shift = max(Random.nextInt(0, 5), Random.nextInt(0, 5))
        return 10.0.pow(magnitude).toInt() + shift
    }

    private fun generateWebsiteUrl(orgId: Int, projectId: Int? = null): String {
        var url = "https://example.com/orga-homepage/${orgId}/"
        if (projectId != null) {
            url += "proj/${projectId}"
        }
        return url
    }

    private fun generateDonationUrl(orgId: Int, projectId: Int? = null): String = generateWebsiteUrl(orgId, projectId)


    /**
     * Sample perlin noise, simply take a 2d slice out of 3d noise
     */
    private fun samplePerlinNoiseAt(x: Double, y: Double, scale: Double = 0.1): Double {
        return Perlin.noise(x * scale, y * scale, 0.0)
    }


    data class Organization(
        val id: Int,
        val name: String,
        val description: String,
        val foundingYear: Int,
        val members: Int?,
        val websiteUrl: String?,
        val donationUrl: String?,

        val coordinates: Coordinates,
        val tags: Set<Int>
    )

    data class Project(
        val id: Int,
        val orgId: Int,
        val title: String,
        val description: String,

        val timeFrom: LocalDate?,
        val timeTo: LocalDate?,

        val websiteUrl: String?,
        val donationUrl: String?,

        val coordinates: Coordinates,
        val tags: Set<Int>
    )

    data class Region(val id: Int, val name: String, val description: String, val coordinates: Coordinates)

    data class Coordinates(val lon: Double, val lat: Double)
}

//https://rosettacode.org/wiki/Perlin_noise#Kotlin
object Perlin {

    private val permutation = intArrayOf(
        151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225,
        140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148,
        247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32,
        57, 177, 33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175,
        74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122,
        60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54,
        65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169,
        200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64,
        52, 217, 226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212,
        207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213,
        119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9,
        129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104,
        218, 246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241,
        81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157,
        184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205, 93,
        222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180
    )

    private val p = IntArray(512) {
        if (it < 256) permutation[it] else permutation[it - 256]
    }

    fun noise(x: Double, y: Double, z: Double): Double {
        // Find unit cube that contains point
        val xi = floor(x).toInt() and 255
        val yi = floor(y).toInt() and 255
        val zi = floor(z).toInt() and 255

        // Find relative x, y, z of point in cube
        val xx = x - floor(x)
        val yy = y - floor(y)
        val zz = z - floor(z)

        // Compute fade curves for each of xx, yy, zz
        val u = fade(xx)
        val v = fade(yy)
        val w = fade(zz)

        // Hash co-ordinates of the 8 cube corners
        // and add blended results from 8 corners of cube

        val a = p[xi] + yi
        val aa = p[a] + zi
        val ab = p[a + 1] + zi
        val b = p[xi + 1] + yi
        val ba = p[b] + zi
        val bb = p[b + 1] + zi

        return lerp(
            w, lerp(
                v, lerp(
                    u, grad(p[aa], xx, yy, zz),
                    grad(p[ba], xx - 1, yy, zz)
                ),
                lerp(
                    u, grad(p[ab], xx, yy - 1, zz),
                    grad(p[bb], xx - 1, yy - 1, zz)
                )
            ),
            lerp(
                v, lerp(
                    u, grad(p[aa + 1], xx, yy, zz - 1),
                    grad(p[ba + 1], xx - 1, yy, zz - 1)
                ),
                lerp(
                    u, grad(p[ab + 1], xx, yy - 1, zz - 1),
                    grad(p[bb + 1], xx - 1, yy - 1, zz - 1)
                )
            )
        )
    }

    private fun fade(t: Double) = t * t * t * (t * (t * 6 - 15) + 10)

    private fun lerp(t: Double, a: Double, b: Double) = a + t * (b - a)

    private fun grad(hash: Int, x: Double, y: Double, z: Double): Double {
        // Convert low 4 bits of hash code into 12 gradient directions
        val h = hash and 15
        val u = if (h < 8) x else y
        val v = if (h < 4) y else if (h == 12 || h == 14) x else z
        return (if ((h and 1) == 0) u else -u) +
                (if ((h and 2) == 0) v else -v)
    }
}

