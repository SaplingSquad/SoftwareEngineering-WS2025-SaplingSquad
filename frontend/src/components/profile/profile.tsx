import { Session } from "@auth/qwik";
import { component$, Signal } from "@builder.io/qwik";
import { HiUserCircleOutline, HiPlusCircleSolid, HiCog6ToothOutline, HiTrashOutline, HiPlusCircleOutline } from "@qwikest/icons/heroicons";
import { LogoutParamsForm } from "../auth/logout";
import { ProfileImage } from "./utils";
import { isAccTypeOrg, useAccountType } from "~/auth/tools";

export type ProfileProjectsProps = {
    img: string;
    title: string;
    text: string;
};

export type InputMarkerLocation = {
    lng: number;
    lat: number
}

export type OrgaInformationsProps = {
    name: string | null | undefined;
    description: string;
    location: InputMarkerLocation;
    numbPers: number;
    founding: number;
    logoUrl: string;
    imageUrls: [string];
    webpageUrl: string;
    donatePageUrl: string;
};

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
                        <a href="/profile/create-project" class="hover:text-secondary" >
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
    return (
        <>
            <div class="stats shadow m-4 p-4 space-y-4">
                <div class="stat place-items-center">
                    <div class="stat-title">Gründungsjahr</div>
                    <div class="stat-value text-primary">2018</div>
                </div>

                <div class="stat place-items-center">
                    <div class="stat-title">Mitglieder</div>
                    <div class="stat-value text-primary">16000</div>
                </div>

                <div class="stat place-items-center">
                    <div class="stat-title">Aufrufe</div>
                    <div class="stat-value text-primary">30</div>
                </div>
            </div>
            <div class="card-actions justify-end mx-4 py-4">
                <button class="btn btn-primary">Bearbeiten
                    <div class="text-2xl">
                        <HiCog6ToothOutline />
                    </div>
                </button>
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
                        <div class="skeleton h-16 w-16 shrink-0 rounded-full opacity-30"></div>
                        <div class="flex flex-col gap-4">
                            <div class="skeleton h-4 w-20 opacity-30"></div>
                        </div>
                    </div>
                    <div class="flex items-center gap-4">
                        <div class="skeleton h-32 w-full opacity-30"></div>
                        <div class="skeleton h-32 w-full opacity-30"></div>
                        <div class="skeleton h-32 w-full opacity-30"></div>
                    </div>
                </div>
                <div class="card-actions justify-end">
                    <a href="./verein-signup" class="btn btn-primary">Verein verknüpfen
                        <div class="text-2xl">
                            <HiPlusCircleOutline />
                        </div>
                    </a>
                </div>
            </div>
        </>
    )
})

const VereinInfoProjects = component$((inputData: { projectData: ProfileProjectsProps[], orgaInfo: OrgaInformationsProps }) => {
    return (
        inputData.orgaInfo.name === ""
            ?
            <>
                <VereinDummy />
            </>
            :
            <>
                <div class="card bg-base-100 rounded-box place-items-stretch  p-4 space-y-4 min-h-fit w-full min-w-fit card-bordered border-base-300 border-4 ">
                    <h2 class="card-title">Verein <div class="avatar">
                        <div class="w-10 rounded-full">
                            <img
                                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                        </div>
                    </div></h2>
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

export const VereinProfile = component$((inputData: { projectdata: ProfileProjectsProps[], profiledata: Readonly<Signal<null>> | Readonly<Signal<Session>> }) => {
    const orgaData: OrgaInformationsProps = {
        name: "New Roots",
        description: "New Roots is ...",
        location: { lng: 20, lat: 20 },
        numbPers: 12,
        founding: 2016,
        logoUrl: "asdf",
        imageUrls: [
            "path/to/image/url.pic"
        ],
        webpageUrl: "path/to/new/roots.de",
        donatePageUrl: "path/to/new/roots/donation/link.de"
    }

    const orgaDataEmpty: OrgaInformationsProps = {
        name: "",
        description: "",
        location: { lng: 0, lat: 0 },
        numbPers: 0,
        founding: 0,
        logoUrl: "",
        imageUrls: [""],
        webpageUrl: "",
        donatePageUrl: ""
    }
    return (
        <>
            <div class="grid grid-rows-4 grid-cols-10 gap-4 p-5">
                <div class="row-span-3 col-span-8">
                    <VereinInfoProjects projectData={inputData.projectdata} orgaInfo={orgaDataEmpty} />
                </div>
                <div class="row-span-auto col-span-2">
                    <ProfileInformation profiledata={inputData.profiledata} />
                </div>
            </div>
        </>
    )
})