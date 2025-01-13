/**
 * Temporary collection of Types until the new API is merged.
 */

export type Organization = {
  id: number;
  name: string;
  description: string;
  foundingYear: number;
  memberCount: number;
  iconUrl: string;
  imageUrls: string[];
  webPageUrl: string;
  donatePageUrl: string;
  coordinates: [number, number];
  tags: number[];
  regionName: string;
  numProjects: number;
};

export type Project = {
  id: number;
  orgaId: number;
  name: string;
  description: string;
  dateFrom: string;
  dateTo: string;
  iconUrl: string;
  imageUrls: string[];
  webPageUrl: string;
  donatePageUrl: string;
  coordinates: [number, number];
  tags: number[];
  regionName: string;
  orgaName: string;
};

export type SearchInput = {
  answers?: number[];
  maxMembers?: number;
  searchText?: string;
  continent?: string;
  regionId?: string;
  type?: "Project" | "Organization";
};

export type FeatureCollection = {
  type: "FeatureCollection";
  features: {
    type: "Feature";
    properties: {
      id: number;
    };
    geometry: {
      type: "Point";
      coordinates: [number, number];
    };
  }[];
};

export type Ranking = (
  | {
      type: "Organization";
      content: Organization;
    }
  | {
      type: "Project";
      content: Project;
    }
) & { percentageMatch: number };

export type SearchOutput = {
  rankings: Ranking[];
  organizationLocations?: FeatureCollection;
  projectLocations?: FeatureCollection;
};
