import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { OrganizationInfo } from "~/components/info/organization";
import { InfoPage } from "~/views/info_page";

export default component$(() => {
  return <InfoPage InfoComponent={OrganizationInfo} />;
});

export const head: DocumentHead = {
  title: "Sprout - Organisation",
};
