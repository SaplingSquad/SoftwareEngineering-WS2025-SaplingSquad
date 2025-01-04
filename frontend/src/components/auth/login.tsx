import { component$, Slot, useComputed$ } from "@builder.io/qwik";
import { Form, useLocation } from "@builder.io/qwik-city";
import { useSignIn } from "~/routes/plugin@auth";

export type LoginParamsProps = { providerId: string };
export const LoginParamsForm = component$(
  ({ providerId }: LoginParamsProps) => {
    const signIn = useSignIn();
    const location = useLocation();
    const callbackUrl = useComputed$(() => {
      return (
        location.url.searchParams.get("callbackUrl") || location.url.origin
      );
    });
    return (
      <Form action={signIn}>
        <input type="hidden" name="providerId" value={providerId} />
        <input type="hidden" name="redirectTo" value={callbackUrl.value} />
        <Slot />
      </Form>
    );
  },
);

export type LoginOverviewParamsProps = { redirectTo: string };
export const LoginOverviewParamsForm = component$(
  ({ redirectTo }: LoginOverviewParamsProps) => {
    const signIn = useSignIn();
    return (
      <Form action={signIn}>
        <input type="hidden" name="redirectTo" value={redirectTo} />
        <Slot />
      </Form>
    );
  },
);
