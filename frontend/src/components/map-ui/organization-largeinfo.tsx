import { type QRL, component$ } from "@builder.io/qwik";
import { HiXMarkOutline } from "@qwikest/icons/heroicons";
import type { Organization } from "./types";

export const OrganizationLargeInfo = component$(
  (props: { org: Organization; onClose: QRL<() => void> }) => {
    return (
      <div class="card h-full w-[600px] bg-base-100 p-4 pt-6">
        <div class="space-y-4">
          <h1 class="text-center text-3xl font-bold">{props.org.name}</h1>
          <p>{props.org.description}</p>
          <div>
            <img
              src={props.org.iconUrl}
              alt="Logo des Vereins"
              class="size-16"
              height={256}
              width={256}
            />
            New Roots
          </div>
          {props.org.tags}
        </div>
        <div class="fixed right-6 top-6">
          <HiXMarkOutline
            class="size-10 hover:stroke-error"
            onClick$={props.onClose}
          />
        </div>
      </div>
    );
  },
);
