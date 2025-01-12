import { ClassList, component$, createContextId, JSXOutput, Signal, useComputed$, useContext, useContextProvider, useSignal, useStore } from "@builder.io/qwik";
import { HiStarOutline, HiNoSymbolOutline, HiChevronRightOutline, HiChevronLeftOutline, HiInformationCircleOutline, HiPlusOutline, HiCalendarDaysOutline, HiUserGroupOutline, HiCog6ToothOutline, HiLinkOutline, HiBanknotesOutline, HiTrashOutline, HiTrashSolid } from "@qwikest/icons/heroicons";
import { MapLocationInput } from "./utils";
import { OrgaInformationsProps, ProjectInformationProps } from "./profile";
import { Form } from "@builder.io/qwik-city";

const FormDataContext = createContextId<ProjectInformationProps>("project-context")

export type Badge = {
    title: string
    answer: boolean;
};

const answerStyles = new Map<boolean, string>([
    [false, ""],
    [true, "btn-primary"],
])

const ChooseOption = component$((inputData: { index: number }) => {
    return (
        <>
            <option>{inputData.index}</option>
        </>
    )
})

const Vereinsdaten = component$(() => {
    const context = useContext(FormDataContext)
    return (
        <>
            <div class="flex justify-start">
                <p>Projektdaten</p>
                <div class="text-xs mx-4">(* notwendig)</div>
            </div>
            <label class="input input-bordered flex items-center gap-2" >
                Projektname*
                <input type="text w-full" class="grow" placeholder="Mein Verein" required value={context.name} onInput$={(_, e) => context.name = e.value} />
            </label>
            <label class="input input-bordered flex items-center gap-2">
                Projektwebseite
                <input type="text" class="grow link link-neutral" placeholder="www.mein-verein.de" value={context.webpageUrl} onInput$={(_, e) => context.webpageUrl = e.value} />
            </label>
            <label class="input input-bordered flex items-center gap-2">
                Projektspendenseite
                <input type="text" class="grow  link link-neutral" placeholder="www.mein-verein.de/donate" value={context.donatePageUrl} onInput$={(_, e) => context.donatePageUrl = e.value} />
            </label>
            <div class="flex justify-start gap-8">
                <div>
                    <label class="form-control w-1/5">
                        <div class="label">
                            <span class="label-text">Projektbeginn</span>
                        </div>
                        <div class="flex">
                            <select class="select select-bordered select-sm text-xl" onInput$={(_, e) => { context.dateFrom.mnth = parseInt(e.value) }}>
                                {context.dateFrom.mnth === 0 ?
                                    <option disabled selected>Monat</option>
                                    :
                                    <option disabled selected>{context.dateFrom.mnth}</option>
                                }
                                {Array.from(Array(12).keys()).map((e, i) =>
                                    <ChooseOption index={e + 1} />)
                                }
                            </select>
                            <p class="text-xl">/</p>
                            <select class="select select-bordered select-sm text-xl" onInput$={(_, e) => { context.dateFrom.year = parseInt(e.value) }}>
                                {context.dateFrom.year === 0 ?
                                    <option disabled selected>Jahr</option>
                                    :
                                    <option disabled selected>{context.dateFrom.year}</option>
                                }
                                {Array.from(Array(101).keys()).map((e, i) =>
                                    <ChooseOption index={e + 1975} />)
                                }
                            </select>
                        </div>
                    </label>
                </div>
                <div>
                    <label class="form-control w-1/5">
                        <div class="label">
                            <span class="label-text">Projektende</span>
                        </div>
                        <div class="flex">
                            <select class="select select-bordered select-sm text-xl" onInput$={(_, e) => { context.dateTo.mnth = parseInt(e.value) }}>
                                {context.dateTo.mnth === 0 ?
                                    <option disabled selected>Monat</option>
                                    :
                                    <option disabled selected>{context.dateTo.mnth}</option>
                                }
                                {Array.from(Array(12).keys()).map((e, i) =>
                                    <ChooseOption index={e + 1} />)
                                }
                            </select>
                            <p class="text-xl">/</p>
                            <select class="select select-bordered select-sm text-xl" onInput$={(_, e) => { context.dateTo.year = parseInt(e.value) }}>
                                {context.dateTo.year === 0 ?
                                    <option disabled selected>Jahr</option>
                                    :
                                    <option disabled selected>{context.dateTo.year}</option>
                                }
                                {Array.from(Array(101).keys()).map((e, i) =>
                                    <ChooseOption index={e + 1975} />)
                                }
                            </select>
                        </div>
                    </label>
                </div>
            </div>
            <label class="form-control">
                <div class="label">
                    <span class="label-text">Projektbeschreibung</span>
                </div>
                <textarea class="textarea textarea-bordered h-24" placeholder="Beschreibung" value={context.description} onInput$={(_, e) => context.description = e.value}></textarea>
            </label>
            <label class="form-control">
                <div class="label">
                    <span class="label-text">Projektstandort*</span>
                    <div class="tooltip tooltip-warning tooltip-left" data-tip="Marker durch ziehen oder klicken positionieren">
                        <div class="text-2xl hover:opacity-70 transition-all">
                            <HiInformationCircleOutline />
                        </div>
                    </div>
                </div>
                <div class="card card-compact bg-base-100 shadow-xl w-full">
                    <figure class="rounded-2xl w-full">
                        <MapLocationInput class="h-[30rem] w-full test" location={context.location} drgbl={true} />
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
                    <input type="text" class="grow w-full link link-neutral" placeholder="www.mein-verein.de/image1.img" value={inputValue.value} ref={inputRef} onInput$={(_, e) => inputValue.value = e.value} />
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
                        <ImagePreview imgUrl={e} key={i} clz="relative" delButton={true} />
                    )
                    )
                }
            </div>
        </>
    )
})

