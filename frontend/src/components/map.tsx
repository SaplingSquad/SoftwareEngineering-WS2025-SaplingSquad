import type { ClassList, JSXOutput, NoSerialize, QRL } from "@builder.io/qwik";
import {
  $,
  component$,
  noSerialize,
  render,
  useOn,
  useSignal,
  useTask$,
} from "@builder.io/qwik";
import type {
  AddLayerObject,
  GeoJSONSource,
  GeoJSONSourceSpecification,
  MapLayerEventType,
} from "maplibre-gl";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { DistributiveOmit, MaybeArray } from "~/utils";
import { maybeArray } from "~/utils";

/**
 * Coordinates, as used in the API.
 */
export type Coordinates = [number, number];

/**
 * Type-guard for {@link Coordinates}.
 *
 * @param coords thing to check
 * @returns `true` if `coords` are valid {@link Coordinates}, `false` otherwise
 */
export const isCoordinates = (coords: any): coords is Coordinates =>
  Array.isArray(coords) &&
  coords.length === 2 &&
  coords.every((n) => typeof n === "number");

/**
 * Data sources of the map
 */
export type Sources = {
  [id: string]: GeoJSONSourceSpecification;
};

/**
 * Layers of the map
 */
export type Layers = (DistributiveOmit<AddLayerObject, "metadata"> & {
  metadata?: object;
})[];

/**
 * An image source for the map.
 * Either an already loaded source,
 * or an url in a string, where the image should be loaded from.
 */
export type ImageSource =
  | string
  | Parameters<InstanceType<typeof maplibregl.Map>["addImage"]>[1];

/**
 * Images to load for the map.
 * Each image has an id and can either be just an {@link ImageSource} or additionally specify some options.
 */
export type Images = {
  [id: string]:
    | ImageSource
    | [
        ImageSource,
        Parameters<InstanceType<typeof maplibregl.Map>["addImage"]>[2],
      ];
};

/**
 * A single click-handler
 */
export type ClickHandler = QRL<
  (
    event: MapLayerEventType["click"] & object,
  ) => void | Promise<void> | PromiseLike<void>
>;

/**
 * A map of click-handlers per target
 */
export type ClickHandlers = [MaybeArray<string>, MaybeArray<ClickHandler>][];

/**
 * Creates a maplibre Map, adding all additional properties on load.
 * @param options Options to create the map with
 * @param sources data sources for the map
 * @param layers layers for the map
 * @param images images for the map
 * @param clickHandlers handlers for clicks on layers
 * @param onInit$ custom initialization function; called after map is created
 * @returns a maplibre map with the passed options and additional properties
 */
const createMap = (
  options: maplibregl.MapOptions,
  sources: Sources,
  layers: Layers,
  images: Images,
  clickHandlers: ClickHandlers,
  onInit$?: QRL<(map: maplibregl.Map) => unknown>,
) => {
  const map = new maplibregl.Map(options);
  map.on("load", () => {
    Object.entries(images).forEach(([id, spec]) => {
      const [image, options] = Array.isArray(spec) ? spec : [spec, undefined];
      if (typeof image === "string") {
        map
          .loadImage(image)
          .then((image) => map.addImage(id, image.data, options));
      } else {
        map.addImage(id, image, options);
      }
    });
    Object.entries(sources).forEach(([id, source]) =>
      map.addSource(id, source),
    );
    layers.forEach((layer) => map.addLayer(layer));
    onInit$?.(map);
  });

  clickHandlers.forEach(([targets, handlers]) =>
    maybeArray(handlers).forEach((handler) =>
      map.on("click", maybeArray(targets), handler),
    ),
  );
  return map;
};

/**
 * Component to display a map using MapLibreGL.
 *
 * **NOTE:** Only updates to `sources` and `class` are propagated,
 * and the only values of a `source` that are updated are its `data`, `cluster`, and `clusterMaxZoom`.
 */
export const Map = component$(
  ({
    class: clz,
    style = "https://tiles.versatiles.org/assets/styles/colorful.json",
    sources = {},
    layers = [],
    images = {},
    onClick = [],
    onInit$,
    additionalConfig = {},
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
    layers?: Layers;
    /**
     * Images to load into the map
     */
    images?: Images;
    /**
     * Handlers for click events on the map
     */
    onClick?: ClickHandlers;
    /**
     * Custom initialization function; called after map is created
     */
    onInit$?: QRL<(map: maplibregl.Map) => unknown>;
    /**
     * Additional configuration for the map
     */
    additionalConfig?: Omit<maplibregl.MapOptions, "container" | "style"> &
      object;
  }) => {
    const map = useSignal<NoSerialize<maplibregl.Map>>();
    // Currently loaded sources by id
    const loadedSources = useSignal<string[]>([]);
    const containerRef = useSignal<HTMLElement>();

    useOn(
      "qvisible",
      $(async () => {
        if (!containerRef.value) {
          console.warn("Map-container does not exist");
          return;
        }
        map.value = noSerialize(
          createMap(
            {
              ...additionalConfig,
              container: containerRef.value,
              style: style,
            },
            sources,
            layers,
            images,
            onClick,
            onInit$,
          ),
        );
        loadedSources.value = Object.keys(sources);
      }),
    );

    // Handle updates to
    useTask$(({ track }) => {
      const src = track(() => sources);
      const m = map.value;
      if (!m?.loaded()) return;
      // Remove sources that don't exist anymore
      loadedSources.value
        .filter((id) => !(id in src))
        .forEach((id) => m.removeSource(id));
      // Update sources
      Object.entries(src).forEach(([id, source]) => {
        if (loadedSources.value.includes(id)) {
          // Update existing source
          (m.getSource(id) as GeoJSONSource)
            .setData(source.data)
            .setClusterOptions({
              cluster: source.cluster,
              clusterMaxZoom: source.clusterMaxZoom,
              // clusterRadius: source.clusterRadius // Updating this breaks clustering for some reason
            });
        } else {
          // Create new source
          m.addSource(id, source);
        }
      });
      loadedSources.value = Object.keys(sources);
    });

    return (
      <div ref={containerRef} class={clz}>
        Loading map...
      </div>
    );
  },
);

/**
 * Creates a non-interactive map with a marker at the specified coordinates.
 * Is zoomed to the marker.
 */
export const PreviewMap = component$(
  ({
    coordinates,
    color,
    class: clz,
  }: {
    /**
     * Coordinates to preview
     */
    coordinates: [number, number];
    /**
     * Color of the marker to display
     */
    color?: string;
    /**
     * Classes to set
     */
    class?: ClassList;
  }) => {
    return (
      <Map
        additionalConfig={{
          interactive: false,
          center: coordinates,
          zoom: 8,
          attributionControl: { compact: true },
        }}
        class={clz}
        onInit$={(map) =>
          new maplibregl.Marker({
            color: color,
          })
            .setLngLat(coordinates)
            .addTo(map)
        }
      />
    );
  },
);

/**
 * Creates a {@link maplibregl.Popup} with JSX contents.
 * Needs to be called on the client (mostly the case, as map is only loaded on client).
 *
 * @param contents The contents of the popup
 * @returns The created {@link maplibregl.Popup}
 */
export const jsxPopup = (contents: JSXOutput): maplibregl.Popup => {
  const node = document.createElement("div");
  render(node, contents);
  return new maplibregl.Popup().setDOMContent(node);
};
