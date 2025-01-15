import { $, component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { useProjectBookmark } from "~/api/bookmarks";
import { ProjectInfo } from "~/components/info/project";
import { InfoPage } from "~/views/info_page";

export default component$(() => {
  return (
    <InfoPage
      InfoComponent={ProjectInfo}
      bookmarkHook$={$(useProjectBookmark)}
    />
  );
});

export const head: DocumentHead = {
  title: "Sprout - Projekt",
};
