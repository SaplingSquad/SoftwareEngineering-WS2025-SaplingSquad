# Sprout

Sprout is an application designed to connect people with charitable
organizations. It aims to help potential donors find organizations that align
with their values while providing these organizations with an accessible
platform to showcase themselves.

## Deployment

The current state of `main` can be seen [here](https://oxygen.floeze.tv/).

## Setup

There are multiple steps required to start the application locally. The commands
assume you start every command from the root of this project (w.r.t. `cd`) and
are on a linux bash.

Please ensure you have `docker` and `npm` installed before you start.

### 1. Start Keycloak
```shell
cd auth/ && docker compose up -d
```
See [auth/README](./auth/README.md) for a more detailed description of Keycloak
Docker container setup and tear down.

### 2. Start the Database

```shell
cd database/ && docker compose up -d
```
See [database/README](./database/README.md) on how to start the development
database using Docker.

### 3. Start the frontend dev server
```shell
cd frontend/ && npx auth secret && npm ci && npm run dev
```
Note: This cmd locks the terminal. You will need a second one to start the
backend.

See ([frontend/](./frontend)) for further informations.

If the backend server (in step 4) has issues starting, it might help to start with
```shell
npm run dev -- --host
```
instead.
After the backend has started, it should be possible to restart the frontend dev
server, even while the backend is still running.

### 4. Start the backend server

```shell
cd backend/ && ./gradlew bootRun --args="--appconfig.oauth2.users-issuer.issuer-uri=http://localhost:5173/authkc/realms/sprout-users --appconfig.oauth2.orgas-issuer.issuer-uri=http://localhost:5173/authkc/realms/sprout-orgs"
```
See ([backend/README](./backend/README.md)) for further informations and trouble
shooting.

## Team SaplingSquad

The project was created as part of a university project for the graduate
Software Engineering degree program at the University Augsburg, LMU, and TUM.

### Authors

- Hannah Coenen
- Maximilian Mitterrutzner
- Fabian Nowak
- Nico Petzendorfer
- Robin Sögtrop
