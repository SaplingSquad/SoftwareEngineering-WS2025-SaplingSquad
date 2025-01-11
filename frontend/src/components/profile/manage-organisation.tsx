import { ClassList, component$, createContextId, Signal, useComputed$, useContext, useContextProvider, useSignal, useStore } from "@builder.io/qwik";
import { HiStarOutline, HiNoSymbolOutline, HiChevronRightOutline, HiChevronLeftOutline, HiInformationCircleOutline, HiPlusOutline, HiCalendarDaysOutline, HiUserGroupOutline, HiCog6ToothOutline, HiLinkOutline, HiBanknotesOutline, HiTrashOutline, HiTrashSolid } from "@qwikest/icons/heroicons";
import { MapLocationInput } from "./utils";
import { OrgaInformationsProps } from "./profile";
import { Form } from "@builder.io/qwik-city";

const FormDataContext = createContextId<OrgaInformationsProps>("verein-signup-context")

export type Badge = {
    title: string
    answer: boolean;
};

const answerStyles = new Map<boolean, string>([
    [false, ""],
    [true, "btn-primary"],
])


const Vereinsdaten = component$(() => {
    const context = useContext(FormDataContext)
    return (
        <>
            <div class="flex justify-start">
                <p>Vereinsdaten</p>
                <div class="text-xs mx-4">(* notwendig)</div>
            </div>
            <label class="input input-bordered flex items-center gap-2" >
                Vereinsname*
                <input type="text w-full" class="grow" placeholder="Mein Verein" required value={context.name} onInput$={(_, e) => context.name = e.value} />
            </label>
            <label class="input input-bordered flex items-center gap-2">
                Gründungsjahr
                <input type="text" class="grow" value={context.founding} onInput$={(_, e) => context.founding = parseInt(e.value)} pattern="[0-9][0-9][0-9][0-9]" required />
            </label>
            <label class="input input-bordered flex items-center gap-2">
                Mitgliederzahl
                <input type="text" class="grow" value={context.numbPers} onInput$={(_, e) => context.numbPers = parseInt(e.value)} />
            </label>
            <label class="input input-bordered flex items-center gap-2" >
                Vereinslogo
                <input type="text w-full" class="grow link link-neutral" value={context.logoUrl} onInput$={(_, e) => context.logoUrl = e.value} required />
                <div class="tooltip tooltip-warning tooltip-left" data-tip="Weblink zum Bild">
                    <div class="text-2xl hover:opacity-70 transition-all">
                        <HiInformationCircleOutline />
                    </div>
                </div>
            </label>
            <label class="input input-bordered flex items-center gap-2">
                Vereinswebsite
                <input type="text" class="grow  link link-neutral" value={context.webpageUrl} onInput$={(_, e) => context.webpageUrl = e.value} />
            </label>
            <label class="input input-bordered flex items-center gap-2">
                Spendenseite
                <input type="text" class="grow  link link-neutral" value={context.donatePageUrl} onInput$={(_, e) => context.donatePageUrl = e.value} />
            </label>
            <label class="form-control">
                <div class="label">
                    <span class="label-text">Vereinsbeschreibung</span>
                </div>
                <textarea class="textarea textarea-bordered h-24" placeholder="Beschreibung" value={context.description} onInput$={(_, e) => context.description = e.value}></textarea>
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
                <div class="card card-compact bg-base-100 shadow-xl">
                    <figure class="rounded-2xl">
                        <div id="map"></div>
                        <MapLocationInput class="h-[30rem] w-[40rem]" location={context.location} drgbl={true} />
                    </figure>
                </div>
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

const ImageStack = component$(() => {
    const context = useContext(FormDataContext)
    const inputRef = useSignal<HTMLInputElement>()
    const inputValue = useSignal("")
    return (
        <>
            <p>Bilder</p>
            <div class="flex justify-between">
                <label class="input input-bordered flex items-center gap-2 w-full mr-4">
                    <input type="text" class="grow w-full link link-neutral" value={inputValue.value} ref={inputRef} onInput$={(_, e) => inputValue.value = e.value} />
                    <div class="tooltip tooltip-warning tooltip-left" data-tip="Weblink zum Bild">
                        <div class="text-2xl hover:opacity-70 transition-all">
                            <HiInformationCircleOutline />
                        </div>
                    </div>
                </label>
                <button class="btn btn-primary" onClick$={() => { if (inputRef.value?.value) { context.imageUrls.push(inputRef.value?.value); inputValue.value = "" } }}>
                    <div class="text-2xl hover:opacity-70 transition-all">
                        <HiPlusOutline />
                    </div>
                </button>
            </div>

            <div class="grid grid-cols-3 gap-4">
                {
                    context.imageUrls.slice().reverse().map((e, i) =>
                    (
                        <ImagePreview imgUrl={e} key={i} clz="" />
                    )
                    )
                }
            </div>
        </>
    )
})

const ImagePreview = component$((inputData: { imgUrl: string, key: number, clz: ClassList }) => {
    const context = useContext(FormDataContext);
    return (
        <>
            <div key={inputData.key + "imageStackOrgaAcc"} class={inputData.clz + " relative"}>
                <div class="btn btn-circle btn-sm glass absolute top-0 left-0 text-error text-xl" onClick$={() => context.imageUrls = context.imageUrls.filter((e, i) => inputData.imgUrl !== e)}>
                    <HiTrashSolid />
                </div>
                <img
                    class="rounded-xl max-w-60 max-h-60 shadow-xl"
                    src={inputData.imgUrl}
                />
            </div>
        </>
    )
})

const Overview = component$(() => {
    const context = useContext(FormDataContext)
    return (
        <>
            <div class="card bg-base-100 shadow-xl w-full p-4 space-y-4">
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

                <div class="stats bg-neutral text-primary shadow">
                    <div class="stat">
                        <div class="stat-figure text-secondary text-3xl">
                            <HiCalendarDaysOutline />
                        </div>
                        <div class="stat-title">Gründungsjahr</div>
                        <div class="stat-value">{context.founding}</div>
                    </div>
                    <div class="stat">
                        <div class="stat-figure text-secondary text-3xl">
                            <HiUserGroupOutline />
                        </div>
                        <div class="stat-title">Mitglieder</div>
                        <div class="stat-value">{context.numbPers}</div>
                    </div>
                </div>
                <div class="card bg-neutral text-neutral-content w-full p-4">
                    {context.description}
                </div>
                <div class="carousel carousel-center bg-neutral rounded-box w-full space-x-4 p-4">
                    {
                        context.imageUrls.map((e, i) =>
                        (
                            <ImagePreview imgUrl={e} key={i} clz="carousel-item" />
                        )
                        )
                    }
                </div>
                <div class="card card-compact bg-base-100 shadow-xl">
                    <figure class="rounded-2xl">
                        <div id="map"></div>
                        <MapLocationInput class="h-[30rem] w-[40rem]" location={context.location} />
                    </figure>
                </div>
            </div>
        </>
    )
}

)

export const Vereinsignup = component$((inputData: { data: Badge[] }) => {
    const orgaData: OrgaInformationsProps = {
        name: "New Roots",
        description: "Der New Roots e.V. ist eine Initiative von Freunden aus München, die sich gemeinsam der Herausforderung verschrieben haben, bedürftigen Menschen zu helfen. Unser gemeinnütziger Verein wurde mit dem klaren Ziel gegründet, Kindern in Kenia ein sicheres Zuhause zu bieten, regelmäßige Mahlzeiten zu gewährleisten und ihnen den Zugang zu Bildung zu ermöglichen.",
        location: { lng: 20, lat: 20 },
        numbPers: 12,
        founding: 2016,
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
        numbPers: 0,
        founding: 0,
        logoUrl: "",
        imageUrls: [],
        webpageUrl: "",
        donatePageUrl: ""
    }
    const position = useSignal(2);
    const store = useStore<OrgaInformationsProps>(orgaData)
    useContextProvider(FormDataContext, store)
    return (
        <>
            <div class="relative flex justify-center">
                <div class="card bg-base-300 rounded-box place-items-stretch m-8 p-8 space-y-4 [max-height:90dvh] w-full lg:w-1/3">
                    <h2 class="card-title">Verein verwalten</h2>
                    <div class="overflow-y-auto space-y-4 ">
                        {position.value === 0 && <Vereinsdaten />}
                        {position.value === 1 && <Vereinstags data={inputData.data} />}
                        {position.value === 2 && <ImageStack />}
                        {position.value === 3 && <Overview />}
                    </div>
                    <div class="inset-x-0 bottom-0 flex flex-col justify-center items-center gap-4">
                        {
                            position.value === 3 ?
                                <>
                                    <div class="justify-between space-x-16">
                                        <button class="btn btn-secondary" onClick$={() => (
                                            position.value = 0
                                        )}>Weiter bearbeiten
                                            <div class="text-2xl">
                                                <HiCog6ToothOutline />
                                            </div>
                                        </button>
                                        <a href="../" class="btn btn-primary">Absenden
                                        </a>
                                    </div>
                                </>
                                :
                                <div class="join">
                                    <button class="btn join-item" onClick$={() => (
                                        position.value = Math.max(0, position.value - 1)
                                    )}>
                                        <div class="text-2xl">
                                            <HiChevronLeftOutline />
                                        </div>
                                    </button>
                                    <button class="btn btn-primary join-item" onClick$={() => (
                                        position.value = Math.min(3, position.value + 1)
                                    )}>
                                        <div class="text-2xl">
                                            <HiChevronRightOutline />
                                        </div>
                                    </button>
                                </div>
                        }
                        <ul class="steps">
                            <li class="step step-primary step-neutral">Daten</li>
                            <li class={`step step-neutral ${position.value > 0 ? "step-primary " : " "}`} >Tags</li>
                            <li class={`step step-neutral ${position.value > 1 ? "step-primary " : " "}`} >Bilder</li>
                            <li class={`step step-neutral ${position.value > 2 ? "step-primary " : " "}`} >Überprüfen</li>
                        </ul>
                    </div>
                </div>
            </div >
        </>
    )
})