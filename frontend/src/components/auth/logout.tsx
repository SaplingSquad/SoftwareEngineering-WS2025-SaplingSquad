import { component$, Slot, useComputed$ } from "@builder.io/qwik";
import { useSession, useSignOut } from "~/routes/plugin@auth";
import { Form, useLocation } from "@builder.io/qwik-city";
import { provider_logout_url } from "~/auth/auth_url";

export type LogoutParamsProps = { redirectTo?: string };
export const LogoutParamsForm = component$(
  ({ redirectTo = "/" }: LogoutParamsProps) => {
    const signOut = useSignOut();
    const session = useSession();
    const location = useLocation();
    const realRedirectTo = useComputed$(() => {
      const redirectToWithOrigin = new URL(redirectTo, location.url);
      return provider_logout_url({
        session: session.value,
        redirect_uri: redirectToWithOrigin,
      });
    });
    return (
      <Form action={signOut}>
        <input
          type="hidden"
          name="redirectTo"
          value={realRedirectTo.value?.toString()}
        />
        <Slot />
      </Form>
    );
  },
);
