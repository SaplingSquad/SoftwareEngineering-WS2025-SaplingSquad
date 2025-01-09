import type { Signal } from "@builder.io/qwik";
import { isSignal } from "@builder.io/qwik";
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

/**
 * Something that can be a signal or a direct value
 */
export type MaybeSignal<T> = Signal<T> | T;

/**
 * Tracks a {@link MaybeSignal} if it is a signal, or returns the value otherwise.
 *
 * @param track The `track`-function
 * @param s The {@link MaybeSignal}
 * @returns The value of the signal
 */
export const maybeTrack = <T>(
  track: (signal: Signal<T>) => T,
  s: MaybeSignal<T>,
) => (isSignal(s) ? track(s) : s);
