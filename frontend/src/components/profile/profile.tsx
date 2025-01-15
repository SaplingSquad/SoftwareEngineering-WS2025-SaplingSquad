import { Session } from "@auth/qwik";
import { component$, createContextId, Signal, useContext, useContextProvider, useSignal, useStore } from "@builder.io/qwik";
import { HiPlusCircleSolid, HiCog6ToothOutline, HiPlusCircleOutline, HiLinkOutline, HiBanknotesOutline, HiTrashSolid, HiEllipsisVerticalOutline, HiMapPinOutline, HiCalendarOutline } from "@qwikest/icons/heroicons";
import { LogoutParamsForm } from "../auth/logout";
import { ProfileImage } from "./utils";
import { isAccTypeOrg, useAccountType } from "~/auth/useauthheader";
import { useDeleteProject } from "~/api/api_hooks.gen";
import { OrgaInformationsProps, ProjectInformationProps, ApiRelevantOrganisationInformations, ApiRelevantProjectInformations } from "./types";

const OrgaProfileDataContext = createContextId<OrgaInformationsProps>("verein-profile-context")

const OrgaProjectDataContext = createContextId<ProjectInformationProps[]>("verein-project-context")

const OrgaProjektDelA = createContextId<number[]>("verein-project-del")


const ProjectCard = component$((props: { p: ProjectInformationProps }) => {
    const refURL = './manage-project?selproj=' + props.p.id.toString()
    const remProjId = useSignal<number>(props.p.id)
    const projDel = useSignal(true)
    //const removeProjectCall = useDeleteProject({ id: remProjId })
    return (
        <>
            <div class="card bg-base-100 w-96 shadow-xl">
                <div class="card-body">
                    <h2 class="card-title">{props.p.name}</h2>
                    <div class="absolute top-0 right-0 dropdown dropdown-left dropdown-end">
                        <div tabIndex={0} role="button" class="btn btn-ghost btn-circle">
                            <div class="text-2xl">
                                <HiEllipsisVerticalOutline />
                            </div>
                        </div>
                        <ul
                            tabIndex={0}
                            class="menu menu-sm menu-neutral dropdown-content bg-base-100 rounded-box w-24 p-2 shadow">
                            <li>
                                <a onClick$={() => { projDel.value = !projDel.value; console.log(projDel.value) }}>{projDel.value && <ProjectLoeschen />}{!projDel.value && <ProjectZurueck />}</a>
                            </li>
                        </ul>
                    </div>
                    <ProjectContent del={projDel.value} p={props.p} />
                </div>
            </div>
        </>
    )
})

const ProjectZurueck = component$(() => {
    return (
        <p>
            Zurück
        </p>
    )
})

const ProjectLoeschen = component$(() => {
    return (
        <p>
            Löschen
        </p>
    )
})

const ProjectContent = component$((inputData: { del: boolean, p: ProjectInformationProps }) => {
    const refURL = './manage-project?selproj=' + inputData.p.id.toString()
    const acceptedDel = useSignal(false)
    const contextDelA = useContext(OrgaProjektDelA)
    if (acceptedDel.value) {
        useDeleteProject({ id: inputData.p.id });
        contextDelA.push(inputData.p.id)
    }
    return (
        <>
            {inputData.del &&
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
                        {inputData.p.dateFrom ? inputData.p.dateFrom.mnth : "--"}/{inputData.p.dateFrom ? inputData.p.dateFrom.year : "--"} - {inputData.p.dateTo ? inputData.p.dateTo.mnth : "--"}/{inputData.p.dateTo ? inputData.p.dateTo.year : "--"}
                    </div>
                    <div class="card-actions justify-end">

                        <a href={refURL} class="btn btn-primary join-item">Bearbeiten
                            <div class="text-2xl">
                                <HiCog6ToothOutline />
                            </div>
                        </a>
                    </div>
                </>
            }
            {!inputData.del &&
                <>
                    <p class="text-lg">
                        Wirklich entfernen? Dies kann nicht rückgängig gemacht werden.
                    </p>
                    <div class="card-actions justify-end">
                        <button onClick$={() => { acceptedDel.value = true }} class="btn btn-error">Entfernen
                            <div class="text-2xl">
                                <HiTrashSolid />
                            </div>
                        </button>
                    </div>
                </>
            }
        </>
    )
})

