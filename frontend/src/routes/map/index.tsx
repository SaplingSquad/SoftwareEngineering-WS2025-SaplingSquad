import { component$, Signal, useSignal, useStore } from "@builder.io/qwik";
import { Map } from "~/views/map";
import { MapUI } from "~/components/map-ui/map-ui";

export default component$(() => {
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
        organizationLocations={organizationLocations}
        projectLocations={projectLocations}
      />
    </>
  );
});
