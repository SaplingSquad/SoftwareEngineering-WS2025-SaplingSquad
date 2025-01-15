import { $, component$ } from "@builder.io/qwik";
import {
  HiBanknotesOutline,
  HiGlobeAltOutline,
  HiMapPinSolid,
  HiSparklesSolid,
  HiUserSolid,
} from "@qwikest/icons/heroicons";
import type { MaybeSignal } from "~/api/api";
import { useGetOrganizationById } from "~/api/api_hooks.gen";
import { ApiRequest } from "../api";
import type { ApiCoordinates, Coordinates } from "../map";
import type { CloseHandler } from "./info_card";
import { ActionButton, InfoCard } from "./info_card";
import type { ApiShortProject, ShortProject } from "./project";

/**
 * An organization as returned by `getOrganizationById` among others.
 *
 * See API-documentation for documentation of parameters.
 */
export type Organization = {
  id: number;
  description: string;
  coordinates: Coordinates;
  name: string;
  tags: number[];
  iconUrl: string;
  webPageUrl: string;
  foundingYear?: number;
  memberCount?: number;
  donatePageUrl?: string;
  imageUrls?: string[];
  regionName?: string;
  projects: ShortProject[];
};

/**
 * An {@link Organization} as returned by the api.
 * The type of all `coordinates` is an array instead of a tuple.
 */
export type ApiOrganization = Omit<Organization, "coordinates" | "projects"> & {
  coordinates: ApiCoordinates;
  projects: ApiShortProject[];
};

/**
 * Additional props for {@link ProjectCard}
 */
type OrganizationCardProps = {
  /**
   * See {@link CloseHandler}
   */
  onClose?: CloseHandler;
};

/**
 * Show information about an organization.
 * Will render in a card.
 */
const OrganizationCard = component$(
  ({
    // id,
    description,
    coordinates,
    name,
    tags,
    iconUrl,
    webPageUrl,
    foundingYear,
    memberCount,
    donatePageUrl,
    imageUrls,
    regionName,
    projects,
    onClose,
  }: Organization & OrganizationCardProps) => {
    return (
      <InfoCard
        name={name}
        tags={tags}
        images={imageUrls}
        description={description}
        location={coordinates}
        icon={iconUrl}
        aside={projects.length > 0}
        onClose={onClose}
      >
        {/* Properties */}
        {foundingYear && (
          <div q:slot="properties" class="flex flex-row items-center gap-2">
            <HiSparklesSolid />
            {foundingYear}
          </div>
        )}
        {memberCount && (
          <div q:slot="properties" class="flex flex-row items-center gap-2">
            <HiUserSolid />
            {memberCount}
          </div>
        )}
        {regionName && (
          <div q:slot="properties" class="flex flex-row items-center gap-2">
            <HiMapPinSolid />
            {regionName}
          </div>
        )}
        {/* Actions */}
        <ActionButton url={webPageUrl} icon={HiGlobeAltOutline}>
          Webseite besuchen
        </ActionButton>
        {donatePageUrl && (
          <ActionButton url={donatePageUrl} icon={HiBanknotesOutline}>
            Für Organisation spenden
          </ActionButton>
        )}
        {/* Aside */}
        {projects.map((p) => (
          // TODO: this is a temporary component. Replace with some nicer overview
          <div
            q:slot="aside"
            key={p.id}
            class="min-h-32 overflow-hidden rounded-lg bg-base-300 p-4"
          >
            <h5 class="text-lg font-medium">{p.name}</h5>
            <p>
              {description.length >= 100
                ? description.substring(0, 100) + "..."
                : description}
            </p>
          </div>
        ))}
      </InfoCard>
    );
  },
);

/**
 * Display an info-component for an organization.
 * Either pass the already loaded organization-information,
 * or pass an id to `load` to automatically load that organization.
 */
export const OrganizationInfo = component$(
  (
    props: (Organization | { load: MaybeSignal<number> }) &
      OrganizationCardProps,
  ) => {
    // Already loaded
    if (!("load" in props)) return <OrganizationCard {...props} />;

    // Load from API
    return (
      <ApiRequest
        hook$={$(useGetOrganizationById)}
        args={[{ id: props.load }]}
        on200$={(org: ApiOrganization) => (
          // API always returns a valid organization (validated at runtime),
          // but the type of `coordinates` is not set to a tuple (but an array of arbitrary length).
          // We know, however, that the type is correct, so this cast is ok.
          <OrganizationCard {...props} {...(org as Organization)} />
        )}
        defaultError$={(s) => <>Failed to display organization (Error {s})</>}
      />
    );
  },
);
