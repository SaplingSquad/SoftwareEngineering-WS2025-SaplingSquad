import {component$} from "@builder.io/qwik";
import {LoginParamsForm} from "~/components/auth/login";

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
          <LoginParamsForm providerId={"keycloak-users"}>
            <button class={"btn btn-block"}>Nutzer Login</button>
          </LoginParamsForm>
          <LoginParamsForm providerId={"keycloak-orgs"}>
            <button class={"btn btn-block"}>Organisation Login</button>
          </LoginParamsForm>
        </div>
      </div>
    </div>
  );
});
