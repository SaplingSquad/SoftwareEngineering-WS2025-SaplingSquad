package saplingsquad.api.service

import kotlinx.coroutines.flow.Flow
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service
import saplingsquad.api.TagsApiDelegate
import saplingsquad.api.models.GetTags200ResponseInner

@Service
class TagsApiService : TagsApiDelegate {
    override fun getTags(): ResponseEntity<Flow<GetTags200ResponseInner>> {
        TODO("Not yet implemented")
    }
}