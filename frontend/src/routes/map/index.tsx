import { component$, Signal, useSignal, useStore } from "@builder.io/qwik";
import { Map } from "~/views/map";
import {
  type FilterSettings,
  defaultFilterSettings,
} from "~/components/filter";
import { MapUI } from "~/components/map-ui/map-ui";

export default component$(() => {
  const filterSettings: FilterSettings = useStore(defaultFilterSettings());

  const organizationLocations: Signal<GeoJSON.GeoJSON> = useSignal({
    type: "FeatureCollection",
    features: [],
  });
  const projectLocations: Signal<GeoJSON.GeoJSON> = useSignal({
    type: "FeatureCollection",
    features: [],
  });

  return (
    <>
      <Map
        organizationLocations={organizationLocations}
        projectLocations={projectLocations}
      />
      <MapUI
        filterSettings={filterSettings}
        organizationLocations={organizationLocations}
        projectLocations={projectLocations}
      />
    </>
  );
});
