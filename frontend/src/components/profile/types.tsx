//Types aligned with the backend Api Response
export type ApiRelevantOrganisationInformations = {
  name: string;
  description: string;
  iconUrl: string;
  webPageUrl: string;
  coordinates: number[];
  tags: number[];
  foundingYear?: number | undefined;
  memberCount?: number | undefined;
  imageUrls?: string[] | undefined;
  donatePageUrl?: string | undefined;
  regionName: string;
};

export type ApiRelevantProjectInformations = {
  name: string;
  id: number;
  tags: number[];
  description: string;
  iconUrl: string;
  coordinates: number[];
  orgaId: number;
  imageUrls?: string[] | undefined;
  webPageUrl?: string | undefined;
  donatePageUrl?: string | undefined;
  dateFrom?: string | undefined;
  dateTo?: string | undefined;
  regionName: string;
};

//Frontend Profile Types
export type ProfileProjectsProps = {
  img: string;
  title: string;
  text: string;
};

export type InputMarkerLocation = {
  lng: number;
  lat: number;
};

export type ProjectDate = {
  mnth: string;
  year: string;
};

export type OrgaInformationsProps = {
  name: string;
  description: string;
  location: InputMarkerLocation;
  numbPers: string;
  founding: string;
  logoUrl: string;
  imageUrls: string[];
  webpageUrl: string;
  donatePageUrl: string;
  tags: number[];
  regionName: string;
};

export type ProjectInformationProps = {
  name: string;
  id: number;
  description: string;
  location: InputMarkerLocation;
  logoUrl: string;
  dateFrom: ProjectDate;
  dateTo: ProjectDate;
  imageUrls: string[];
  webpageUrl: string;
  donatePageUrl: string;
  tags: number[];
  regionName: string;
};
