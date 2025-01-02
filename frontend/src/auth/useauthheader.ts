import { Signal, useComputed$ } from "@builder.io/qwik";
import { RequestEventCommon } from "@builder.io/qwik-city";
import { Session } from "@auth/qwik";

export function buildAuthHeader(session: Session | null) {
  console.log(session)
  if (session?.accessToken) {
    return { Authorization: `Bearer ${session.accessToken}` };
  } else {
    return undefined;
  }
}

export function useAuthHeader(session: Readonly<Signal<Session | null>>) {
  return useComputed$(() => buildAuthHeader(session.value));
}

export function getSession(event: RequestEventCommon): Session | null {
  return event.sharedMap.get("session") as Session | null;
}
