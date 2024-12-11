import type { ClassList, NoSerialize, QRL } from "@builder.io/qwik";
import {
  $,
  component$,
  noSerialize,
  useSignal,
  useVisibleTask$,
} from "@builder.io/qwik";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

/**
 * Data sources of the map
 */
export type Sources = {
  [id: string]: Parameters<InstanceType<typeof maplibregl.Map>["addSource"]>[1];
};

/**
 * Layers of the map
 */
export type Layers = Parameters<
  InstanceType<typeof maplibregl.Map>["addLayer"]
>[0][];

/**
 * Creates a maplibre Map, adding all additional properties on load.
 * @param options Options to create the map with
 * @param sources data sources for the map
 * @param layers layers for the map
 * @returns a maplibre map with the passed options and additional properties
 */
const createMap = (
  options: maplibregl.MapOptions,
  sources: Sources,
  layers: Layers,
) => {
  const map = new maplibregl.Map(options);
  map.on("load", () => {
    Object.entries(sources).forEach(([id, source]) =>
      map.addSource(id, source),
    );
    layers.forEach((layer) => map.addLayer(layer));
  });
  return map;
};

/**
 * Component to display a map using MapLibreGL.
 */
export const Map = component$(
  ({
    class: clz,
    style = "https://tiles.versatiles.org/assets/styles/colorful.json",
    sources = {},
    layers$ = $([]),
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
  }) => {
    const map = useSignal<NoSerialize<maplibregl.Map>>();
    const containerRef = useSignal<HTMLElement>();

    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(async () => {
      if (!containerRef.value) {
        console.warn("Map-container does not exist");
        return;
      }
      map.value = noSerialize(
        createMap(
          {
            container: containerRef.value,
            style: style,
          },
          sources,
          await layers$.resolve(),
        ),
      );
    });

    return (
      <div ref={containerRef} class={clz}>
        Loading map...
      </div>
    );
  },
);
