import { maybeArray, type MaybeArray } from "~/utils";
import type { Layers } from "../map";

/**
 * Options for creating a clustered pin layer
 */
export type ClusteredPinLayerOptions = {
  /**
   * The icon-id for the pins
   */
  markerIcon: string;
  /**
   * The icon-id for the clusters
   */
  clusterIcon: string;
  /**
   * The font(s) for the cluster-size text
   */
  clusterFont: MaybeArray<string>;
};

/**
 * Creates a clustered pin layer.
 * Requires `source` to be a clustered datasource.
 * Renders clusters and individual markers as the passed icons.
 *
 * @param source
 * @param param1
 * @returns
 */
export const clusteredPinLayer = (
  source: string,
  { clusterFont, markerIcon, clusterIcon }: ClusteredPinLayerOptions,
): Layers => [
  {
    // The clusters
    id: CLUSTERS(source),
    source: source,
    filter: ["has", "point_count"],
    type: "symbol",
    layout: {
      "icon-image": clusterIcon,
      //"icon-text-fit": "both",

      //"text-field": "{point_count_abbreviated}",
      //"text-font": maybeArray(clusterFont),
      //"text-size": 20,

      "icon-allow-overlap": true,
      "text-allow-overlap": true,
      "icon-ignore-placement": true,
      "text-ignore-placement": true,
    },
  },
  {
    // The single markers
    id: MARKERS(source),
    source: source,
    filter: ["!", ["has", "point_count"]],
    type: "symbol",
    paint: {
      "text-opacity": 0,
    },
    layout: {
      "icon-image": markerIcon,
      "icon-anchor": "bottom",
      "icon-text-fit": "both",

      "text-field": ".....", // Automatic size based on text-size: Set size to invisible 'm'
      "text-font": maybeArray(clusterFont),
      "text-size": 20,

      "icon-allow-overlap": true,
      "text-allow-overlap": true,
      "icon-ignore-placement": true,
      "text-ignore-placement": true,
    },
  },
];

/**
 * Name for the marker-layer
 * @param source Datasource of the layer
 * @returns The name of the marker-layer for the passed source
 */
export const MARKERS = (source: string) => `markers-${source}`;
/**
 * Name for the cluster-layer
 * @param source Datasource of the layer
 * @returns The name of the cluster-layer for the passed source
 */
export const CLUSTERS = (source: string) => `clusters-${source}`;
