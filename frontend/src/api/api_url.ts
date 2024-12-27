import { isServer } from "@builder.io/qwik/build";

/**
 * Gets a full API-URL based on the passed path.
 *
 * Handles both SSR and web-rendering:
 * Will be relative to site's origin on client,
 * and relative to `BACKEND` environment-variable on server.
 *
 * Note, however, that api-urls generated on the server will
 * (in general) not be valid in the client.
 *
 * @param path the api-path to get
 * @param prefix path-prefix of the API
 * @returns The full API-URL of the passed `path`
 */
export const api = (path: `/${string}`, prefix: string = "/api/") =>
  new URL(
    path.substring(1),
    new URL(prefix, isServer ? process.env.BACKEND : window.origin),
  );
