import {Session} from "@auth/qwik";
import {clientId} from "~/routes/plugin@auth";

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

export function keycloak_logout_url({
  session,
  redirect_uri,
}: {
  session: Session | null;
  redirect_uri?: string | URL;
}) {
  if (!session?.realm) {
    return undefined;
  }
  const url = new URL(`${session.realm}/protocol/openid-connect/logout`);
  url.searchParams.set("client_id", clientId);
  if (redirect_uri) {
    url.searchParams.set("post_logout_redirect_uri", redirect_uri.toString());
  }
  return url;
}
