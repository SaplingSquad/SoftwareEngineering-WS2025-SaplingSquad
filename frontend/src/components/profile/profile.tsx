import { Session } from "@auth/qwik";
import {
  component$,
  createContextId,
  Signal,
  useContext,
  useContextProvider,
  useSignal,
  useStore,
  useTask$,
} from "@builder.io/qwik";
import {
  HiPlusCircleSolid,
  HiCog6ToothOutline,
  HiPlusCircleOutline,
  HiLinkOutline,
  HiBanknotesOutline,
  HiTrashSolid,
  HiEllipsisVerticalOutline,
  HiMapPinOutline,
  HiCalendarOutline,
} from "@qwikest/icons/heroicons";
import { LogoutParamsForm } from "../auth/logout";
import { ProfileImage } from "./utils";
import { useDeleteProject } from "~/api/api_hooks.gen";
import {
  OrgaInformationsProps,
  ProjectInformationProps,
  ApiRelevantOrganisationInformations,
  ApiRelevantProjectInformations,
} from "./types";
import { isAccTypeOrg, useAccountType } from "~/auth/utils";
import { Link } from "@builder.io/qwik-city";

/**
 * UI Components for displaying the profile page with routes for adding/editing organizating and projects
 */

const OrgaProfileDataContext = createContextId<OrgaInformationsProps>(
  "verein-profile-context",
);

const OrgaProjectDataContext = createContextId<ProjectInformationProps[]>(
  "verein-project-context",
);

const OrgaProjektDelA = createContextId<number[]>("verein-project-del");

/**
 * Gives overview of a single project for the logged in organization
 */
const ProjectCard = component$((props: { p: ProjectInformationProps }) => {
  const projDel = useSignal(true);
  return (
    <div class="card w-96 bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title">{props.p.name}</h2>
        <div class="dropdown dropdown-end dropdown-left absolute right-0 top-0">
          <div tabIndex={0} role="button" class="btn btn-circle btn-ghost">
            <div class="text-2xl">
              <HiEllipsisVerticalOutline />
            </div>
          </div>
          <ul
            tabIndex={0}
            class="menu-neutral menu dropdown-content menu-sm w-24 rounded-box bg-base-100 p-2 shadow"
          >
            <li>
              <Link
                onClick$={() => {
                  projDel.value = !projDel.value;
                }}
              >
                {projDel.value && <p>Löschen</p>}
                {!projDel.value && <p>Zurück</p>}
              </Link>
            </li>
          </ul>
        </div>
        <ProjectContent del={projDel.value} p={props.p} />
      </div>
    </div>
  );
});

const ProjectDelete = component$(
  (inputData: { p: ProjectInformationProps }) => {
    useDeleteProject({ id: inputData.p.id });
    const contextDelA = useContext(OrgaProjektDelA);
    useTask$(() => {
      contextDelA.push(inputData.p.id);
    });
    return <></>;
  },
);

const ProjectContent = component$(
  (inputData: { del: boolean; p: ProjectInformationProps }) => {
    const refURL = "./manage-project?selproj=" + inputData.p.id.toString();
    const acceptedDel = useSignal(false);
    return (
      <>
        {acceptedDel.value && <ProjectDelete p={inputData.p} />}
        {inputData.del && (
          <>
            <div class="flex text-lg">
              <div class="text-2xl">
                <HiMapPinOutline />
              </div>
              {inputData.p.regionName}
            </div>
            <div class="flex text-lg">
              <div class="text-2xl">
                <HiCalendarOutline />
              </div>
              {inputData.p.dateFrom ? inputData.p.dateFrom.mnth : "--"}/
              {inputData.p.dateFrom ? inputData.p.dateFrom.year : "--"} -{" "}
              {inputData.p.dateTo ? inputData.p.dateTo.mnth : "--"}/
              {inputData.p.dateTo ? inputData.p.dateTo.year : "--"}
            </div>
            <div class="card-actions justify-end">
              <Link href={refURL} class="btn btn-primary join-item">
                Bearbeiten
                <div class="text-2xl">
                  <HiCog6ToothOutline />
                </div>
              </Link>
            </div>
          </>
        )}
        {!inputData.del && (
          <>
            <p class="text-lg">
              Wirklich entfernen? Dies kann nicht rückgängig gemacht werden.
            </p>
            <div class="card-actions justify-end">
              <button
                onClick$={() => {
                  acceptedDel.value = true;
                }}
                class="btn btn-error"
              >
                Entfernen
                <div class="text-2xl">
                  <HiTrashSolid />
                </div>
              </button>
            </div>
          </>
        )}
      </>
    );
  },
);

