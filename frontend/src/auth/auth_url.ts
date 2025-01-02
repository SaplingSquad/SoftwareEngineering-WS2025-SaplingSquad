/**
 * Gets a full Keycloak-Server-URL based on the passed path.
 *
 * Relative to `PUBLIC_KEYCLOAK_HOST` environment-variable on server and client.
 * `PUBILC_KEYCLOAK_HOST` must be equal to the hostname of the issuer-uri of the keycloak realms.
 *
 * Important: Even though the prefix is set to /authkc/ by default, the dev-proxy is configured in a way,
 * that only /authkc/realms... (and some others) are proxied to the keycloak server. I.e. the path must start with /realms/
 *
 * @param path the path to get
 * @param prefix path-prefix of the API
 * @see vite.config.ts for the dev-proxy configuration
 * @returns The full Keycloak-Server-URL of the passed `path`
 */
export const keycloak_url = (path: `/${string}`, prefix: string = "/authkc/") =>
  new URL(
    path.substring(1),
    //Always
    new URL(prefix, import.meta.env.PUBLIC_KEYCLOAK_HOST),
  );
