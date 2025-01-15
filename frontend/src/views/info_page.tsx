import type { Component } from "@builder.io/qwik";
import { component$ } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import { HiExclamationCircleOutline } from "@qwikest/icons/heroicons";

/**
 * A component that displays the `InfoComponent` on a fullscreen-page.
 * It takes the `id` from the path-params (it assumes that this id exists)
 * and passes it to the `load`-prop of the `InfoComponent`.
 */
export const InfoPage = component$(
  ({ InfoComponent }: { InfoComponent: Component<{ load: number }> }) => {
    const location = useLocation();
    const id = Number(location.params.id);
    const validId = !isNaN(id) && Number.isInteger(id);
    return (
      <div class="flex min-h-full w-full items-start justify-center overflow-y-auto p-2 sm:p-4 md:p-8 xl:px-32 2xl:px-48">
        {validId ? (
          <InfoComponent load={id} />
        ) : (
          <div
            role="alert"
            class="alert alert-error max-h-max min-h-min min-w-min max-w-max overflow-hidden"
          >
            <HiExclamationCircleOutline class="h-10 w-10" />
            <span class="max-h-full min-h-min min-w-min max-w-full overflow-y-auto ">
              <h5 class="text-lg font-semibold">Unzulässiges ID-Format.</h5>
              <div class="mb-2 flex flex-row items-baseline">
                "<pre>{location.params.id}</pre>" ist kein valider
                Identifikator.
              </div>
            </span>
          </div>
        )}
      </div>
    );
  },
);