const ProjectDummy = component$(() => {
  return (
    <div class="card card-bordered w-96 border-4 border-dashed border-primary bg-primary-content shadow-xl">
      <div class="card-body">
        <h2 class="card-title text-primary">Neues Projekt hinzufügen</h2>
        <div class="flex items-center justify-center">
          <Link href="/profile/manage-project" class="hover:text-secondary">
            <HiPlusCircleSolid class="text-6xl text-primary text-opacity-80 transition-all hover:text-secondary" />
          </Link>
        </div>
      </div>
    </div>
  );
});

/**
 * Holds profile infomration for Logged in Users and Organizations
 */
const ProfileInformation = component$(
  (inputData: {
    profiledata: Readonly<Signal<null>> | Readonly<Signal<Session>>;
  }) => {
    const accType = isAccTypeOrg(useAccountType(inputData.profiledata));
    return (
      <div class="card card-bordered h-fit w-full min-w-fit flex-initial place-items-stretch space-y-4 rounded-box border-4 border-base-300 bg-base-100 p-4">
        <h2 class="card-title">{accType ? "Vereinsaccount" : "Account"}</h2>
        <div class="flex w-full justify-center">
          <div class="avatar placeholder w-5/6 min-w-10 max-w-28 justify-center">
            <div class="w-28 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100">
              <ProfileImage
                profiledata={inputData.profiledata}
                imgSize="size-32"
              />
            </div>
          </div>
        </div>
        <p>Name: {inputData.profiledata.value?.user?.name}</p>
        <p>E-Mail: {inputData.profiledata.value?.user?.email}</p>
        <LogoutParamsForm redirectTo={"/map"}>
          <button class="x-full btn btn-error btn-block">Abmelden</button>
        </LogoutParamsForm>
      </div>
    );
  },
);

const ProjectManagement = component$(
  (inputData: { data: ProjectInformationProps[] }) => {
    const contextDelA = useContext(OrgaProjektDelA);
    return (
      <div class="card bg-base-200 p-4">
        <div class="card-title pb-4 text-xl font-medium">Projekte</div>
        <div class="flex flex-wrap gap-6">
          {inputData.data
            .slice()
            .reverse()
            .filter((e) => !contextDelA.includes(e.id))
            .map((item, idx: number) => (
              <ProjectCard key={idx} p={item} />
            ))}
          <ProjectDummy />
        </div>
      </div>
    );
  },
);

/**
 * Display of organization informations
 */
const Vereinsinfo = component$(() => {
  const context = useContext(OrgaProfileDataContext);
  return (
    <>
      <div class="stats stats-vertical m-4 p-4 shadow lg:stats-horizontal">
        <div class="stat place-items-center">
          <div class="stat-title">Gründungsjahr</div>
          <div class="stat-value text-primary">{context.founding}</div>
        </div>
        <div class="stat place-items-center">
          <div class="stat-title">Mitglieder</div>
          <div class="stat-value text-primary">{context.numbPers}</div>
        </div>
        <div class="stat place-items-center">
          <div class="stat-title">Vereinsstandort</div>
          <div class="stat-value text-primary">{context.regionName}</div>
        </div>
      </div>
      <div class="card-actions mx-4 justify-end py-4">
        <Link href="./manage-organisation" class="btn btn-primary">
          Bearbeiten
          <div class="text-2xl">
            <HiCog6ToothOutline />
          </div>
        </Link>
      </div>
    </>
  );
});

const VereinDummy = component$(() => {
  return (
    <>
      <div role="alert" class="alert alert-warning mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 shrink-0 stroke-current"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <span>Verein verknüpfen, um Projekte anzulegen.</span>
      </div>
      <div class="card card-bordered min-h-fit w-full  min-w-fit place-items-stretch space-y-4 rounded-box border-4 border-base-300 bg-base-200 p-4">
        <div class="flex w-full flex-col gap-4 ">
          <div class="flex items-center gap-4">
            <div class="card h-16 w-16 shrink-0 rounded-full bg-base-300 opacity-30"></div>
            <div class="flex flex-col gap-4">
              <div class="card h-4 w-20 bg-base-300 opacity-30"></div>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <div class="card h-32 w-full bg-base-300 opacity-30"></div>
            <div class="card h-32 w-full bg-base-300 opacity-30"></div>
            <div class="card h-32 w-full bg-base-300 opacity-30"></div>
          </div>
        </div>
        <div class="card-actions justify-end">
          <Link href="./manage-organisation" class="btn btn-primary">
            Verein verknüpfen
            <div class="text-2xl">
              <HiPlusCircleOutline />
            </div>
          </Link>
        </div>
      </div>
    </>
  );
});

/**
 * Holds organization informations and organization projects. Changes to Dummy if there is no associated organization to logged in account.
 */
