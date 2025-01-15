# Keycloak Development Instance

Here, you can find a Docker compose file for a basic keycloak configuration.

The container can be started and stopped by executing the following *from this directory ([auth](.))*:

Start:
```shell
docker compose up
```

Stop (and remove) the container (this does not remove the associated volume):
```shell
docker compose down
```

Depending on which frontend/backend configuration you want to run, some lines in the environment section of
[compose.yml](./compose.yml) need to be commented/uncommented manually.
These sections Start with comments `# Use the following to ...`

When making changes to the `compose.yml` file, make sure to stop (and remove) the containers first using 
`docker compose down` and start them afterwards.

## 1. Full application (Backend + Frontend)

When using the API backend together with the frontend, Vite acts as a reverse proxy.

- Requests on http://localhost:5173/authkc are rerouted to localhost:5555 (Keycloak)
- Requests on http://localhost:5173/api are rerouted to localhost:9000 (Backend)

Thus, Keycloak must be configured such that its host is set to localhost:5173, and it reads the Forwarded HTTP headers.
`KC_HOSTNAME_ADMIN` can be left as `localhost:5555`.

This is also the default configuration as found in this repository. The environment section of `compose.yml` should
look like this.

```yaml
...
# Use the following to run Keycloak proxied by vite through the frontend
KC_HOSTNAME: http://localhost:5173/authkc
KC_PROXY_HEADERS: xforwarded
KC_HTTP_ENABLED": true

# Use the following to run Keycloak not proxied
# KC_HOSTNAME: http://localhost:5555/authkc
...
```

## 2. Keycloak only with the Backend

To develop and experiment with the backend code by itself, without running the frontend, keycloak should use
`localhost:5555` as its hostname.
For this, change the comments in the `compose.yml` as follows (compare with
to [section 1](#1-full-application-backend--frontend)) :

```yaml
...
# Use the following to run Keycloak proxied by vite through the frontend
# KC_HOSTNAME: http://localhost:5173/authkc
# KC_PROXY_HEADERS: xforwarded
# KC_HTTP_ENABLED": true

# Use the following to run Keycloak not proxied
KC_HOSTNAME: http://localhost:5555/authkc
...
```

