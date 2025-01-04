# Backend

Make sure you are in the `backend/` folder to execute this commands.

## Starting the backend
The backend also needs access to a keycloak server for user authorization.
(See [../auth](./../auth) for a local development configuration.)

Linux:
```shell
./gradlew bootRun
```

Windows:
```shell
./gradlew.bat bootRun
```

## Code Generation
If the api changes the code generation is executed. You should clean the build
files to ensure the code generation is executed.

Linux:
```shell
./gradlew clean
```

Windows:
```shell
./gradlew.bat clean
```

## Combine

You can combine both commands on Linux.

Linux:
```shell
./gradlew clean && ./gradlew bootRun
```

## Development

The backend is written in [kotlin](https://kotlinlang.org/) it is recommended to
use IntelliJ for development.


### Trying out the API endpoints
Swagger UI for API Endpoints can be accessed on http://localhost:9000 by default

#### Authenticated routes
Authenticated routes can be accessed by setting an access token in Swagger UI.
An accesss token can be retrieved by first logging in on 
http://localhost:9000/login
and then accessing http://localhost:9000/showUserToken or http://localhost:9000/showOrgaToken

Logout on http://localhost:9000/logout
