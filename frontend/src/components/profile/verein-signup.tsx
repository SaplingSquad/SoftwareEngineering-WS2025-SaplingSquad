import { component$, Signal, useComputed$, useSignal, useStore } from "@builder.io/qwik";
import { HiStarOutline, HiNoSymbolOutline, HiChevronRightOutline, HiChevronLeftOutline, HiInformationCircleOutline } from "@qwikest/icons/heroicons";
import { MapLocationInput } from "./utils";
import { OrgaInformationsProps } from "./profile";

export type Badge = {
    title: string
    answer: boolean;
};

const answerStyles = new Map<boolean, string>([
    [false, ""],
    [true, "btn-primary"],
])


const Vereinsdaten = component$((inputData: { orgaInfo: OrgaInformationsProps }) => {
    return (
        <>
            <div class="flex justify-start">
                <p>Vereinsdaten</p>
                <div class="text-xs mx-4">(* notwendig)</div>
            </div>
            <label class="input input-bordered flex items-center gap-2" >
                Vereinsname*
                <input type="text w-full" class="grow" placeholder="Mein Verein" value={inputData.orgaInfo.name} id="orgaCname" required />
            </label>
            <label class="input input-bordered flex items-center gap-2">
                Gründungsjahr
                <input type="text" class="grow" value={inputData.orgaInfo.founding === 0 ? "" : inputData.orgaInfo.founding as number} id="orgaCfound" pattern="[0-9][0-9][0-9][0-9]" required />
            </label>
            <label class="input input-bordered flex items-center gap-2">
                Mitgliederzahl
                <input type="text" class="grow" value={inputData.orgaInfo.numbPers === 0 ? "" : inputData.orgaInfo.numbPers as number} id="orgaCpers" />
            </label>
            <label class="input input-bordered flex items-center gap-2" >
                Vereinslogo
                <input type="text w-full" class="grow link link-neutral" value={inputData.orgaInfo.name} id="orgaClogo" required />
                <div class="tooltip tooltip-warning tooltip-left" data-tip="Weblink zum Bild">
                    <div class="text-2xl hover:opacity-70 transition-all">
                        <HiInformationCircleOutline />
                    </div>
                </div>
            </label>
            <label class="input input-bordered flex items-center gap-2">
                Vereinswebsite
                <input type="text" class="grow  link link-neutral" value={inputData.orgaInfo.webpageUrl} id="orgaCurl" />
            </label>
            <label class="input input-bordered flex items-center gap-2">
                Spendenseite
                <input type="text" class="grow  link link-neutral" value={inputData.orgaInfo.donatePageUrl} id="orgaCdonurl" />
            </label>
            <label class="form-control">
                <div class="label">
                    <span class="label-text">Vereinsbeschreibung</span>
                </div>
                <textarea class="textarea textarea-bordered h-24" placeholder="Beschreibung" value={inputData.orgaInfo.description} id="orgaCdiscr"></textarea>
            </label>
            <label class="form-control">
                <div class="label">
                    <span class="label-text">Vereinsstandort*</span>
                    <div class="tooltip tooltip-warning tooltip-left" data-tip="Marker auf Position ziehen">
                        <div class="text-2xl hover:opacity-70 transition-all">
                            <HiInformationCircleOutline />
                        </div>
                    </div>
                </div>
                <div class="rounded">
                    <div class="card card-compact bg-base-100 shadow-xl">
                        <figure>
                            <div id="map"></div>
                            <MapLocationInput class="h-[30rem] w-[40rem] rounded-2xl" location={inputData.orgaInfo.location} />
                        </figure>
                    </div>

                </div>
            </label>
        </>
    )
})

function saveOrgaInformation(orgaInfo: OrgaInformationsProps) {
    orgaInfo.name = (document.getElementById("orgaCname") as HTMLInputElement).value
    orgaInfo.founding = (((document.getElementById("orgaCfound") as HTMLInputElement).value as unknown) as number)
    orgaInfo.numbPers = (((document.getElementById("orgaCpers") as HTMLInputElement).value as unknown) as number)
    orgaInfo.webpageUrl = (document.getElementById("orgaCurl") as HTMLInputElement).value
    orgaInfo.donatePageUrl = (document.getElementById("orgaCdonurl") as HTMLInputElement).value
    orgaInfo.description = (document.getElementById("orgaCdiscr") as HTMLInputElement).value
    orgaInfo.logoUrl = (document.getElementById("orgaClogo") as HTMLInputElement).value
}

function positionController(pos: Signal<number>, orgaInput: OrgaInformationsProps) {
    if (pos.value === 0) {
        pos.value = 1
        saveOrgaInformation(orgaInput)
    } else {
        pos.value === 1 ?
            pos.value = 2
            : pos.value = 3
    }
    console.log(pos)
}

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

const ImageStack = component$(() => {
    return (
        <>
            <p>Vereinszertifikate</p>
            <input type="file" class="file-input file-input-bordered file-input-primary w-full max-w-xs" />
        </>
    )
})

export const Vereinsignup = component$((inputData: { data: Badge[] }) => {
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
    const orgaDataStore = useStore(orgaDataEmpty)
    const position = useSignal(0);
    return (
        <>
            <div class="relative flex justify-center">
                <div class="card bg-base-300 rounded-box place-items-stretch m-8 p-8 space-y-4 [max-height:90dvh] w-1/3 min-w-fit ">
                    <h2 class="card-title">Verein Registrieren</h2>
                    <div class="overflow-y-auto space-y-4 ">
                        {position.value === 0 && <Vereinsdaten orgaInfo={orgaDataStore} />}
                        {position.value === 1 && <Vereinstags data={inputData.data} />}
                        {position.value === 2 && <ImageStack />}
                        {position.value === 3 && <Vereinsdaten orgaInfo={orgaDataStore} />}
                    </div>
                    <div class="inset-x-0 bottom-0 flex flex-col justify-center items-center gap-4">
                        <div class="join">
                            <button class="btn join-item" onClick$={() => (
                                position.value = Math.max(0, position.value - 1)
                            )}><HiChevronLeftOutline /></button>
                            <button class="btn btn-primary join-item" onClick$={() => (
                                positionController(position, orgaDataStore)
                            )}><HiChevronRightOutline /></button>
                        </div>
                        <ul class="steps">
                            <li class="step step-primary step-neutral">Daten</li>
                            <li class={`step step-neutral ${position.value > 0 ? "step-primary " : " "}`} >Tags</li>
                            <li class={`step step-neutral ${position.value > 1 ? "step-primary " : " "}`} >Zertifikate</li>
                            <li class={`step step-neutral ${position.value > 2 ? "step-primary " : " "}`} >Überprüfen</li>
                        </ul>
                    </div>
                </div>
            </div >
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