const ProjectDummy = component$(() => {
    return (
        <>
            <div class="card bg-primary-content card-bordered border-primary border-dashed border-4 w-96 shadow-xl">
                <div class="card-body">
                    <h2 class="card-title text-primary">Neues Projekt hinzufügen</h2>
                    <div class="flex items-center justify-center">
                        <a href="/profile/manage-project" class="hover:text-secondary" >
                            <HiPlusCircleSolid class="text-primary text-6xl text-opacity-80 hover:text-secondary transition-all" />
                        </a>
                    </div>
                </div>
            </div>
        </>
    )
})

const ProfileInformation = component$((inputData: { profiledata: Readonly<Signal<null>> | Readonly<Signal<Session>> }) => {
    return (
        <>
            <div class="card bg-base-100 rounded-box place-items-stretch p-4 space-y-4 h-fit flex-initial w-full min-w-fit card-bordered border-base-300 border-4">
                <h2 class="card-title">{isAccTypeOrg(useAccountType(inputData.profiledata)) ? "Vereinsaccount" : "Account"}</h2>
                <div class="w-full flex justify-center">
                    <div class="avatar placeholder w-5/6 justify-center min-w-10 max-w-28">
                        <div class="ring-primary ring-offset-base-100 rounded-full ring ring-offset-2 w-28">
                            <ProfileImage profiledata={inputData.profiledata} imgSize="size-32" />
                        </div>
                    </div>
                </div>
                <p>Name: {inputData.profiledata.value?.user?.name}</p>
                <p>E-Mail: {inputData.profiledata.value?.user?.email}</p>
                <LogoutParamsForm redirectTo={"/map"}>
                    <button class="btn btn-block btn-error x-full">Abmelden</button>
                </LogoutParamsForm>
            </div>
        </>
    )
})

const ProjectManagement = component$((inputData: { data: ProjectInformationProps[] }) => {
    const contextDelA = useContext(OrgaProjektDelA)
    return (
        <>
            <div class="card bg-base-200 p-4">
                <div class="card-title text-xl font-medium pb-4">Projekte</div>
                <div class="flex flex-wrap gap-6">
                    {
                        inputData.data.slice().reverse().filter((e, i) => !contextDelA.includes(e.id)).map((item, idx: number) => (
                            <ProjectCard key={idx} p={item} />
                        ))
                    }
                    <ProjectDummy />
                </div>
            </div>
        </>
    )
})

const Vereinsinfo = component$(() => {
    const context = useContext(OrgaProfileDataContext);
    return (
        <>
            <div class="stats stats-vertical lg:stats-horizontal shadow m-4 p-4">
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
            <div class="card-actions justify-end mx-4 py-4">
                <a href="./manage-organisation" class="btn btn-primary">Bearbeiten
                    <div class="text-2xl">
                        <HiCog6ToothOutline />
                    </div>
                </a>
            </div>
        </>
    )
})

const VereinDummy = component$(() => {
    return (
        <>
            <div role="alert" class="alert alert-warning mb-4">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 shrink-0 stroke-current"
                    fill="none"
                    viewBox="0 0 24 24">
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>Verein verknüpfen, um Projekte anzulegen.</span>
            </div>
            <div class="card bg-base-200 rounded-box place-items-stretch  p-4 space-y-4 min-h-fit w-full min-w-fit card-bordered border-base-300 border-4">
                <div class="flex w-full flex-col gap-4 ">
                    <div class="flex items-center gap-4">
                        <div class="card bg-base-300 h-16 w-16 shrink-0 rounded-full opacity-30"></div>
                        <div class="flex flex-col gap-4">
                            <div class="card bg-base-300 h-4 w-20 opacity-30"></div>
                        </div>
                    </div>
                    <div class="flex items-center gap-4">
                        <div class="card bg-base-300 h-32 w-full opacity-30"></div>
                        <div class="card bg-base-300 h-32 w-full opacity-30"></div>
                        <div class="card bg-base-300 h-32 w-full opacity-30"></div>
                    </div>
                </div>
                <div class="card-actions justify-end">
                    <a href="./manage-organisation" class="btn btn-primary">Verein verknüpfen
                        <div class="text-2xl">
                            <HiPlusCircleOutline />
                        </div>
                    </a>
                </div>
            </div>
        </>
    )
})

