import { component$ } from "@builder.io/qwik";
import { HiUserCircleOutline, HiPlusCircleSolid, HiCog6ToothOutline, HiTrashOutline } from "@qwikest/icons/heroicons";

export type ProfileProjectsProps = {
    img: string;
    title: string;
    text: string;
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

const ProfileInformation = component$(() => {
    return (
        <>
            <div class="card bg-base-100 rounded-box place-items-stretch m-4 p-4 space-y-4 h-fit flex-initial w-2/12 min-w-fit card-bordered border-secondary border-4">
                <h2 class="card-title">Account</h2>
                <div class="w-full flex justify-center">
                    <div class="avatar placeholder w-5/6 justify-center min-w-10 max-w-28">
                        <div class="ring-primary ring-offset-base-100 rounded-full ring ring-offset-2 w-28">
                            <span class="text-4xl">D</span>
                        </div>
                    </div>
                </div>
                <p>Name</p>
                <p>Email</p>
                <button class="btn btn-error x-1/2">Abmelden</button>
            </div>
        </>
    )
})

const ProjectManagement = component$((inputData: { data: ProfileProjectsProps[] }) => {
    return (
        <>
            <div class="collapse bg-base-200">
                <input type="checkbox" />
                <div class="collapse-title text-xl font-medium">Projekte</div>
                <div class="collapse-content">
                    <div class="flex flex-wrap gap-6">
                        {
                            inputData.data.map((item, idx: number) => (
                                <ProjectCard key={idx} p={item} />
                            ))
                        }
                        <ProjectDummy />
                    </div>
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

const VereinInfoProjects = component$((inputData: { data: ProfileProjectsProps[] }) => {
    return (
        <>
            <div class="card bg-base-100 rounded-box place-items-stretch m-4 p-4 space-y-4 [max-height:90dvh] w-9/12 card-bordered border-secondary border-4 ">
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
                    <ProjectManagement data={inputData.data} />
                </div>
            </div>
        </>
    )
})

export const Profile = component$((inputData: { data: ProfileProjectsProps[] }) => {
    return (
        <>
            <div class="relative flex flex-wrap justify-center">
                <div class="flex flex-wrap justify-around">
                    <VereinInfoProjects data={inputData.data} />
                    <ProfileInformation />
                </div>
            </div>
        </>
    )
})