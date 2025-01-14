# Backend

## To run the backend together with the frontend

1. Start the Database
2. Start the Keycloak server
3. Start the Frontend dev server
4. Start the Backend Server with correct arguments

### 1.Start the Database
See [../database](./../database) on how to start the development database using Docker.

### 2. Start Keycloak
See [../auth](./../auth) for a local development Keycloak Docker container.

### 3. Start the frontend dev server
The frontend server (in [../frontend](./../frontend)) can be started with
```shell
npm run dev
```
If the backend server (in step 4) has issues starting, it might help to start with
```shell
npm run dev -- --host
```
instead.
After the backend has started, it should be possible to restart the frontend dev server, even while the backend is still 
running.

### 4. Start the backend server with correct arguments
By default, the backend expects the Keycloak to run (as well as the issuer-uri of the OIDC tokens) to be on 
`localhost:5555`. When running together with frontend however, due to the reverse proxying mentioned in 
[../auth/README.md](./../auth/README.md), Keycloak expects to be accessed via the localhost:5173 origin.
Thus, the backend has to be configured accordingly.

When running the *compiled jar file* (`java -jar`), it should suffice to set two environment variables accordingly before launching:
```
AUTH_ISSUER_USERS=http://localhost:5173/authkc/realms/sprout-users
AUTH_ISSUER_ORGS=http://localhost:5173/authkc/realms/sprout-orgs
```

**However**, when starting using Gradle (`./gradlew bootRun`), Gradle does not appear to respect or pass environment 
variables to the application. To work around this, an additional parameter can be passed to the Gradle task:
```shell
./gradlew bootRun --args="--appconfig.oauth2.users-issuer.issuer-uri=http://localhost:5173/authkc/realms/sprout-users --appconfig.oauth2.orgas-issuer.issuer-uri=http://localhost:5173/authkc/realms/sprout-orgs"
```

## Backend only

Make sure you are in the `backend/` folder to execute this commands.

### Starting the backend
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

### Code Generation
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

### Combine

You can combine both commands on Linux.

Linux:
```shell
./gradlew clean && ./gradlew bootRun
```

### Development

The backend is written in [kotlin](https://kotlinlang.org/) it is recommended to
use IntelliJ for development.


### Trying out the API endpoints
Swagger UI for API Endpoints can be accessed on http://localhost:9000 by default

### Authenticated routes
Authenticated routes can be accessed by setting an access token in Swagger UI.
An accesss token can be retrieved by first logging in on 
http://localhost:9000/login
and then accessing http://localhost:9000/showUserToken or http://localhost:9000/showOrgaToken

Logout on http://localhost:9000/logout
