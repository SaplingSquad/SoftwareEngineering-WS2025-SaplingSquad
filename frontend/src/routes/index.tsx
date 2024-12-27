import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Map } from "~/views/map";

export default component$(() => {
  return <Map />;
});

export const head: DocumentHead = {
  title: "Sprout",
  meta: [
    {
      name: "description",
      content:
        "Sprout allows you to find projects and organizations to donate to",
    },
  ],
};
