import { component$, Slot, useComputed$ } from "@builder.io/qwik";
import { useSession, useSignIn, useSignOut } from "~/routes/plugin@auth";
import { Link } from "@builder.io/qwik-city";
import { LoginOverviewParamsForm } from "~/components/auth/login";
import { LogoutParamsForm } from "~/components/auth/logout";

export const AuthExampleLayout = component$(() => {
  return (
    <div class="flex min-h-lvh flex-col items-center bg-base-200">
      <div class="card card-body m-8 flex w-fit grow-0 bg-base-100 shadow-xl">
        <Slot />
      </div>
    </div>
  );
});

export default component$(() => {
  const signIn = useSignIn();
  const signOut = useSignOut();
  const session = useSession();
  const helloText = useComputed$(() => {
    const email = session.value?.user?.email;
    return email ? `Hallo ${email}` : "Nicht eingeloggt";
  });
  return (
    <AuthExampleLayout>
      <h1 class="text-xl">Beispiel für Authentifizierung</h1>
      <h2 class="text-lg">{helloText.value}</h2>
      <LoginOverviewParamsForm redirectTo={"/authexample"}>
        <button class={"btn w-full"}>Login</button>
      </LoginOverviewParamsForm>
      <LogoutParamsForm redirectTo={"/authexample"}>
        <button class={"btn w-full"}>Logout</button>
      </LogoutParamsForm>
      <Link class="link link-primary" href="subpath/">
        Woanders hin navigieren (SPA)
      </Link>
      <a class="link link-primary" href="subpath/">
        Woanders hin navigieren (full reload)
      </a>
    </AuthExampleLayout>
  );
});
