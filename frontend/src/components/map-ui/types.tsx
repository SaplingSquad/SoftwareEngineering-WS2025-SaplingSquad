/**
 * Temporary collection of Types until the new API is merged.
 */

export type Organization = {
  id: number;
  name: string;
  description: string;
  foundingYear?: number;
  memberCount?: number;
  iconUrl: string;
  imageUrls?: string[];
  webPageUrl: string;
  donatePageUrl?: string;
  coordinates: number[];
  tags: number[];
  regionName: string;
  projectCount: number;
};

export type Project = {
  id: number;
  orgaId: number;
  name: string;
  description: string;
  dateFrom?: string;
  dateTo?: string;
  iconUrl: string;
  imageUrls?: string[];
  webPageUrl?: string;
  donatePageUrl?: string;
  coordinates: number[];
  tags: number[];
  regionName: string;
  orgaName: string;
};

export type SearchInput = {
  answers: number[] | undefined;
  maxMembers: number | undefined;
  searchText: string | undefined;
  continentId: string | undefined;
  regionId: string | undefined;
  type: "Project" | "Organization" | undefined;
};

export type Feature = {
  type: "Feature";
  properties: {
    id: number;
  };
  geometry: {
    type: "Point";
    coordinates: number[];
  };
};

export type FeatureCollection = {
  type: "FeatureCollection";
  features: Feature[];
};

export type RankingEntry =
  | {
      type: "Organization";
      content: Organization;
    }
  | {
      type: "Project";
      content: Project;
    };

export type Ranking = {
  entry: RankingEntry;
} & { percentageMatch: number };

export type SearchOutput = {
  rankings: Ranking[];
  organizationLocations?: FeatureCollection;
  projectLocations?: FeatureCollection;
};
