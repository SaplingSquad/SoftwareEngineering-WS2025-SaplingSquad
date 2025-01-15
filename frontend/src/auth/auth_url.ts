import type {Session} from "@auth/qwik";
import {clientId} from "~/routes/plugin@auth";

/**
 * Hardcoded logout url for keycloak providers (may not work for other providers)
 * @param session
 * @param redirect_uri
 */
export function provider_logout_url({
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
