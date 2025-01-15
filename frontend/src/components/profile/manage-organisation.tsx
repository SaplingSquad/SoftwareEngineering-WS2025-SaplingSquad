import { ClassList, component$, createContextId, Resource, Signal, useComputed$, useContext, useContextProvider, useSignal, useStore } from "@builder.io/qwik";
import { HiStarOutline, HiNoSymbolOutline, HiChevronRightOutline, HiChevronLeftOutline, HiInformationCircleOutline, HiPlusOutline, HiCalendarDaysOutline, HiUserGroupOutline, HiCog6ToothOutline, HiLinkOutline, HiBanknotesOutline, HiTrashOutline, HiTrashSolid } from "@qwikest/icons/heroicons";
import { MapLocationInput } from "./utils";
import { ApiRelevantOrganisationInformations, convertAPITypeToInternalType, OrgaInformationsProps } from "./profile";
import { Form } from "@builder.io/qwik-city";
import { useGetTags, usePostOrganization, usePutOrganization } from "~/api/api_hooks.gen";
import { ApiResponse } from "../api";

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
                <input type="text" class="grow" placeholder="2010" value={context.founding} onInput$={(_, e) => context.founding = e.value} pattern="[0-9][0-9][0-9][0-9]" required />
            </label>
            <label class="input input-bordered flex items-center gap-2">
                Mitgliederzahl
                <input type="text" class="grow" value={context.numbPers} onInput$={(_, e) => context.numbPers = e.value} />
            </label>
            <label class="input input-bordered flex items-center gap-2" >
                Vereinslogo*
                <input type="text w-full" class="grow link link-neutral" placeholder="www.mein-verein.de/logo.img" value={context.logoUrl} onInput$={(_, e) => context.logoUrl = e.value} required />
                <div class="tooltip tooltip-warning tooltip-left" data-tip="Weblink zum Bild">
                    <div class="text-2xl hover:opacity-70 transition-all">
                        <HiInformationCircleOutline />
                    </div>
                </div>
            </label>
            <label class="input input-bordered flex items-center gap-2">
                Vereinswebsite*
                <input type="text" class="grow link link-neutral" placeholder="www.mein-verein.de" value={context.webpageUrl} onInput$={(_, e) => context.webpageUrl = e.value} />
            </label>
            <label class="input input-bordered flex items-center gap-2">
                Spendenseite
                <input type="text" class="grow  link link-neutral" placeholder="www.mein-verein.de/donate" value={context.donatePageUrl} onInput$={(_, e) => context.donatePageUrl = e.value} />
            </label>
            <label class="form-control">
                <div class="label">
                    <span class="label-text">Vereinsbeschreibung*</span>
                </div>
                <textarea class="textarea textarea-bordered h-24" placeholder="Beschreibung" value={context.description} onInput$={(_, e) => context.description = e.value}></textarea>
            </label>
            <label class="form-control">
                <div class="label">
                    <span class="label-text">Vereinsstandort*</span>
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

const Vereinstags = component$((inputData: { tags: { id: number, name: string }[] }) => {
    const context = useContext(FormDataContext)
    return (
        <>
            <p>Vereinstags</p>
            <div class="flex flex-wrap justify-around grid-cols-3 grid gap-4  mb-6">
                {inputData.tags.map((item, idx: number) => (
                    <SingleVereinstag key={idx} tag={item} />
                ))}
            </div>
        </>
    )
})

const SingleVereinstag = component$((prop: { tag: { id: number, name: string } }) => {
    const context = useContext(FormDataContext)
    const isCurrSel = context.tags.includes(prop.tag.id)
    return (
        <>
            <div class={"btn btn-sm " + answerStyles.get(isCurrSel)} onClick$={() => {
                { isCurrSel && (context.tags = context.tags.filter((e, i) => e !== prop.tag.id)) };
                { !isCurrSel && (context.tags.push(prop.tag.id)) }
            }
            }>{prop.tag.name}</div>
        </>
    )
})