const VereinInfoProjects = component$(
  (inputData: { projectData: ProjectInformationProps[] }) => {
    const context = useContext(OrgaProfileDataContext);
    return context.name === "" ? (
      <VereinDummy />
    ) : (
      <div class="card card-bordered min-h-fit w-full  min-w-fit place-items-stretch space-y-4 rounded-box border-4 border-base-300 bg-base-100 p-4 ">
        <div class="flex items-center gap-4 rounded-3xl border border-2 border-primary p-4">
          <div class="avatar rounded-full bg-primary">
            <div class="w-24 rounded-full">
              <img src={context.logoUrl} />
            </div>
          </div>
          <div>
            <div class="text-2xl">{context.name}</div>
            <div class="flex gap-2">
              <div class="flex text-xl">
                <HiLinkOutline />
              </div>
              <div class="link">{context.webpageUrl}</div>
            </div>
            <div class="flex gap-2">
              <div class="flex text-xl">
                <HiBanknotesOutline />
              </div>
              <div class="link">{context.donatePageUrl}</div>
            </div>
          </div>
        </div>
        <div class="flex flex-wrap gap-6">
          <div class="card w-full place-items-stretch rounded-box bg-base-200">
            <Vereinsinfo />
          </div>
          <ProjectManagement data={inputData.projectData} />
        </div>
      </div>
    );
  },
);

export function convertAPITypeToInternalType(
  apiOut: ApiRelevantOrganisationInformations,
): OrgaInformationsProps {
  return {
    name: apiOut.name,
    description: apiOut.description,
    location: { lng: apiOut.coordinates[0], lat: apiOut.coordinates[1] },
    numbPers: apiOut.memberCount ? apiOut.memberCount.toString() : "",
    founding: apiOut.foundingYear ? apiOut.foundingYear.toString() : "",
    logoUrl: apiOut.iconUrl,
    imageUrls: apiOut.imageUrls ? apiOut.imageUrls : [],
    webpageUrl: apiOut.webPageUrl,
    donatePageUrl: apiOut.donatePageUrl ? apiOut.donatePageUrl : "",
    tags: apiOut.tags,
    regionName: apiOut.regionName,
  };
}

export function convertAPITypeToInternalProjectType(
  apiOut: ApiRelevantProjectInformations,
): ProjectInformationProps {
  return {
    name: apiOut.name,
    description: apiOut.description,
    location: { lng: apiOut.coordinates[0], lat: apiOut.coordinates[1] },
    logoUrl: apiOut.iconUrl,
    dateFrom: apiOut.dateFrom
      ? { mnth: apiOut.dateFrom.slice(5, 7), year: apiOut.dateFrom.slice(0, 4) }
      : { mnth: "--", year: "--" },
    dateTo: apiOut.dateTo
      ? { mnth: apiOut.dateTo.slice(5, 7), year: apiOut.dateTo.slice(0, 4) }
      : { mnth: "--", year: "--" },
    imageUrls: apiOut.imageUrls ? apiOut.imageUrls : [],
    webpageUrl: apiOut.webPageUrl ? apiOut.webPageUrl : "",
    donatePageUrl: apiOut.donatePageUrl ? apiOut.donatePageUrl : "",
    tags: apiOut.tags,
    id: apiOut.id,
    regionName: apiOut.regionName,
  };
}

/**
 * User and Organiziation Profile Page component
 */
export const UserProfile = component$(
  (inputData: {
    profiledata: Readonly<Signal<null>> | Readonly<Signal<Session>>;
  }) => {
    return (
      <div class="max-w-md p-4">
        <ProfileInformation profiledata={inputData.profiledata} />
      </div>
    );
  },
);

export const VereinProfile = component$(
  (inputData: {
    orgaData: ApiRelevantOrganisationInformations;
    projectsData: ApiRelevantProjectInformations[];
    profiledata: Readonly<Signal<null>> | Readonly<Signal<Session>>;
  }) => {
    const orgaDataTransfer: OrgaInformationsProps =
      convertAPITypeToInternalType(inputData.orgaData);

    const orgaProjectDataTransfer: ProjectInformationProps[] =
      inputData.projectsData.map((e) => convertAPITypeToInternalProjectType(e));

    const orgaStore = useStore<OrgaInformationsProps>(orgaDataTransfer);
    useContextProvider(OrgaProfileDataContext, orgaStore);
    const projectsStore = useStore<ProjectInformationProps[]>(
      orgaProjectDataTransfer,
    );
    useContextProvider(OrgaProjectDataContext, projectsStore);
    const projectDel = useStore<number[]>([]);
    useContextProvider(OrgaProjektDelA, projectDel);
    return (
      <div class="flex flex-wrap gap-4 lg:p-4">
        <div class="order-2 lg:order-1 lg:w-9/12">
          <VereinInfoProjects projectData={projectsStore} />
        </div>
        <div class="order-1 flex-auto lg:order-2">
          <ProfileInformation profiledata={inputData.profiledata} />
        </div>
      </div>
    );
  },
);
