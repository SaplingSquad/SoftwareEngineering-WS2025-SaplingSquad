import {
  component$,
  createContextId,
  Resource,
  useContext,
  useContextProvider,
  useSignal,
  useStore,
} from "@builder.io/qwik";
import type { ClassList } from "@builder.io/qwik";
import {
  HiChevronRightOutline,
  HiChevronLeftOutline,
  HiInformationCircleOutline,
  HiPlusOutline,
  HiCalendarDaysOutline,
  HiCog6ToothOutline,
  HiLinkOutline,
  HiBanknotesOutline,
  HiTrashSolid,
} from "@qwikest/icons/heroicons";
import { MapLocationInput } from "./utils";
import { ApiResponse } from "../api";
import { usePostProject, usePutProject } from "~/api/api_hooks.gen";
import { convertAPITypeToInternalProjectType } from "./profile";
import type {
  ProjectInformationProps,
  ApiRelevantProjectInformations,
} from "./types";
import { FormInputMissing } from "./manage-organisation";
import { Link } from "@builder.io/qwik-city";

const FormDataContext =
  createContextId<ProjectInformationProps>("project-context");

const answerStyles = new Map<boolean, string>([
  [false, "btn-outline"],
  [true, "btn-primary"],
]);

const ChooseOption = component$((inputData: { index: number }) => {
  return <option>{inputData.index.toString()}</option>;
});

const Projektdaten = component$(() => {
  const context = useContext(FormDataContext);
  return (
    <>
      <div class="flex justify-start">
        <p>Projektdaten</p>
        <div class="mx-4 text-xs">(* notwendig)</div>
      </div>
      <label class="input input-bordered flex items-center gap-2">
        Projektname*
        <input
          type="text w-full"
          class="grow"
          placeholder="Mein Projekt"
          required
          value={context.name}
          onInput$={(_, e) => (context.name = e.value)}
        />
      </label>
      <label class="input input-bordered flex items-center gap-2">
        Projekticon*
        <input
          type="text w-full"
          class="link link-neutral grow"
          placeholder="www.mein-verein.de/mein-projekt/icon.jpg"
          required
          value={context.logoUrl}
          onInput$={(_, e) => (context.logoUrl = e.value)}
        />
      </label>
      <label class="input input-bordered flex items-center gap-2">
        Projektwebseite
        <input
          type="text"
          class="link link-neutral grow"
          placeholder="www.mein-verein.de/mein-projekt"
          value={context.webpageUrl}
          onInput$={(_, e) => (context.webpageUrl = e.value)}
        />
      </label>
      <label class="input input-bordered flex items-center gap-2">
        Projektspendenseite
        <input
          type="text"
          class="link  link-neutral grow"
          placeholder="www.mein-verein.de/mein-projekt/donate"
          value={context.donatePageUrl}
          onInput$={(_, e) => (context.donatePageUrl = e.value)}
        />
      </label>
      <div class="flex justify-start gap-8">
        <div>
          <label class="form-control w-1/5">
            <div class="label">
              <span class="label-text">Projektbeginn</span>
            </div>
            <div class="flex">
              <select
                class="select select-bordered select-sm text-xl"
                onInput$={(_, e) => {
                  context.dateFrom.mnth = e.value;
                }}
              >
                {context.dateFrom.mnth === "--" ? (
                  <option disabled selected>
                    Monat
                  </option>
                ) : (
                  <option disabled selected>
                    {context.dateFrom.mnth}
                  </option>
                )}
                <option>--</option>
                {Array.from(Array(12).keys()).map((e) => (
                  <ChooseOption index={e + 1} />
                ))}
              </select>
              <p class="text-xl">/</p>
              <select
                class="select select-bordered select-sm text-xl"
                onInput$={(_, e) => {
                  context.dateFrom.year = e.value;
                }}
              >
                {context.dateFrom.year === "--" ? (
                  <option disabled selected>
                    Jahr
                  </option>
                ) : (
                  <option disabled selected>
                    {context.dateFrom.year}
                  </option>
                )}
                <option>--</option>
                {Array.from(Array(101).keys()).map((e) => (
                  <ChooseOption index={e + 1975} />
                ))}
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
              <select
                class="select select-bordered select-sm text-xl"
                onInput$={(_, e) => {
                  context.dateTo.mnth = e.value;
                }}
              >
                {context.dateTo.mnth === "--" ? (
                  <option disabled selected>
                    Monat
                  </option>
                ) : (
                  <option disabled selected>
                    {context.dateTo.mnth}
                  </option>
                )}
                <option>--</option>
                {Array.from(Array(12).keys()).map((e) => (
                  <ChooseOption index={e + 1} />
                ))}
              </select>
              <p class="text-xl">/</p>
              <select
                class="select select-bordered select-sm text-xl"
                onInput$={(_, e) => {
                  context.dateTo.year = e.value;
                }}
              >
                {context.dateTo.year === "--" ? (
                  <option disabled selected>
                    Jahr
                  </option>
                ) : (
                  <option disabled selected>
                    {context.dateTo.year}
                  </option>
                )}
                <option>--</option>
                {Array.from(Array(101).keys()).map((e) => (
                  <ChooseOption index={e + 1975} />
                ))}
              </select>
            </div>
          </label>
        </div>
      </div>
      <label class="form-control">
        <div class="label">
          <span class="label-text">Projektbeschreibung*</span>
        </div>
        <textarea
          class="textarea textarea-bordered h-24"
          placeholder="Beschreibung"
          value={context.description}
          onInput$={(_, e) => (context.description = e.value)}
        ></textarea>
      </label>
      <label class="form-control">
        <div class="label">
          <span class="label-text">Projektstandort*</span>
          <div
            class="tooltip tooltip-left tooltip-warning"
            data-tip="Marker durch ziehen oder klicken positionieren"
          >
            <div class="text-2xl transition-all hover:opacity-70">
              <HiInformationCircleOutline />
            </div>
          </div>
        </div>
        <div class="card card-compact w-full bg-base-100 shadow-xl">
          <figure class="w-full rounded-2xl">
            <MapLocationInput
              class="test h-[30rem] w-full"
              location={context.location}
              drgbl={true}
            />
          </figure>
        </div>
      </label>
    </>
  );
});

