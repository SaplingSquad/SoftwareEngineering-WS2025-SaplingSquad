import { type Signal, component$ } from "@builder.io/qwik";
import { HiBookmarkOutline, HiClockOutline } from "@qwikest/icons/heroicons";
import AllIcon from "/src/images/All_Icon.svg?jsx";
import { Tab } from "./tab";

/**
 * The tablist allows to switch between showing all results, only the bookmarked results or only the recent results.
 */
export const Tablist = component$(
  (props: { selection: Signal<number>; useBtnStyle: boolean }) => {
    return (
      <div role="tablist" class={["flex", props.useBtnStyle ? "join" : "pb-2"]}>
        <Tab
          useBtnStyle={props.useBtnStyle}
          selection={props.selection}
          idx={0}
        >
          <AllIcon class="h-6" />
        </Tab>
        <Tab
          useBtnStyle={props.useBtnStyle}
          selection={props.selection}
          idx={1}
        >
          <HiBookmarkOutline class="stroke-inherit size-6" />
        </Tab>
        <Tab
          useBtnStyle={props.useBtnStyle}
          selection={props.selection}
          idx={2}
        >
          <HiClockOutline class="stroke-inherit size-6" />
        </Tab>
      </div>
    );
  },
);
