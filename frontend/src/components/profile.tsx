import { component$ } from "@builder.io/qwik";
import { HiUserCircleOutline } from "@qwikest/icons/heroicons";

export const Profile = component$(() => {
    return (
        <>
            <div class="relative flex flex-wrap justify-center">
                <div class="card bg-base-300 rounded-box place-items-stretch m-4 p-4 space-y-4 w-5/6 min-w-fit ">
                    <h2 class="card-title">Profil</h2>
                    <div class="flex flex-wrap justify-around">
                        <div class="card bg-base-100 rounded-box place-items-stretch m-4 p-4 space-y-4 [max-height:90dvh] w-9/12 min-w-fit ">
                            <h2 class="card-title">Projekte</h2>
                            <div class="collapse collapse-arrow bg-base-200">
                                <input type="radio" name="my-accordion-2" />
                                <div class="collapse-title text-xl font-medium">Projekt 1</div>
                                <div class="collapse-content">
                                    <div class="card bg-primary rounded-box place-items-stretch m-4 p-4 w-1/2 min-w-fit">
                                        <h2 class="card-title text-primary-content">Spendenfortschritt</h2>
                                        <input type="range" min="0" max="100" value="25" class="range range-accent" step="10" />
                                        <div class="flex w-full justify-between px-2 text-xs">
                                            <span>|</span>
                                            <span>|</span>
                                            <span>|</span>
                                            <span>|</span>
                                            <span>|</span>
                                            <span>|</span>
                                            <span>|</span>
                                            <span>|</span>
                                            <span>|</span>
                                            <span>|</span>
                                            <span>|</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="collapse collapse-arrow bg-base-200">
                                <input type="radio" name="my-accordion-2" />
                                <div class="collapse-title text-xl font-medium">Projekt 2</div>
                                <div class="collapse-content">
                                    <p>hello</p>
                                </div>
                            </div>
                            <div class="collapse collapse-arrow bg-base-200">
                                <input type="radio" name="my-accordion-2" />
                                <div class="collapse-title text-xl font-medium">Projekt 3</div>
                                <div class="collapse-content">
                                    <p>hello</p>
                                </div>
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