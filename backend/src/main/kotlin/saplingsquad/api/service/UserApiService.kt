package saplingsquad.api.service

import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service
import saplingsquad.api.UserApiDelegate
import saplingsquad.api.models.GetUserByToken200Response
import saplingsquad.api.models.User

@Service
class UserApiService() : UserApiDelegate {
    override suspend fun createUser(user: User?): ResponseEntity<Unit> {
        TODO("Not yet implemented")
    }

    override suspend fun loginUser(username: String, password: String?): ResponseEntity<String> {
        TODO("Not yet implemented")
    }

    override suspend fun getUserByToken(userToken: String): ResponseEntity<GetUserByToken200Response> {
        TODO("Not yet implemented")
    }

    override suspend fun updateUser(userToken: String, user: User?): ResponseEntity<Unit> {
        TODO("Not yet implemented")
    }

    override suspend fun deleteUser(userToken: String): ResponseEntity<Unit> {
        TODO("Not yet implemented")
    }
}
