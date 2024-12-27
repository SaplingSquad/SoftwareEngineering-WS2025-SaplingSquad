import { component$, useComputed$ } from "@builder.io/qwik";
import { useSession } from "~/routes/plugin@auth";
import { Link } from "@builder.io/qwik-city";
import { AuthExampleLayout } from "~/routes/authexample";

export default component$(() => {
  const session = useSession();
  const helloText = useComputed$(() => {
    const email = session.value?.user?.email;
    return email ? `Hallo ${email}` : "Nicht eingeloggt";
  });
  return (
    <AuthExampleLayout>
      <h1 class="text-xl">Andere Seite</h1>
      <h2 class="text-lg">{helloText.value}</h2>
      <Link class="link link-primary" href="/authexample/">Zurück navigieren (SPA)</Link>
      <a class="link link-primary" href="/authexample/">Zurück navigieren (full reload)</a>
    </AuthExampleLayout>
  );
});
