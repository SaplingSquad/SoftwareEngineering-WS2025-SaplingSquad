import { component$ } from "@builder.io/qwik";
import { LogoutParamsForm } from "~/components/auth/logout";

/**
 * Custom sign out page
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
          <h1 class={"mb-4 text-center text-2xl"}>Ausloggen</h1>
          <p>Sicher, dass du dich abmelden möchtest?</p>
          <LogoutParamsForm>
            <button class={"btn btn-block"}>Ausloggen</button>
          </LogoutParamsForm>
        </div>
      </div>
    </div>
  );
});
