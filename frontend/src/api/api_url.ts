import { isServer } from "@builder.io/qwik/build";

/**
 * Gets the API base-url with the defined prefix (default `/api`).
 *
 * Handles both SSR and web-rendering:
 * Will be relative to site's origin on client,
 * and relative to `BACKEND` environment-variable on server.
 *
 * Note, however, that api-urls generated on the server may
 * not be valid in the client (depending on whether`BACKEND`
 * is set to a public or internal URL).
 *
 * @param prefix prefix of the API (default: `/api`)
 * @returns The base-url of the api
 */
export const apiBaseUrl = (prefix: string = "/api") =>
  new URL(prefix, isServer ? process.env.BACKEND : window.origin);

/**
 * Gets a full API-URL based on the passed path.
 *
 * Handles both SSR and web-rendering (see {@link apiBaseUrl})
 *
 * @param path the api-path to get
 * @param prefix path-prefix of the API (to overwrite `prefix` in {@link api_ase_url})
 * @returns The full API-URL of the passed `path`
 */
export const api = (path: `/${string}`, prefix?: string) =>
  new URL(path.substring(1), apiBaseUrl(prefix));