const Projekttags = component$(
  (inputData: { tags: { id: number; name: string }[] }) => {
    return (
      <>
        <p>Projekttags</p>
        <div class="mb-6 flex grid grid-cols-3 flex-wrap justify-around  gap-4">
          {inputData.tags.map((item, idx: number) => (
            <SingleProjekttag key={idx} tag={item} />
          ))}
        </div>
      </>
    );
  },
);

const SingleProjekttag = component$(
  (prop: { tag: { id: number; name: string } }) => {
    const context = useContext(FormDataContext);
    const isCurrSel = context.tags.includes(prop.tag.id);
    return (
      <div
        class={"btn btn-sm " + answerStyles.get(isCurrSel)}
        onClick$={() => {
          {
            isCurrSel &&
              (context.tags = context.tags.filter((e) => e !== prop.tag.id));
          }
          {
            !isCurrSel && context.tags.push(prop.tag.id);
          }
        }}
      >
        {prop.tag.name}
      </div>
    );
  },
);

const ImageStack = component$(() => {
  const context = useContext(FormDataContext);
  const inputRef = useSignal<HTMLInputElement>();
  const inputValue = useSignal("");
  return (
    <>
      <p>Bilder</p>
      <div class="flex justify-between">
        <label class="input input-bordered mr-4 flex w-full items-center gap-2">
          <input
            type="text"
            class="link link-neutral w-full grow"
            placeholder="www.mein-verein.de/image1.img"
            value={inputValue.value}
            ref={inputRef}
            onInput$={(_, e) => (inputValue.value = e.value)}
          />
          <div
            class="tooltip tooltip-left tooltip-warning"
            data-tip="Weblink zum Bild"
          >
            <div class="text-2xl transition-all hover:opacity-70">
              <HiInformationCircleOutline />
            </div>
          </div>
        </label>
        <button
          class="btn btn-primary"
          onClick$={() => {
            if (inputRef.value?.value) {
              context.imageUrls.push(inputRef.value?.value);
              inputValue.value = "";
            }
          }}
        >
          <div class="text-2xl transition-all hover:opacity-70">
            <HiPlusOutline />
          </div>
        </button>
      </div>

      <div class="grid grid-cols-3 gap-4">
        {context.imageUrls
          .slice()
          .reverse()
          .map((e, i) => (
            <ImagePreview imgUrl={e} key={i} clz="relative" delButton={true} />
          ))}
      </div>
    </>
  );
});

