package saplingsquad.persistence.testconfig

import kotlinx.coroutines.runBlocking
import org.komapper.core.dsl.Meta
import org.komapper.core.dsl.QueryDsl
import org.komapper.core.dsl.query.andThen
import org.komapper.r2dbc.R2dbcDatabase
import saplingsquad.persistence.tables.FilterTagEntity
import saplingsquad.persistence.tables.QuestionEntity
import saplingsquad.persistence.tables.filterTagEntity
import saplingsquad.persistence.tables.questionEntity


object ExampleQuestionsAndTags {
    val Q1 = QuestionEntity(
        questionId = 1,
        questionTitle = "Question 1",
        question = "Content 1",
        imageUrl = null,
        tagId = 1
    )
    val Q2 = QuestionEntity(
        questionId = 2,
        questionTitle = "Question 2",
        question = "Content 2",
        imageUrl = "test.png",
        tagId = 1
    )
    val Q3 = QuestionEntity(
        questionId = 3,
        questionTitle = "Question 3",
        question = "Content 3",
        imageUrl = null,
        tagId = 2
    )

    val questions = listOf(Q1, Q2, Q3)

    private fun tagsFromQuestions(list: List<QuestionEntity>): List<FilterTagEntity> {
        return list
            .map {
                it.tagId
            }
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


fun setupDb(db: R2dbcDatabase) = runBlocking {
    ExampleQuestionsAndTags.setupQuestions(db)
}
