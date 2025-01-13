package saplingsquad.api.service

import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service
import saplingsquad.api.TagsApiDelegate
import saplingsquad.api.models.GetTags200ResponseInner
import saplingsquad.persistence.QuestionsRepository
import saplingsquad.utils.asHttpOkResponse

@Service
class TagsApiService(private val questionsRepository: QuestionsRepository) : TagsApiDelegate {
    override fun getTags(): ResponseEntity<Flow<GetTags200ResponseInner>> {
        return questionsRepository.readAllTags().map {
            GetTags200ResponseInner(
                id = it.tagId,
                name = it.name
            )
        }.asHttpOkResponse()
    }
}