const ImagePreview = component$(
  (inputData: {
    imgUrl: string;
    key: number;
    clz: ClassList;
    delButton: boolean;
  }) => {
    const context = useContext(FormDataContext);
    return (
      <div key={inputData.key + "imageStackOrgaAcc"} class={inputData.clz}>
        {inputData.delButton && (
          <div
            class="btn btn-square btn-error absolute -left-3 -top-3 scale-[0.75] text-2xl text-error-content shadow-xl"
            onClick$={() =>
              (context.imageUrls = context.imageUrls.filter(
                (e) => inputData.imgUrl !== e,
              ))
            }
          >
            <HiTrashSolid />
          </div>
        )}
        <img
          class="max-h-60 max-w-60 rounded-xl shadow-xl"
          src={inputData.imgUrl}
        />
      </div>
    );
  },
);

const Overview = component$(() => {
  const context = useContext(FormDataContext);
  return (
    <div class="card w-full space-y-4 bg-base-100 p-4 shadow-xl">
      <div class="flex items-center gap-4 rounded-3xl border border-2 border-primary p-4">
        <div>
          <div class="text-2xl">{context.name}</div>
          <div class="flex gap-2">
            <div class="flex text-xl">
              <HiLinkOutline />
            </div>
            <div class="link">{context.webpageUrl}</div>
          </div>
          <div class="flex gap-2">
            <div class="flex text-xl">
              <HiBanknotesOutline />
            </div>
            <div class="link">{context.donatePageUrl}</div>
          </div>
        </div>
      </div>

      <div class="stats shadow-xl">
        <div class="stat">
          <div class="stat-figure text-3xl text-secondary">
            <HiCalendarDaysOutline />
          </div>
          <div class="stat-title">Seit</div>
          <div class="stat-value">
            {context.dateFrom.mnth}/{context.dateFrom.year}
          </div>
        </div>
        <div class="stat">
          <div class="stat-figure text-3xl text-secondary">
            <HiCalendarDaysOutline />
          </div>
          <div class="stat-title">Geplant bis</div>
          <div class="stat-value">
            {context.dateTo.mnth}/{context.dateTo.year}
          </div>
        </div>
      </div>
      <div class="card w-full bg-neutral p-4 text-neutral-content">
        {context.description}
      </div>
      <div class="carousel carousel-center w-full space-x-4 rounded-box bg-neutral p-4">
        {context.imageUrls.map((e, i) => (
          <ImagePreview
            imgUrl={e}
            key={i}
            clz="carousel-item"
            delButton={false}
          />
        ))}
      </div>
      <div class="card card-compact bg-base-100 shadow-xl">
        <figure class="rounded-2xl">
          <div id="map"></div>
          <MapLocationInput
            class="h-[30rem] w-[40rem]"
            location={context.location}
          />
        </figure>
      </div>
    </div>
  );
});

