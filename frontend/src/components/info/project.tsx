import { $, component$ } from "@builder.io/qwik";
import {
  HiBanknotesOutline,
  HiBuildingLibraryOutline,
  HiCalendarOutline,
  HiGlobeAltOutline,
  HiMapPinSolid,
} from "@qwikest/icons/heroicons";
import type { MaybeSignal } from "~/api/api";
import { useGetProjectById } from "~/api/api_hooks.gen";
import { ApiRequest } from "../api";
import type { ApiCoordinates, Coordinates } from "../map";
import { ActionButton, InfoCard } from "./info_card";

/**
 * Short project type (as included in organization).
 *
 * See API-documentation for documentation of parameters.
 */
export type ShortProject = {
  id: number;
  description: string;
  coordinates: Coordinates;
  name: string;
  tags: number[];
  orgaId: number;
  donatePageUrl?: string;
  imageUrls?: string[];
  iconUrl: string;
  webPageUrl?: string;
  dateFrom?: string;
  dateTo?: string;
  regionName?: string;
};

/**
 * A {@link ShortProject} as returned by the api.
 * The type of all `coordinates` is an array instead of a tuple.
 */
export type ApiShortProject = Omit<ShortProject, "coordinates"> & {
  coordinates: ApiCoordinates;
};

/**
 * A project as returned by `getProjectById` among others.
 *
 * See API-documentation for documentation of parameters.
 */
export type Project = ShortProject & {
  orgaName: string;
};

/**
 * A {@link Project} as returned by the api.
 * The type of all `coordinates` is an array instead of a tuple.
 */
export type ApiProject = ApiShortProject & Omit<Project, keyof ShortProject>;

/**
 * Show information about a {@link Project}
 */
const ProjectCard = component$(
  ({
    description,
    coordinates,
    name,
    tags,
    iconUrl,
    orgaId,
    imageUrls,
    donatePageUrl,
    dateFrom,
    dateTo,
    webPageUrl,
    orgaName,
    regionName,
  }: Project) => {
    return (
      <InfoCard
        name={name}
        tags={tags.map((x) => `Tag ${x}`)}
        images={imageUrls}
        description={description}
        location={coordinates}
        icon={iconUrl}
      >
        {/* Properties */}
        <div q:slot="properties" class="flex flex-row items-center gap-2">
          <HiCalendarOutline />
          {dateFrom} - {dateTo}
        </div>
        <div q:slot="properties" class="flex flex-row items-center gap-2">
          <HiMapPinSolid />
          {regionName}
        </div>
        {/* Actions */}
        {webPageUrl && (
          <ActionButton url={webPageUrl} icon={HiGlobeAltOutline}>
            Website besuchen
          </ActionButton>
        )}
        {donatePageUrl && (
          <ActionButton url={donatePageUrl} icon={HiBanknotesOutline}>
            Für Projekt spenden
          </ActionButton>
        )}
        <ActionButton url={`/org/${orgaId}`} icon={HiBuildingLibraryOutline}>
          Infos zu {orgaName}
        </ActionButton>
      </InfoCard>
    );
  },
);

/**
 * Display an info-component for a project.
 * Either pass the already loaded project-information,
 * or pass an id to `load` to automatically load that project.
 */
export const ProjectInfo = component$(
  (props: Project | { load: MaybeSignal<number> }) => {
    // Already loaded
    if (!("load" in props)) return <ProjectCard {...props} />;

    // Load from the API
    return (
      <ApiRequest
        hook$={$(useGetProjectById)}
        args={[{ id: props.load }]}
        on200$={(proj: ApiProject) => (
          // API always returns a valid project (validated at runtime),
          // but the type of `coordinates` is not set to a tuple (but an array of arbitrary length).
          // We know, however, that the type is correct, so this cast is ok.
          <ProjectCard {...(proj as Project)} />
        )}
        defaultError$={(s) => <>Failed to display project (Error {s})</>}
      />
    );
  },
);
