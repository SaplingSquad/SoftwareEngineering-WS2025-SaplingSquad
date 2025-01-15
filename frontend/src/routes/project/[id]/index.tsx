import { component$ } from "@builder.io/qwik";
import { ProjectInfo } from "~/components/info/project";
import { InfoPage } from "~/views/info_page";

export default component$(() => {
  return <InfoPage InfoComponent={ProjectInfo} />;
});
