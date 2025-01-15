import { component$ } from "@builder.io/qwik";
import { OrganizationInfo } from "~/components/info/organization";
import { InfoPage } from "~/views/info_page";

export default component$(() => {
  return <InfoPage InfoComponent={OrganizationInfo} />;
});