export const ImageStack = component$(() => {
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

export const ImagePreview = component$((inputData: { imgUrl: string, key: number, clz: ClassList, delButton: boolean }) => {
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
                    class="rounded-xl max-w-56 max-h-60 shadow-xl"
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

function convertInternalTypeToAPIType(interalOut: OrgaInformationsProps): ApiRelevantOrganisationInformations {
    console.log(interalOut.logoUrl)
    return {
        name: interalOut.name,
        description: interalOut.description,
        coordinates: [interalOut.location.lng, interalOut.location.lat],
        memberCount: interalOut.numbPers === '' ? undefined : parseInt(interalOut.numbPers),
        foundingYear: interalOut.founding === '' ? undefined : parseInt(interalOut.founding),
        iconUrl: interalOut.logoUrl,
        imageUrls: interalOut.imageUrls.length === 0 ? undefined : interalOut.imageUrls,
        webPageUrl: interalOut.webpageUrl,
        donatePageUrl: interalOut.donatePageUrl === '' ? undefined : interalOut.donatePageUrl,
        tags: interalOut.tags,
        regionName: ''
    }
}

const SendFormAsNew = component$(() => {
    const context = useContext(FormDataContext)
    const updateOrgApiCall = usePostOrganization(convertInternalTypeToAPIType(context))
    return (
        <>
            <Resource value={updateOrgApiCall}
                onResolved={(response) => <ApiResponse
                    response={response}
                    on201$={(r) =>
                        <div class="flex justify-center p-32">
                            <div class="card bg-base-100 w-96 shadow-xl">
                                <div class="card-body items-center text-center">
                                    <h2 class="card-title">Erfolgreich abgesendet!</h2>
                                    <div class="card-actions">
                                        <a href="/profile" class="btn btn-primary">Zurück zum Profil</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                    defaultError$={(r) =>
                        <div class="flex justify-center p-32">
                            <div class="card bg-base-100 w-96 shadow-xl">
                                <div class="card-body items-center text-center">
                                    <h2 class="card-title">Ein unerwarteter Fehler ist aufgetreten!</h2>
                                    <p>Bitte später erneut versuchen.</p>
                                    <p>Fehlercode: {r}</p>
                                    <div class="card-actions">
                                        <a href="/profile" class="btn btn-primary">Zurück zum Profil</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                />} />
        </>
    )
})

const SendFormAsEdit = component$(() => {
    const context = useContext(FormDataContext)
    const updateOrgApiCall = usePutOrganization(convertInternalTypeToAPIType(context))
    return (
        <>
            <Resource value={updateOrgApiCall}
                onResolved={(response) => <ApiResponse
                    response={response}
                    on204$={(r) =>
                        <div class="flex justify-center p-32">
                            <div class="card bg-base-100 w-96 shadow-xl">
                                <div class="card-body items-center text-center">
                                    <h2 class="card-title">Erfolgreich editiert!</h2>
                                    <div class="card-actions">
                                        <a href="/profile" class="btn btn-primary">Zurück zum Profil</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                    defaultError$={(r) =>
                        <div class="flex justify-center p-32">
                            <div class="card bg-base-100 w-96 shadow-xl">
                                <div class="card-body items-center text-center">
                                    <h2 class="card-title">Ein unerwarteter Fehler ist aufgetreten!</h2>
                                    <p>Bitte versuchen Sie es später erneut.</p>
                                    <p>Fehlercode: {r}</p>
                                    <div class="card-actions">
                                        <a href="/profile" class="btn btn-primary">Zurück zum Profil</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                />} />
        </>
    )
})

export const Vereinsignup = component$((inputData: { orgaData: ApiRelevantOrganisationInformations, tags: { id: number, name: string }[] }) => {

    const isNew = inputData.orgaData.name === ""

    const orgaDataTransfer: OrgaInformationsProps = convertAPITypeToInternalType(inputData.orgaData);

    const position = useSignal(0);
    const store = useStore<OrgaInformationsProps>(orgaDataTransfer)

    const tagsNameMapping = inputData.tags

    useContextProvider(FormDataContext, store)

    return (
        <>
            <div class="relative flex justify-center">
                <div class="card bg-base-300 rounded-box place-items-stretch m-4 px-4 py-8 space-y-4 h-fit w-full max-w-screen-md">
                    <h2 class="card-title px-4">{isNew ? "Verein erstellen" : "Verein verwalten"}</h2>
                    <div class="space-y-4 px-4">
                        {position.value === 0 && <Vereinsdaten />}
                        {position.value === 1 && <Vereinstags tags={tagsNameMapping} />}
                        {position.value === 2 && <ImageStack />}
                        {position.value === 3 && <Overview />}
                        {position.value === 4 && isNew && <SendFormAsNew />}
                        {position.value === 4 && !isNew && <SendFormAsEdit />}
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
                                        <button class="btn btn-primary" onClick$={() => {
                                            position.value = 4
                                        }}>Absenden
                                        </button>
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