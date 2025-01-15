import type { QRL } from "@builder.io/qwik";
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
import { formatDateRange, limitText } from "~/utils";
import { ApiRequest } from "../api";
import { Avatar } from "../avatar";
import type { BookmarkProps } from "../bookmark";
import type { LinkTarget } from "../link_button";
import type { ApiCoordinates, Coordinates } from "../map";
import { ActionButton, IconProperty, InfoCard } from "./info_card";

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
 * Additional props for {@link ProjectCard}
 */
type ProjectCardProps = {
  /**
   * Optional handler to call when organization link is clicked.
   * If passed, will prevent navigation on clicking that button and only call this handler.
   */
  onShowOrganization$?: QRL<(id: number) => unknown>;
  /**
   * Optionally show a close-button. See {@link LinkTarget}.
   */
  onClose?: LinkTarget;
  /**
   * Optionally show a back-button. See {@link LinkTarget}.
   */
  onBack?: LinkTarget;
} & Partial<BookmarkProps>;

/**
 * Show information about a {@link Project}.
 * For additional props, see {@link ProjectCardProps}.
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
    onShowOrganization$,
    onClose,
    onBack,
    bookmarked,
    onSetBookmarked$,
  }: Project & ProjectCardProps) => {
    return (
      <InfoCard
        name={name}
        tags={tags}
        images={imageUrls}
        description={description}
        location={coordinates}
        icon={iconUrl}
        onClose={onClose}
        onBack={onBack}
        bookmarked={bookmarked}
        onSetBookmarked$={onSetBookmarked$}
      >
        {/* Properties */}
        <IconProperty
          value={formatDateRange(dateFrom, dateTo)}
          Icon={HiCalendarOutline}
        />
        <IconProperty value={regionName} Icon={HiMapPinSolid} />
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
        <ActionButton
          url={`/organization/${orgaId}`}
          icon={HiBuildingLibraryOutline}
          onClick$={onShowOrganization$ && $(() => onShowOrganization$(orgaId))}
        >
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
  (
    props: (
      | Project
      | {
          load: MaybeSignal<number>;
          onLoaded$?: QRL<(proj: Project) => unknown>;
        }
    ) &
      ProjectCardProps,
  ) => {
    // Already loaded
    if (!("load" in props)) return <ProjectCard {...props} />;

    // Load from the API
    return (
      <ApiRequest
        hook$={$(useGetProjectById)}
        args={[{ id: props.load }]}
        on200$={(proj: ApiProject) => {
          // API always returns a valid project (validated at runtime),
          // but the type of `coordinates` is not set to a tuple (but an array of arbitrary length).
          // We know, however, that the type is correct, so this cast is ok.
          const project = proj as Project;
          props.onLoaded$?.(project);
          return <ProjectCard {...props} {...project} />;
        }}
        defaultError$={(s) => <>Failed to display project (Error {s})</>}
      />
    );
  },
);

/**
 * Shows a short overview of a project.
 */
export const ProjectShortOverview = component$(
  ({
    iconUrl,
    name,
    regionName,
    description,
    dateFrom,
    dateTo,
  }: ShortProject) => (
    <section>
      <div class="float-left mr-2">
        <Avatar icon={iconUrl} alt={`Icon von ${name}`} />
      </div>
      <h5 class="mb-1 text-lg font-medium">{name}</h5>
      <div class="mb-2 flex flex-row flex-wrap gap-x-4 gap-y-1">
        <IconProperty value={regionName} Icon={HiMapPinSolid} />
        <IconProperty
          value={formatDateRange(dateFrom, dateTo)}
          Icon={HiCalendarOutline}
        />
      </div>
      <p>{limitText(description, 100)}</p>
    </section>
  ),
);
