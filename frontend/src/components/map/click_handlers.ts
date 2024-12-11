import type { GeoJSONSource, LngLat } from "maplibre-gl";
import type { Point } from "geojson";
import { jsxPopup, type ClickHandler, type ClickHandlers } from "../map";
import type { JSXOutput, QRL } from "@builder.io/qwik";
import { $ } from "@builder.io/qwik";
import { CLUSTERS, MARKERS } from "./clustered_pin_layers";

/**
 * Function to easily create all click handlers.
 *
 * Layers are expected to follow the names from `clustered_pin_layers`.
 *
 * @param config The config for which handlers to create and how to create them
 * @returns The {@link ClickHandlers} for the map
 */
export const clickHandlers = ({
  clusterZoom: useClusterZoom = [],
  info: infoComponents = {},
}: {
  clusterZoom?: string[];
  info?: {
    [source: string]: QRL<(props: { [id: string]: any }) => JSXOutput>;
  };
} = {}): ClickHandlers =>
  Object.fromEntries([
    ...useClusterZoom.map((source) => [CLUSTERS(source), clusterZoom(source)]),
    ...Object.entries(infoComponents).map(([source, component]) => [
      MARKERS(source),
      info(component),
    ]),
  ]);

/**
 * Zooms the map such that the cluster that was clicked on is split.
 *
 * @param source The datasource-name to work on. Assumes the naming from `clustered_pin_layers`.
 * @returns The {@link ClickHandler}
 */
export const clusterZoom: (source: string) => ClickHandler = (source) =>
  $(async (map, e) => {
    // Get rendered features at clicked location
    const features = map.queryRenderedFeatures(e.point, {
      layers: [CLUSTERS(source)],
    });

    if (features.length === 0) {
      console.warn("Clicked on feature that was not rendered on layer");
      return;
    }

    // The cluster that was clicked on
    const clusterId = features[0].properties.cluster_id;

    // Zoom-lever to split cluster
    const zoom = await (
      map.getSource(source) as GeoJSONSource
    ).getClusterExpansionZoom(clusterId);

    // Zoom to cluster
    map.easeTo({
      center: (features[0].geometry as Point).coordinates as [number, number],
      zoom,
    });
  });

/**
 * Shows an info-popup when a single marker is clicked.
 *
 * @param component The component to render inside the popup
 * @returns The {@link ClickHandler}
 */
const info = (
  component: QRL<(props: { [id: string]: any }) => JSXOutput>,
): ClickHandler =>
  $(async (map, e) => {
    const feature = e.features?.[0];
    if (!feature) {
      console.warn("Clicked on nothing");
      return;
    }

    const jsxOutput = component(feature.properties);

    if (feature.geometry.type !== "Point") {
      console.warn(`Did not click on a point but on a ${e.type}`);
      return;
    }

    // Get clicked coordinates
    const coordinates = clickedCoordinates(
      feature.geometry.coordinates as [number, number],
      e.lngLat,
    );

    jsxPopup(await jsxOutput)
      .setLngLat(coordinates)
      .addTo(map);
  });

/**
 * Get the clicked coordinates of a feature
 * (when multiple copies exist on screen due to zoom level and wrapping)
 *
 * @param featureCoordinates The coordinates of the feature
 * @param clicked The position that was clicked at
 * @returns The coordinates of the feature-copy that was clicked at
 */
export const clickedCoordinates = (
  featureCoordinates: [number, number],
  clicked: LngLat,
): [number, number] => {
  const coordinates = featureCoordinates.slice() as [number, number];
  while (clicked.lng - coordinates[0] > 180) coordinates[0] += 360;
  while (clicked.lng - coordinates[0] < -180) coordinates[0] -= 360;
  return coordinates;
};