const ImagePreview = component$((inputData: { imgUrl: string, key: number, clz: ClassList, delButton: boolean }) => {
    const context = useContext(FormDataContext);
    return (
        <>
            <div key={inputData.key + "imageStackOrgaAcc"} class={inputData.clz}>
                {inputData.delButton &&
                    <div class="btn btn-square scale-[0.75] btn-error absolute -top-3 -left-3 text-error-content text-2xl shadow-xl" onClick$={() => context.imageUrls = context.imageUrls.filter((e, i) => inputData.imgUrl !== e)}>
                        <HiTrashSolid />
                    </div>
                }
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
                        <div class="stat-title">Seit</div>
                        <div class="stat-value">{context.dateFrom.mnth}-{context.dateFrom.year}</div>
                    </div>
                    <div class="stat">
                        <div class="stat-figure text-secondary text-3xl">
                            <HiUserGroupOutline />
                        </div>
                        <div class="stat-title">Geplant bis</div>
                        <div class="stat-value">{context.dateTo.mnth}-{context.dateTo.year}</div>
                    </div>
                </div>
                <div class="card bg-neutral text-neutral-content w-full p-4">
                    {context.description}
                </div>
                <div class="carousel carousel-center bg-neutral rounded-box w-full space-x-4 p-4">
                    {
                        context.imageUrls.map((e, i) =>
                        (
                            <ImagePreview imgUrl={e} key={i} clz="carousel-item" delButton={false} />
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

export const ProjectCreation = component$(() => {
    const projectData = {
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
    }
    const position = useSignal(0);
    const store = useStore<ProjectInformationProps>(projectData)
    useContextProvider(FormDataContext, store)
    return (
        <>
            <div class="relative flex justify-center">
                <div class="card bg-base-300 rounded-box place-items-stretch m-4 px-4 py-8 space-y-4 [max-height:90dvh] w-full lg:w-1/3">
                    <h2 class="card-title px-4">Projekt verwalten</h2>
                    <div class="overflow-y-auto space-y-4 px-4">
                        {position.value === 0 && <Vereinsdaten />}
                        {/*position.value === 1 && <Vereinstags data={inputData.data} />*/}
                        {position.value === 2 && <ImageStack />}
                        {position.value === 3 && <Overview />}
                    </div>
                    <div class="bottom-0 flex flex-col justify-center items-center gap-4">
                        {
                            position.value === 3 ?
                                <>
                                    <div class="justify-between space-x-16">
                                        <button class="btn btn-secondary" onClick$={() => (
                                            position.value = 0
                                        )}>Bearbeiten
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
                            <li class="step step-primary cursor-pointer step-neutral" onClick$={() => position.value = 0}>Daten</li>
                            <li class={`step step-neutral cursor-pointer ${position.value > 0 ? "step-primary " : " "}`} onClick$={() => position.value = 1} >Tags</li>
                            <li class={`step step-neutral cursor-pointer ${position.value > 1 ? "step-primary " : " "}`} onClick$={() => position.value = 2}>Bilder</li>
                            <li class={`step step-neutral cursor-pointer ${position.value > 2 ? "step-primary " : " "}`} onClick$={() => position.value = 3}>Überprüfen</li>
                        </ul>
                    </div>
                </div>
            </div >
        </>
    )
})