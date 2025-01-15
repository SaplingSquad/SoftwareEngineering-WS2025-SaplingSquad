import type { Signal } from "@builder.io/qwik";
import { useComputed$ } from "@builder.io/qwik";
import type { RequestEventCommon } from "@builder.io/qwik-city";
import type { Session } from "@auth/qwik";
import { ORGS_PROVIDER_ID, USERS_PROVIDER_ID, useSession } from "~/routes/plugin@auth";

export type AccountType = "user" | "orga"

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

export function getSession(event: RequestEventCommon): Session | null {
  return event.sharedMap.get("session") as Session | null;
}

export function getAccountType(session: Session | null): AccountType | null {
  if (session === null) {
    return null;
  }
  if (session.providerId === USERS_PROVIDER_ID) {
    return "user";
  }
  if (session.providerId === ORGS_PROVIDER_ID) {
    return "orga";
  }
  throw Error(`Unknown providerId: ${session.providerId}`);
}

export function useAccountType(session: Readonly<Signal<Session | null>>) {
  return useComputed$(() => getAccountType(session.value));
}

export function isAccTypeUser(acctype: Signal<AccountType | null>): boolean {
  return acctype.value === "user"
}

export function isAccTypeOrg(acctype: Signal<AccountType | null>): boolean {
  return acctype.value === "orga"
}