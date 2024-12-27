import type { GeoJSONSourceSpecification } from "maplibre-gl";

/**
 * Creates a GeoJson datasource from the passed `source`,
 * which clusters its contents.
 *
 * @param source the GeoJSON datasource
 * @param params The parameters for the clustering
 * @returns A clustering datasource based on the passed source
 */
export const clusteredGeoJSONDatasource = (
  source: GeoJSONSourceSpecification["data"],
  {
    clusterMaxZoom = 14,
    clusterRadius = 80,
  }: { clusterMaxZoom?: number; clusterRadius?: number } = {},
): GeoJSONSourceSpecification => ({
  type: "geojson",
  data: source,
  cluster: true,
  clusterMaxZoom: clusterMaxZoom,
  clusterRadius: clusterRadius,
});
