import { component$ } from "@builder.io/qwik";
import { MapLocationInput } from "./utils";

const Projektdaten = component$(() => {
    return (
        <>
            <p>Projektdaten</p>
            <label class="input input-bordered flex items-center gap-2">
                Projektname*
                <input type="text w-full" class="grow" placeholder="Mein Projekt" />
            </label>
            <label class="form-control">
                <div class="label">
                    <span class="label-text">Projektkurzbeschreibung</span>
                </div>
                <textarea class="textarea textarea-bordered h-24" placeholder="Beschreibung"></textarea>
            </label>
            <label class="form-control">
                <div class="label">
                    <span class="label-text">Projektbeschreibung*</span>
                </div>
                <textarea class="textarea textarea-bordered h-24" placeholder="Beschreibung"></textarea>
            </label>
            <label class="form-control">
                <div class="label">
                    <span class="label-text">Projektstandort*</span>
                </div>
                <div class="rounded">
                    <div class="card card-compact bg-base-100 shadow-xl">
                        <figure>
                            <div id="map"></div>
                            <MapLocationInput class="h-[30rem] w-[40rem] rounded-2xl" />
                        </figure>
                    </div>
                </div>
            </label>
            <label class="form-control w-full max-w">
                <label class="input input-bordered flex items-center gap-2">
                    Projektspendenseite
                    <input type="text" class="grow" />
                </label>
                <div class="label">
                    <span class="label-text-alt"></span>
                    <span class="label-text-alt">*notwendig</span>
                </div>
            </label>
        </>
    )
})

export const ProjectCreation = component$(() => {
    return (
        <>
            <div class="relative flex justify-center">
                <div class="card bg-base-300 rounded-box place-items-stretch m-8 p-8 space-y-4 [max-height:90dvh] w-1/3 min-w-fit ">
                    <h2 class="card-title">Projekterstellung</h2>
                    <div class="overflow-y-auto space-y-4 ">
                        <Projektdaten />
                    </div>
                    <div class="card-actions justify-between">
                        <button class="btn btn-error">Abbrechen
                        </button>
                        <button class="btn btn-primary">Speichern
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
})