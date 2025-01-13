import { Session } from "@auth/qwik";
import { component$, createContextId, Signal, useContext, useContextProvider, useStore } from "@builder.io/qwik";
import { HiUserCircleOutline, HiPlusCircleSolid, HiCog6ToothOutline, HiTrashOutline, HiPlusCircleOutline, HiLinkOutline, HiBanknotesOutline } from "@qwikest/icons/heroicons";
import { LogoutParamsForm } from "../auth/logout";
import { ProfileImage } from "./utils";
import { isAccTypeOrg, useAccountType } from "~/auth/useauthheader";

const OrgaProfileDataContext = createContextId<OrgaInformationsProps>("verein-profile-context")

//Api Types
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
}

//Used Types
export type ProfileProjectsProps = {
    img: string;
    title: string;
    text: string;
};

export type InputMarkerLocation = {
    lng: number;
    lat: number
}

export type ProjectDate = {
    mnth: number;
    year: number;
}

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
};

export type ProjectInformationProps = {
    name: string | null | undefined;
    description: string;
    location: InputMarkerLocation;
    dateFrom: ProjectDate;
    dateTo: ProjectDate;
    imageUrls: string[];
    webpageUrl: string;
    donatePageUrl: string;
    tags: number[];
}

const ProjectCard = component$((props: { p: ProfileProjectsProps }) => {
    return (
        <>
            <div class="card bg-base-100 w-96 shadow-xl">
                <div class="card-body">
                    <h2 class="card-title">{props.p.title}</h2>
                    <p>{props.p.text}</p>
                    <div class="card-actions justify-end">
                        <button class="btn btn-primary">Bearbeiten
                            <div class="text-2xl">
                                <HiCog6ToothOutline />
                            </div>
                        </button>
                    </div>
                </div>
            </div>
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

const ProjectManagement = component$((inputData: { data: ProfileProjectsProps[] }) => {
    return (
        <>
            <div class="card bg-base-200 p-4">
                <div class="card-title text-xl font-medium pb-4">Projekte</div>
                <div class="flex flex-wrap gap-6">
                    {
                        inputData.data.map((item, idx: number) => (
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
            <div class="stats shadow m-4 p-4 space-y-4">
                <div class="stat place-items-center">
                    <div class="stat-title">Gründungsjahr</div>
                    <div class="stat-value text-primary">{context.founding}</div>
                </div>

                <div class="stat place-items-center">
                    <div class="stat-title">Mitglieder</div>
                    <div class="stat-value text-primary">{context.numbPers}</div>
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

const VereinInfoProjects = component$((inputData: { projectData: ProfileProjectsProps[] }) => {
    const context = useContext(OrgaProfileDataContext)
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
            <ProfileInformation profiledata={inputData.profiledata} />
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
        imageUrls: apiOut.imageUrls ? apiOut.imageUrls : ["test_image.jpg"],
        webpageUrl: apiOut.webPageUrl,
        donatePageUrl: apiOut.donatePageUrl ? apiOut.donatePageUrl : ''
    }
}


export const VereinProfile = component$((inputData: { orgaData: ApiRelevantOrganisationInformations, projectdata: ProfileProjectsProps[], profiledata: Readonly<Signal<null>> | Readonly<Signal<Session>> }) => {
    const orgaData: OrgaInformationsProps = {
        name: "New Roots",
        description: "Der New Roots e.V. ist eine Initiative von Freunden aus München, die sich gemeinsam der Herausforderung verschrieben haben, bedürftigen Menschen zu helfen. Unser gemeinnütziger Verein wurde mit dem klaren Ziel gegründet, Kindern in Kenia ein sicheres Zuhause zu bieten, regelmäßige Mahlzeiten zu gewährleisten und ihnen den Zugang zu Bildung zu ermöglichen.",
        location: { lng: 20, lat: 20 },
        numbPers: "12",
        founding: "2016",
        logoUrl: "https://lirp.cdn-website.com/58002456/dms3rep/multi/opt/Logo_w_150ppi-134w.png",
        imageUrls: [
            "https://lirp.cdn-website.com/58002456/dms3rep/multi/opt/PHOTO-2024-10-26-15-29-15-600h.jpg",
            "https://img.daisyui.com/images/stock/photo-1565098772267-60af42b81ef2.webp",
            "https://img.daisyui.com/images/stock/photo-1572635148818-ef6fd45eb394.webp",
            "https://img.daisyui.com/images/stock/photo-1494253109108-2e30c049369b.webp",
            "https://img.daisyui.com/images/stock/photo-1550258987-190a2d41a8ba.webp"
        ],
        webpageUrl: "https://www.new-roots.de/#Listen",
        donatePageUrl: "path/to/new/roots/donation/link.de"
    }

    const orgaDataEmpty: OrgaInformationsProps = {
        name: "",
        description: "",
        location: { lng: 0, lat: 0 },
        numbPers: "",
        founding: "",
        logoUrl: "",
        imageUrls: [""],
        webpageUrl: "",
        donatePageUrl: ""
    }

    const orgaDataTransfer: OrgaInformationsProps = convertAPITypeToInternalType(inputData.orgaData);

    const orgaProjects: ProjectInformationProps[] =
        [
            {
                name: "Great Green Wall",
                description: "The Great Green Wall is",
                location: { lng: 0, lat: 0 },
                dateFrom: { mnth: 0, year: 0 },
                dateTo: { mnth: 0, year: 0 },
                imageUrls: [
                    "https://lirp.cdn-website.com/58002456/dms3rep/multi/opt/PHOTO-2024-10-26-15-29-15-600h.jpg",
                    "https://img.daisyui.com/images/stock/photo-1565098772267-60af42b81ef2.webp",
                    "https://img.daisyui.com/images/stock/photo-1572635148818-ef6fd45eb394.webp",
                    "https://img.daisyui.com/images/stock/photo-1494253109108-2e30c049369b.webp",
                    "https://img.daisyui.com/images/stock/photo-1550258987-190a2d41a8ba.webp"
                ],
                webpageUrl: "https://www.new-roots.de/#Listen",
                donatePageUrl: "path/to/new/roots/donation/link.de",
                tags: [1, 2, 3, 4],
            },
            {
                name: "Great Green Wall 2",
                description: "The Great Green Wall 2 is",
                location: { lng: 0, lat: 0 },
                dateFrom: { mnth: 0, year: 0 },
                dateTo: { mnth: 0, year: 0 },
                imageUrls: [
                    "https://lirp.cdn-website.com/58002456/dms3rep/multi/opt/PHOTO-2024-10-26-15-29-15-600h.jpg",
                    "https://img.daisyui.com/images/stock/photo-1565098772267-60af42b81ef2.webp",
                    "https://img.daisyui.com/images/stock/photo-1572635148818-ef6fd45eb394.webp",
                    "https://img.daisyui.com/images/stock/photo-1494253109108-2e30c049369b.webp",
                    "https://img.daisyui.com/images/stock/photo-1550258987-190a2d41a8ba.webp"
                ],
                webpageUrl: "https://www.new-roots.de/#Listen",
                donatePageUrl: "path/to/new/roots/donation/link.de",
                tags: [1, 2, 3, 4],
            }
        ]

    const store = useStore<OrgaInformationsProps>(orgaDataTransfer)
    useContextProvider(OrgaProfileDataContext, store)
    return (
        <>
            <div class="grid grid-rows-4 grid-cols-10 gap-4 p-5">
                <div class="row-span-3 col-span-8">
                    <VereinInfoProjects projectData={inputData.projectdata} />
                </div>
                <div class="row-span-auto col-span-2">
                    <ProfileInformation profiledata={inputData.profiledata} />
                </div>
            </div>
        </>
    )
})