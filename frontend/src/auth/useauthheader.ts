import { useComputed$ } from "@builder.io/qwik";
import type { Session } from "@auth/qwik";
import { useSession } from "~/routes/plugin@auth";
import { RequestEventCommon } from "@builder.io/qwik-city";

export type AccountType = "user" | "orga";

export function getSession(event: RequestEventCommon): Session | null {
  return event.sharedMap.get("session") as Session | null;
}

export function buildAuthHeader(session: Session | null) {
  if (session?.accessToken) {
    return { Authorization: `Bearer ${session.accessToken}` };
  } else {
    return undefined;
  }
}

/**
 * Get the headers used for authentication/authorization (if the user is logged in).
 *
 * @returns a dict containing the headers used for authentication/authorization if the user is logged in, or `undefined` otherwise
 */
export function useAuthHeader() {
  const session = useSession();
  return useComputed$(() => buildAuthHeader(session.value));
}
