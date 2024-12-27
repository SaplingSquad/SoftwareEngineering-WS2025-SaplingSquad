import {isServer} from "@builder.io/qwik/build";

/**
 * Gets a full Keycloak-Server-URL based on the passed path.
 *
 * Handles both SSR and web-rendering:
 * Will be relative to site's origin on client,
 * and relative to `KEYCLOAK_URL` environment-variable on server.
 *
 * Note, however, that urls generated on the server will
 * (in general) not be valid in the client.
 *
 * Important: Even though the prefix is set to /auth/ by default, the dev-proxy is configured in a way,
 * that only /auth/realms/... are proxied to the keycloak server. I.e. the path must start with /realms/
 *
 * @param path the path to get
 * @param prefix path-prefix of the API
 * @returns The full Keycloak-Server-URL of the passed `path`
 */
export const keycloak_url = (path: `/${string}`, prefix: string = "/auth/") =>
  new URL(
    path.substring(1),
    new URL(prefix, isServer ? process.env.KEYCLOAK_HOST : window.origin),
  );
