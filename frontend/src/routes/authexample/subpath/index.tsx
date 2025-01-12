import {
  component$,
  Resource,
  useComputed$,
  useResource$,
} from "@builder.io/qwik";
import { useSession } from "~/routes/plugin@auth";
import { Link, routeLoader$ } from "@builder.io/qwik-city";
import { AuthExampleLayout } from "~/routes/authexample";
import {
  buildAuthHeader,
  getSession,
  useAuthHeader,
} from "~/auth/useauthheader";
import { api } from "~/api/api_url";

export const useQuestionFilter = routeLoader$(async (req) => {
  const session = getSession(req);
  const authHeader = buildAuthHeader(session)!;

  const response = await fetch(api("/questions/filter"), {
    headers: authHeader,
  }).catch((e) => {
    console.error(e);
    return undefined;
  });
  if (response?.ok) {
    return response.text();
  } else {
    return "Error";
  }
});

export default component$(() => {
  const session = useSession();
  const authHeader = useAuthHeader();
  const helloText = useComputed$(() => {
    const email = session.value?.user?.email;
    return email ? `Hallo ${email}` : "Nicht eingeloggt";
  });
  // Variant 1 (request sent from browser or Qwik server to api server, depending on SPA navigation, !!doesn't refresh access token atm!!)
  const questionFilter = useResource$(async () => {
    const response = await fetch(api("/questions/filter"), {
      headers: authHeader.value,
    }).catch((e) => {
      console.error(e);
      return undefined;
    });
    return await response?.text();
  });
  // Variant 2 (request sent to Qwik server and from there to API server does refresh access token due to config in plugin@auth.ts)
  const questionFilter2 = useQuestionFilter();
  return (
    <AuthExampleLayout>
      <h1 class="text-xl">Andere Seite</h1>
      <h2 class="text-lg">{helloText.value}</h2>
      <Resource
        value={questionFilter}
        onResolved={(filter) => {
          return <div>{filter}</div>;
        }}
      ></Resource>
      <div>{questionFilter2.value}</div>
      <Link class="link link-primary" href="/authexample/">
        Zurück navigieren (SPA)
      </Link>
      <a class="link link-primary" href="/authexample/">
        Zurück navigieren (full reload)
      </a>
    </AuthExampleLayout>
  );
});