const SendFormAsNew = component$(() => {
  const context = useContext(FormDataContext);
  const noId = (({ ...o }) => o)(convertInternalTypeToAPIProjectType(context));
  const updateProjectApiCall = usePostProject(noId);
  return (
    <Resource
      value={updateProjectApiCall}
      onResolved={(response) => (
        <ApiResponse
          response={response}
          on201$={() => (
            <div class="flex justify-center p-32">
              <div class="card w-96 bg-base-100 shadow-xl">
                <div class="card-body items-center text-center">
                  <h2 class="card-title">Erfolgreich abgesendet!</h2>
                  <div class="card-actions">
                    <Link href="/profile" class="btn btn-primary">
                      Zurück zum Profil
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
          defaultError$={(r) => (
            <div class="flex justify-center p-32">
              <div class="card w-96 bg-base-100 shadow-xl">
                <div class="card-body items-center text-center">
                  <h2 class="card-title">
                    Ein unerwarteter Fehler ist aufgetreten!
                  </h2>
                  <p>Bitte später erneut versuchen.</p>
                  <p>Fehlercode: {r}</p>
                  <div class="card-actions">
                    <Link href="/profile" class="btn btn-primary">
                      Zurück zum Profil
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        />
      )}
    />
  );
});

const SendFormAsEdit = component$(() => {
  const context = useContext(FormDataContext);
  const updateProjectApiCall = usePutProject(
    convertInternalTypeToAPIProjectType(context),
  );
  return (
    <Resource
      value={updateProjectApiCall}
      onResolved={(response) => (
        <ApiResponse
          response={response}
          on204$={() => (
            <div class="flex justify-center p-32">
              <div class="card w-96 bg-base-100 shadow-xl">
                <div class="card-body items-center text-center">
                  <h2 class="card-title">Erfolgreich abgesendet!</h2>
                  <div class="card-actions">
                    <Link href="/profile" class="btn btn-primary">
                      Zurück zum Profil
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
          defaultError$={(r) => (
            <div class="flex justify-center p-32">
              <div class="card w-96 bg-base-100 shadow-xl">
                <div class="card-body items-center text-center">
                  <h2 class="card-title">
                    Ein unerwarteter Fehler ist aufgetreten!
                  </h2>
                  <p>Bitte später erneut versuchen.</p>
                  <p>Fehlercode: {r}</p>
                  <div class="card-actions">
                    <Link href="/profile" class="btn btn-primary">
                      Zurück zum Profil
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        />
      )}
    />
  );
});

function convertInternalTypeToAPIProjectType(
  interalOut: ProjectInformationProps,
): ApiRelevantProjectInformations {
  return {
    name: interalOut.name,
    id: interalOut.id,
    orgaId: 1, //will be set by backend
    description: interalOut.description,
    coordinates: [interalOut.location.lng, interalOut.location.lat],
    iconUrl: interalOut.logoUrl,
    imageUrls:
      interalOut.imageUrls.length === 0 ? undefined : interalOut.imageUrls,
    webPageUrl:
      interalOut.webpageUrl === "" ? undefined : interalOut.webpageUrl,
    donatePageUrl:
      interalOut.donatePageUrl === "" ? undefined : interalOut.donatePageUrl,
    tags: interalOut.tags,
    dateFrom:
      interalOut.dateFrom.year !== "--" && interalOut.dateFrom.mnth !== "--"
        ? interalOut.dateFrom.year +
          "-" +
          String(interalOut.dateFrom.mnth).padStart(2, "0")
        : undefined,
    dateTo:
      interalOut.dateTo.year !== "--" && interalOut.dateTo.mnth !== "--"
        ? interalOut.dateTo.year +
          "-" +
          String(interalOut.dateTo.mnth).padStart(2, "0")
        : undefined,
    regionName: "", //Will be set by backend
  };
}

function checkFormInputs(currState: ProjectInformationProps) {
  return !(
    currState.name === "" ||
    currState.description === "" ||
    currState.logoUrl === ""
  );
}

export const ProjectCreation = component$(
  (inputData: {
    selProject: number;
    projects: ApiRelevantProjectInformations[];
    tags: { id: number; name: string }[];
  }) => {
    const emptyProject: ProjectInformationProps = {
      name: "",
      description: "",
      location: { lng: 0, lat: 0 },
      dateFrom: { mnth: "--", year: "--" },
      dateTo: { mnth: "--", year: "--" },
      imageUrls: [],
      webpageUrl: "",
      donatePageUrl: "",
      tags: [],
      id: -1,
      logoUrl: "",
      regionName: "",
    };

    const tagsNameMapping = inputData.tags;

    const isNew = inputData.selProject === -1;
    //Api call returns all Projects. We are only interested in the selected one
    const projectData = isNew
      ? emptyProject
      : convertAPITypeToInternalProjectType(
          inputData.projects.filter((e) => e.id === inputData.selProject)[0],
        );

    const position = useSignal(0);
    const store = useStore<ProjectInformationProps>(projectData);
    useContextProvider(FormDataContext, store);
    const context = useContext(FormDataContext);
    return (
      <div class="relative flex justify-center">
        <div class="card m-4 h-fit w-full max-w-screen-md place-items-stretch space-y-4 rounded-box bg-base-200 px-4 py-8 shadow-2xl">
          <h2 class="card-title px-4">
            {isNew ? "Projekt erstellen" : "Projekt bearbeiten"}
          </h2>
          <div class="space-y-4 px-4">
            {position.value === 0 && <Projektdaten />}
            {position.value === 1 && <Projekttags tags={tagsNameMapping} />}
            {position.value === 2 && <ImageStack />}
            {position.value === 3 && <Overview />}
            {position.value === 4 && isNew && <SendFormAsNew />}
            {position.value === 4 && !isNew && <SendFormAsEdit />}
            {position.value === 0 && !checkFormInputs(context) && (
              <FormInputMissing />
            )}
          </div>
          <div class="bottom-0 flex flex-col items-center justify-center gap-4">
            {position.value === 3 ? (
              <>
                <div class="justify-between space-x-16">
                  <button
                    class="btn btn-secondary"
                    onClick$={() => (position.value = 0)}
                  >
                    Bearbeiten
                    <div class="text-2xl">
                      <HiCog6ToothOutline />
                    </div>
                  </button>
                  <button
                    class="btn btn-primary"
                    onClick$={() => {
                      position.value = 4;
                    }}
                  >
                    Absenden
                  </button>
                </div>
              </>
            ) : (
              <div class="join">
                <button
                  class="btn btn-outline join-item btn-neutral"
                  onClick$={() =>
                    (position.value = Math.max(0, position.value - 1))
                  }
                >
                  <div class="text-2xl">
                    <HiChevronLeftOutline />
                  </div>
                </button>
                <button
                  class="btn btn-primary join-item"
                  onClick$={() =>
                    (position.value = Math.min(3, position.value + 1))
                  }
                >
                  <div class="text-2xl">
                    <HiChevronRightOutline />
                  </div>
                </button>
              </div>
            )}
            <ul class="steps">
              <li
                class="step step-neutral step-primary cursor-pointer"
                onClick$={() => (position.value = 0)}
              >
                Daten
              </li>
              <li
                class={[
                  "step step-neutral cursor-pointer",
                  position.value > 0 ? "step-primary" : "",
                ]}
                onClick$={() => (position.value = 1)}
              >
                Tags
              </li>
              <li
                class={[
                  "step step-neutral cursor-pointer",
                  position.value > 1 ? "step-primary" : "",
                ]}
                onClick$={() => (position.value = 2)}
              >
                Bilder
              </li>
              <li
                class={[
                  "step step-neutral cursor-pointer",
                  position.value > 2 ? "step-primary" : "",
                ]}
                onClick$={() => (position.value = 3)}
              >
                Überprüfen
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  },
);
