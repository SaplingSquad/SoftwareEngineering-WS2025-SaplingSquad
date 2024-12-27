import { component$, useComputed$ } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";

type LoginButtonProps = {
  text: string;
  providerId: string;
};
const LoginButton = component$(({ text, providerId }: LoginButtonProps) => {
  const location = useLocation();
  const callbackUrl = useComputed$(() => {
    return location.url.searchParams.get("callbackUrl") || location.url.origin;
  });
  return (
    // /auth/signin/{provider} is provided by auth.js library
    <form method={"POST"} action={`/auth/signin/${providerId}`}>
      <input type="hidden" name="crsfToken" />
      <input type="hidden" name="callbackUrl" value={callbackUrl.value} />
      <button class={"btn btn-block"}>{text}</button>
    </form>
  );
});

/**
 * Custom sign in page
 */
export default component$(() => {
  return (
    <div
      class={
        "flex min-h-dvh w-full flex-row items-center justify-center bg-base-200"
      }
    >
      <div class={"card w-full max-w-lg bg-base-100 shadow-xl"}>
        <div class={"card-body"}>
          <h1 class={"mb-4 text-center text-2xl"}>Bei Sprout Anmelden</h1>
          <LoginButton text={"Nutzer Login"} providerId={"keycloak-users"} />
          <LoginButton
            text={"Organisation Login"}
            providerId={"keycloak-orgs"}
          />
        </div>
      </div>
    </div>
  );
});
