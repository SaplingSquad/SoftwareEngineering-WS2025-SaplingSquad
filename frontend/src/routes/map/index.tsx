import { component$, useSignal, useStore } from "@builder.io/qwik";
import { Map } from "~/views/map";
import { HiFunnelOutline } from "@qwikest/icons/heroicons";
import {
  type FilterSettings,
  defaultFilterSettings,
  Filter,
} from "~/components/filter";

export default component$(() => {
  const filterSettings: FilterSettings = useStore(defaultFilterSettings());

  return (
    <>
      <Map />
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
