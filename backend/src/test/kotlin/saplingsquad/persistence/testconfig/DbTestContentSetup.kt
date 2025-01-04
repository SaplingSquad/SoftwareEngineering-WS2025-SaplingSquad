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


fun setupDb(db: R2dbcDatabase) = runBlocking {
    ExampleQuestionsAndTags.setupQuestions(db)
}
