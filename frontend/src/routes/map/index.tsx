import { type Signal, component$, useSignal } from "@builder.io/qwik";
import { Map } from "~/views/map";
import { MapUI } from "~/components/map-ui/map-ui";
import { HiFunnelOutline } from "@qwikest/icons/heroicons";
import {
  type FilterSettings,
  Filter,
} from "~/components/filter";
import { LoginAvatar } from "~/components/authenticate/authAvatarNav";

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
      <div class="fixed top-6 right-6 rounded-full">
        <LoginAvatar />
      </div>
    </>
  );
});

