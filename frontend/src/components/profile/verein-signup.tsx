import { component$, useSignal, useStore } from "@builder.io/qwik";
import { HiStarOutline, HiNoSymbolOutline, HiChevronRightOutline, HiChevronLeftOutline } from "@qwikest/icons/heroicons";
import { MapLocationInput } from "./utils";

export type Badge = {
    title: string
    answer: boolean;
};

const answerStyles = new Map<boolean, string>([
    [false, ""],
    [true, "btn-primary"],
])


const Vereinsdaten = component$(() => {
    return (
        <>
            <p>Vereinsdaten</p>
            <label class="input input-bordered flex items-center gap-2">
                Vereinsname*
                <input type="text w-full" class="grow" placeholder="Mein Verein" />
            </label>
            <label class="input input-bordered flex items-center gap-2">
                Gründungsjahr
                <input type="text" class="grow" />
            </label>
            <label class="input input-bordered flex items-center gap-2">
                Mitgliederzahl
                <input type="text" class="grow" />
            </label>
            <label class="input input-bordered flex items-center gap-2">
                Vereinswebsite
                <input type="text" class="grow" />
            </label>
            <label class="form-control w-full max-w">
                <label class="input input-bordered flex items-center gap-2">
                    Spendenseite
                    <input type="text" class="grow" />
                </label>
                <div class="label">
                    <span class="label-text-alt"></span>
                    <span class="label-text-alt">*notwendig</span>
                </div>
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
            <label class="form-control w-full max-w-xs -my-40 ">
                <div class="label">
                    <span class="label-text">Vereinslogo</span>
                </div>
                <input type="file" class="file-input file-input-bordered file-input-primary w-full max-w-xs" />
            </label>
        </>
    )
})

const Vereinstags = component$((inputData: { data: Badge[] }) => {
    const store = useStore({ inputData })
    return (
        <>
            <p>Vereinstags</p>
            <div class="flex flex-wrap justify-around grid-cols-3 grid gap-4  mb-6">
                {store.inputData.data.map((item, idx: number) => (
                    <SingleVereinstag key={idx} b={item} />
                ))}
            </div>
        </>
    )
})

const SingleVereinstag = component$((props: { b: Badge }) => {
    return (
        <>
            <div class={"btn btn-sm " + answerStyles.get(props.b.answer)!} onClick$={() => (props.b.answer = !props.b.answer)}>{props.b.title}</div>
        </>
    )
})

const Vereinszertifikate = component$(() => {
    return (
        <>
            <p>Vereinszertifikate</p>
            <input type="file" class="file-input file-input-bordered file-input-primary w-full max-w-xs" />
        </>
    )
})

export const Vereinsignup = component$((inputData: { data: Badge[] }) => {
    const position = useSignal(0);
    return (
        <>
            <div class="relative flex justify-center">
                <div class="card bg-base-300 rounded-box place-items-stretch m-8 p-8 space-y-4 [max-height:90dvh] w-1/3 min-w-fit ">
                    <h2 class="card-title">Verein Registrieren</h2>
                    <div class="overflow-y-auto space-y-4 ">
                        {
                            position.value === 0
                                ? <Vereinsdaten />
                                : position.value === 1
                                    ? <Vereinstags data={inputData.data} />
                                    : position.value === 2
                                        ? <Vereinszertifikate />
                                        : <Vereinsdaten />
                        }
                    </div>
                    <div class="inset-x-0 bottom-0 flex flex-col justify-center items-center gap-4">
                        <div class="join">
                            <button class="btn join-item" onClick$={() => (position.value > 0 ? position.value = position.value - 1 : position.value = position.value)}><HiChevronLeftOutline /></button>
                            <button class="btn btn-primary join-item" onClick$={() => (position.value < 3 ? position.value = position.value + 1 : position.value = position.value)}><HiChevronRightOutline /></button>
                        </div>
                        <ul class="steps">
                            <li class="step step-primary step-neutral">Daten</li>
                            <li class={`step step-neutral ${position.value > 0 ? "step-primary " : " "}`} >Tags</li>
                            <li class={`step step-neutral ${position.value > 1 ? "step-primary " : " "}`} >Zertifikate</li>
                            <li class={`step step-neutral ${position.value > 2 ? "step-primary " : " "}`} >Überprüfen</li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    )
})

/*<div class="flex justify-center">
                        <div class="join">
                            <button class="btn join-item" onClick$={() => (position.value > 0 ? position.value = position.value - 1 : position.value = position.value)}><HiChevronLeftOutline /></button>
                            <button class="btn join-item" onClick$={() => (position.value < 3 ? position.value = position.value + 1 : position.value = position.value)}><HiChevronRightOutline /></button>
                        </div>
                    </div>

                    */