const VereinInfoProjects = component$((inputData: { projectData: ProjectInformationProps[] }) => {
    const context = useContext(OrgaProfileDataContext)
    const contextProject = useContext(OrgaProjectDataContext)
    return (
        context.name === ""
            ?
            <>
                <VereinDummy />
            </>
            :
            <>
                <div class="card bg-base-100 rounded-box place-items-stretch  p-4 space-y-4 min-h-fit w-full min-w-fit card-bordered border-base-300 border-4 ">
                    <div class="flex items-center gap-4 border border-primary rounded-3xl border-2 p-4">
                        <div class="avatar bg-primary rounded-full">
                            <div class="w-24 rounded-full">
                                <img src={context.logoUrl} />
                            </div>
                        </div>
                        <div>
                            <div class="text-2xl">
                                {context.name}
                            </div>
                            <div class="flex gap-2">
                                <div class="text-xl flex">
                                    <HiLinkOutline />
                                </div>
                                <div class="link">
                                    {context.webpageUrl}
                                </div>
                            </div>
                            <div class="flex gap-2">
                                <div class="text-xl flex">
                                    <HiBanknotesOutline />
                                </div>
                                <div class="link">
                                    {context.donatePageUrl}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-wrap gap-6">
                        <div class="card bg-base-200 rounded-box place-items-stretch w-full">
                            <Vereinsinfo />
                        </div>
                        <ProjectManagement data={inputData.projectData} />
                    </div>
                </div>
            </>


    )
})

export const UserProfile = component$((inputData: { profiledata: Readonly<Signal<null>> | Readonly<Signal<Session>> }) => {
    return (
        <>
            <div class="max-w-md p-4">
                <ProfileInformation profiledata={inputData.profiledata} />
            </div>
        </>
    )
})

export function convertAPITypeToInternalType(apiOut: ApiRelevantOrganisationInformations): OrgaInformationsProps {
    return {
        name: apiOut.name,
        description: apiOut.description,
        location: { lng: apiOut.coordinates[0], lat: apiOut.coordinates[1] },
        numbPers: apiOut.memberCount ? apiOut.memberCount.toString() : '',
        founding: apiOut.foundingYear ? apiOut.foundingYear.toString() : '',
        logoUrl: apiOut.iconUrl,
        imageUrls: apiOut.imageUrls ? apiOut.imageUrls : [],
        webpageUrl: apiOut.webPageUrl,
        donatePageUrl: apiOut.donatePageUrl ? apiOut.donatePageUrl : '',
        tags: apiOut.tags,
        regionName: apiOut.regionName
    }
}

export function convertAPITypeToInternalProjectType(apiOut: ApiRelevantProjectInformations): ProjectInformationProps {
    return {
        name: apiOut.name,
        description: apiOut.description,
        location: { lng: apiOut.coordinates[0], lat: apiOut.coordinates[1] },
        logoUrl: apiOut.iconUrl,
        dateFrom: apiOut.dateFrom ? { mnth: apiOut.dateFrom.slice(5, 7), year: apiOut.dateFrom.slice(0, 4) } : { mnth: "--", year: "--" },
        dateTo: apiOut.dateTo ? { mnth: apiOut.dateTo.slice(5, 7), year: apiOut.dateTo.slice(0, 4) } : { mnth: "--", year: "--" },
        imageUrls: apiOut.imageUrls ? apiOut.imageUrls : [],
        webpageUrl: apiOut.webPageUrl ? apiOut.webPageUrl : '',
        donatePageUrl: apiOut.donatePageUrl ? apiOut.donatePageUrl : '',
        tags: apiOut.tags,
        id: apiOut.id,
        regionName: apiOut.regionName
    }
}

export const VereinProfile = component$((inputData: {
    orgaData: ApiRelevantOrganisationInformations,
    projectsData: ApiRelevantProjectInformations[],
    profiledata: Readonly<Signal<null>> | Readonly<Signal<Session>>
}) => {

    const orgaDataTransfer: OrgaInformationsProps = convertAPITypeToInternalType(inputData.orgaData);

    const orgaProjectDataTransfer: ProjectInformationProps[] = inputData.projectsData.map((e, i) => convertAPITypeToInternalProjectType(e))

    const orgaStore = useStore<OrgaInformationsProps>(orgaDataTransfer)
    useContextProvider(OrgaProfileDataContext, orgaStore)
    const projectsStore = useStore<ProjectInformationProps[]>(orgaProjectDataTransfer)
    useContextProvider(OrgaProjectDataContext, projectsStore)
    const projectDel = useStore<number[]>([])
    useContextProvider(OrgaProjektDelA, projectDel)
    return (
        <>
            <div class="flex flex-wrap gap-4 lg:p-4">
                <div class="order-2 lg:order-1">
                    <VereinInfoProjects projectData={projectsStore} />
                </div>
                <div class="flex-auto order-1 lg:order-2">
                    <ProfileInformation profiledata={inputData.profiledata} />
                </div>
            </div>
        </>
    )
})