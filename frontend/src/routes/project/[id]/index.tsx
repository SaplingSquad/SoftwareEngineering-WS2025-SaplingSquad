import { component$ } from "@builder.io/qwik";
import { DocumentHead } from "@builder.io/qwik-city";
import { ProjectInfo } from "~/components/info/project";
import { InfoPage } from "~/views/info_page";

export default component$(() => {
  return <InfoPage InfoComponent={ProjectInfo} />;
});

export const head: DocumentHead = {
  title: "Sprout - Projekt",
};
