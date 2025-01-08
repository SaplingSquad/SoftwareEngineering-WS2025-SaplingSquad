import { initClient } from "@ts-rest/core";
import { contract } from "./api_client.gen";
import { apiBaseUrl } from "./api_url";

/**
 * The base client.
 *
 * When authentication is needed,
 * the request-functions should be passed
 * the headers from `useAuthHeader`.
 */
export const client = initClient(contract, {
  baseUrl: apiBaseUrl().href,
  validateResponse: true,
  throwOnUnknownStatus: true,
});
