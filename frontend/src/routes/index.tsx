import { $, type Signal, component$, useOn, useSignal } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { HiFunnelMini, HiXMarkOutline } from "@qwikest/icons/heroicons";
import { hasVisited, setHasVisited } from "~/components/hasVisited";
import { IconLinkButton } from "~/components/link_button";
import { Map } from "~/views/map";
import { MapUI } from "~/components/map-ui/map-ui";
import { LoginAvatar } from "~/components/authenticate/authAvatarNav";
import {
  createEmptyFeatureCollection,
  type FeatureCollection,
} from "~/components/map-ui/types";

export default component$(() => {
  const organizationLocations: Signal<FeatureCollection> = useSignal(
    createEmptyFeatureCollection(),
  );
  const projectLocations: Signal<FeatureCollection> = useSignal(
    createEmptyFeatureCollection(),
  );

  const clickedPins = useSignal<{
    type: "Organization" | "Project";
    id: number;
  }>();

  // Check if user has visited (by key saved in local storage)
  // Every visit counts as visit
  // Don't show by default to prevent short flicker when user has already visited.
  const showWelcomeMessage = useSignal(false);
  useOn(
    "qvisible",
    $(() => {
      showWelcomeMessage.value = !hasVisited();
      setHasVisited(true);
    }),
  );

  return (
    <>
      <Map
        organizationLocations={organizationLocations}
        projectLocations={projectLocations}
        onOrganizationClick$={(id) =>
          (clickedPins.value = { type: "Organization", id: id })
        }
        onProjectClick$={(id) =>
          (clickedPins.value = { type: "Project", id: id })
        }
      />
      <MapUI
        organizationLocations={organizationLocations}
        projectLocations={projectLocations}
        externalClick={clickedPins}
      />
      {showWelcomeMessage.value && (
        <div class="fixed bottom-0 left-0 m-8 rounded bg-base-100 p-8 text-justify">
          <IconLinkButton
            target={$(() => (showWelcomeMessage.value = false))}
            class="absolute right-2 top-2"
            Icon={HiXMarkOutline}
          />
          <h1 class="font-bold">Hey!</h1>
          <p>Sieht so aus, als hättest du noch keine Schwerpunkte gesetzt.</p>
          <p>
            Schau doch mal im <HiFunnelMini class="mx-1 inline" /> Filter-Menü
            vorbei, um die Ergebnisse etwas einzuschränken.
          </p>
        </div>
      )}
      <div class="fixed right-4 top-4 rounded-full">
        <LoginAvatar />
      </div>
    </>
  );
});

export const head: DocumentHead = {
  title: "Sprout",
  meta: [
    {
      name: "description",
      content:
        "Sprout allows you to find projects and organizations to donate to",
    },
  ],
};
