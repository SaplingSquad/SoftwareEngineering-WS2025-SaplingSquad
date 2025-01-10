import { component$, useStore } from "@builder.io/qwik";
import { Map } from "~/views/map";
import {
  type FilterSettings,
  defaultFilterSettings,
} from "~/components/filter";
import { MapUI } from "~/components/map-ui/map-ui";

export default component$(() => {
  const filterSettings: FilterSettings = useStore(defaultFilterSettings());

  return (
    <>
      <Map />
      <MapUI filterSettings={filterSettings} />
    </>
  );
});
