import { type Signal, component$, useSignal } from "@builder.io/qwik";
import { Map } from "~/views/map";
import { MapUI } from "~/components/map-ui/map-ui";
import { HiFunnelOutline } from "@qwikest/icons/heroicons";
import {
  type FilterSettings,
  defaultFilterSettings,
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
      <FilterPane filterSettings={filterSettings} />
    </>
  );
});

const FilterPane = component$((props: { filterSettings: FilterSettings }) => {
  const filterActive = useSignal<boolean>(false);

  return (
    <>
      <button
        class="fixed bottom-6 right-6 rounded-full"
        onClick$={() => (filterActive.value = !filterActive.value)}
      >
        <HiFunnelOutline class="size-14 fill-primary stroke-2 hover:fill-secondary active:scale-95" />
      </button>
      <div
        class={[
          "fixed bottom-24 right-6",
          filterActive.value ? "" : "invisible",
        ]}
      >
        <Filter filterSettings={props.filterSettings} />
      </div>
    </>
  );
});
