import { Session } from "@auth/qwik";
import {
  ClassList,
  component$,
  Signal,
  useVisibleTask$,
} from "@builder.io/qwik";
import { HiUserCircleOutline } from "@qwikest/icons/heroicons";
import { noSerialize, NoSerialize, QRL, useSignal } from "@builder.io/qwik";
import maplibregl from "maplibre-gl";
import { ClickHandlers, Images, Layers, Sources } from "../map";
import { isServer } from "@builder.io/qwik/build";
import { InputMarkerLocation } from "./types";
import { LoginOverviewParamsForm } from "../auth/login";

/**
 * Loads an Dummy image or the account image to the corresponding profile
 */
export const ProfileImage = component$(
  (inputData: {
    profiledata: Readonly<Signal<null>> | Readonly<Signal<Session>>;
    imgSize: ClassList;
  }) => {
    return inputData.profiledata.value?.user?.image ? (
      <img
        class={inputData.imgSize}
        src={inputData.profiledata.value?.user?.image}
      />
    ) : (
      <HiUserCircleOutline class={inputData.imgSize} />
    );
  },
);

/**
 * Card for prompting the user to log in again because of validation issues
 */
export const LoginAgainCard = component$(() => {
  return (
    <div class="flex justify-center p-32">
      <div class="card w-96 bg-base-100 shadow-xl">
        <div class="card-body items-center text-center">
          <h2 class="card-title">Bitte neu anmelden.</h2>
          <div class="card-actions">
            <LoginOverviewParamsForm redirectTo={"/profile"}>
              <button class="btn btn-primary">Hier einloggen!</button>
            </LoginOverviewParamsForm>
          </div>
        </div>
      </div>
    </div>
  );
});

/**
 * Creates the map for the signup and registration phase of a project and organization.
 * It only shows one pin for the current project or organization,
 * which can be dragged or clicked to position on the map.
 */
const createMap = (options: maplibregl.MapOptions) => {
  const map = new maplibregl.Map(options);
  return map;
};

export const MapLocationInput = component$(
  ({
    class: clz,
    style = "https://tiles.versatiles.org/assets/styles/colorful.json",
    location,
    drgbl = false,
  }: {
    /**
     * Classes to set
     */
    class?: ClassList;
    /**
     * The map style. Will default to versatiles colorful
     */
    style?: string;
    /**
     * Datasources to add to the map
     */
    sources?: Sources;
    /**
     * Layers to add to the map
     */
    layers$?: QRL<Layers>;
    /**
     * Images to load into the map
     */
    images?: Images;
    /**
     * Handlers for click events on the map
     */
    onClick?: ClickHandlers;
    location: InputMarkerLocation;
    drgbl?: boolean;
  }) => {
    const markSign = useSignal<NoSerialize<maplibregl.Marker>>();
    const containerRef = useSignal<HTMLElement>();

    useVisibleTask$(
      async () => {
        if (isServer) {
          return;
        }
        if (!containerRef.value) {
          console.warn("Map-container does not exist");
          return;
        }
        const createdMap = createMap({
          cooperativeGestures: true,
          container: containerRef.value,
          style: style,
        });
        markSign.value = noSerialize(
          new maplibregl.Marker({ draggable: drgbl })
            .setLngLat([location.lng, location.lat])
            .addTo(createdMap),
        );

        if (drgbl) {
          createdMap.on("click", (e) => {
            location.lat = e.lngLat.lat;
            location.lng = e.lngLat.lng;
            markSign.value?.setLngLat(e.lngLat);
          });
        }

        markSign.value?.on("dragend", () => {
          const lngLat = markSign.value?.getLngLat();
          if (lngLat?.lng) {
            location.lng = lngLat?.lng;
          }
          if (lngLat?.lat) {
            location.lat = lngLat?.lat;
          }
        });
      },
      { strategy: "document-ready" },
    );

    return (
      <>
        <div ref={containerRef} class={clz}>
          Loading map...
        </div>
      </>
    );
  },
);
