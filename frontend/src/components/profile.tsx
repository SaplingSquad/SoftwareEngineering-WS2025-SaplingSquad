import { component$ } from "@builder.io/qwik";
import { HiUserCircleOutline, HiPlusCircleSolid } from "@qwikest/icons/heroicons";

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
                        <button class="btn btn-primary">Bearbeiten</button>
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
                        <button class="hover:text-secondary" >
                            <HiPlusCircleSolid class="text-primary text-6xl text-opacity-80 hover:text-secondary transition-all" />
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
})



export const Profile = component$((inputData: { data: ProfileProjectsProps[] }) => {
    return (
        <>
            <div class="relative flex flex-wrap justify-center">
                <div class="card bg-base-300 rounded-box place-items-stretch m-4 p-4 space-y-4 w-5/6 min-w-fit ">
                    <h2 class="card-title">Profil</h2>
                    <div class="flex flex-wrap justify-around">
                        <div class="card bg-base-200 rounded-box place-items-stretch m-4 p-4 space-y-4 [max-height:90dvh] w-9/12 ">
                            <h2 class="card-title">Projekte</h2>
                            <div class="flex flex-wrap gap-6">
                                {
                                    inputData.data.map((item, idx: number) => (
                                        <ProjectCard key={idx} p={item} />
                                    ))
                                }
                                <ProjectDummy />
                            </div>
                        </div>
                        <div class="card bg-base-100 rounded-box place-items-stretch m-4 p-4 space-y-4 h-fit flex-initial w-2/12 min-w-fit">
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
                    </div>
                </div>
            </div>
        </>
    )
})