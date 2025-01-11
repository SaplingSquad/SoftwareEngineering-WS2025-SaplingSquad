import type { ClassList, JSXOutput, NoSerialize, QRL } from "@builder.io/qwik";
import {
  $,
  component$,
  noSerialize,
  render,
  useOn,
  useSignal,
} from "@builder.io/qwik";
import type { MapLayerEventType } from "maplibre-gl";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { MaybeArray } from "~/utils";
import { maybeArray } from "~/utils";

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
 * @returns a maplibre map with the passed options and additional properties
 */
const createMap = (
  options: maplibregl.MapOptions,
  sources: Sources,
  layers: Layers,
  images: Images,
  clickHandlers: ClickHandlers,
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
 */
export const Map = component$(
  ({
    class: clz,
    style = "https://tiles.versatiles.org/assets/styles/colorful.json",
    sources = {},
    layers$ = $([]),
    images = {},
    onClick = [],
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
  }) => {
    const map = useSignal<NoSerialize<maplibregl.Map>>();
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
              container: containerRef.value,
              style: style,
            },
            sources,
            await layers$.resolve(),
            images,
            onClick,
          ),
        );
      }),
    );

    return (
      <div ref={containerRef} class={clz}>
        Loading map...
      </div>
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
