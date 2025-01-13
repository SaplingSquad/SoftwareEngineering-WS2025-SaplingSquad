import { component$, createContextId, Resource, Signal, useComputed$, useContext, useContextProvider, useSignal, useStore, } from "@builder.io/qwik";
import { UserProfile, VereinProfile } from "~/components/profile/profile";
import type { ApiRelevantOrganisationInformations, OrgaInformationsProps, ProfileProjectsProps } from "~/components/profile/profile";
import { useSession } from "../plugin@auth";
import { getAccountType, isAccTypeOrg, isAccTypeUser, useAccountType, useAuthHeader } from "~/auth/useauthheader";
import { LoginOverviewParamsForm } from "~/components/auth/login";
import { routeLoader$ } from "@builder.io/qwik-city";
import { api } from "~/api/api_url";
import { ApiResponse } from "~/components/api";
import { TestContext } from "node:test";
import { objectOutputType } from "zod";
import { useGetOrganizationSelf, useGetProjectsForOrganizationSelf } from "~/api/api_hooks.gen";
import { Session } from "@auth/qwik";
import { getProjectsForOrganizationSelf } from "~/api/api_methods.gen";

const DEMO_IMAGE = "https://picsum.photos/300";

const projectdata: ProfileProjectsProps[] = [
    { img: DEMO_IMAGE, title: "Bildung für Kinder", text: "benachteiligte Kinder unterstützen und ihnen Zugang zu Bildung ermöglichen?" },
    { img: DEMO_IMAGE, title: "Artenschutz und Biodiversität", text: "dich für den Schutz gefährdeter Tierarten und den Erhalt der Biodiversität einsetzen?" },
    { img: DEMO_IMAGE, title: "Hungerbekämpfung", text: "dazu beitragen, den Welthunger zu bekämpfen und Menschen in Not mit Lebensmitteln zu versorgen?" },
    { img: DEMO_IMAGE, title: "Katastrophenhilfe", text: "Gemeinden in Katastrophengebieten mit Nothilfe und langfristiger Unterstützung beistehen?" },
]

const VereinProfilePage = component$((inputData: { profiledata: Readonly<Signal<null>> | Readonly<Signal<Session>> }) => {
    const orgaRequest = useGetOrganizationSelf();

    const session = inputData.profiledata

    const orgaProjectsRequest = useGetProjectsForOrganizationSelf();


    const emptyOrga: ApiRelevantOrganisationInformations =
    {
        name: "",
        description: "",
        foundingYear: 0,
        memberCount: 0,
        iconUrl: "",
        imageUrls: [],
        webPageUrl: "",
        donatePageUrl: "",
        coordinates: [0, 0],
        tags: []
    }

    return (
        <div>
            <Resource
                value={orgaRequest}
                onResolved={(response) => (
                    <ApiResponse
                        response={response}
                        on200$={(r) =>
                            <div>
                                <p>
                                    Success {JSON.stringify(r)}
                                </p>
                                <Resource
                                    value={orgaProjectsRequest}
                                    onResolved={(projResponse) => (
                                        <ApiResponse
                                            response={projResponse}
                                            on200$={(projR) => <div><p>Success {JSON.stringify(projR)}</p><VereinProfile orgaData={r} projectsData={projR} profiledata={session} /></div>}
                                            on401$={() => <>Bitte neu anmelden <LoginOverviewParamsForm redirectTo={"/profile"}>
                                                <button class="btn btn-primary">Hier einloggen!</button>
                                            </LoginOverviewParamsForm></>}
                                            on404$={() => <div><p>404</p><VereinProfile orgaData={r} projectsData={[]} profiledata={session} /></div>}
                                            defaultError$={(r) => r}
                                        />
                                    )}
                                    onPending={() =>
                                        <>
                                            Pending
                                        </>
                                    }
                                />
                            </div>
                        }
                        on401$={() => <>Bitte neu anmelden <LoginOverviewParamsForm redirectTo={"/profile"}>
                            <button class="btn btn-primary">Hier einloggen!</button>
                        </LoginOverviewParamsForm></>}
                        on404$={() => <div><p>404</p><VereinProfile orgaData={emptyOrga} projectsData={[]} profiledata={session} /></div>}
                        on500$={() => <div>Ein unerwarteter Fehler ist aufgetreten.</div>}
                        defaultError$={(r) => r}
                    />
                )}
            />
        </div>
    )

    return (
        <Resource
            value={orgaProjectsRequest}
            onResolved={(projResponse) => (
                <ApiResponse
                    response={projResponse}
                    on200$={(projR) => <div><p>Success {JSON.stringify(projR)}</p><VereinProfile orgaData={emptyOrga} projectsData={projR} profiledata={session} /></div>}
                    on401$={() => <>Bitte neu anmelden <LoginOverviewParamsForm redirectTo={"/profile"}>
                        <button class="btn btn-primary">Hier einloggen!</button>
                    </LoginOverviewParamsForm></>}
                    defaultError$={(r) => r}
                />
            )}
            onPending={() =>
                <>
                    Pending
                </>
            }
        />
    )
})

export default component$(() => {
    const store = useStore(projectdata);

    const session = useSession();
    const useaccType = useAccountType(session);

    //const questionRequest = useGetQuestionById({ questionId: numbiii }

    const ProfileAccountController = useComputed$(() => {
        return (
            <>
                <div class="flex justify-center p-32">
                    <div class="card bg-base-100 w-96 shadow-xl">
                        <div class="card-body items-center text-center">
                            <h2 class="card-title">Nicht eingeloggt.</h2>
                            <div class="card-actions">
                                <LoginOverviewParamsForm redirectTo={"/profile"}>
                                    <button class="btn btn-primary">Hier einloggen!</button>
                                </LoginOverviewParamsForm>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    })

    return (
        isAccTypeUser(useaccType) ?
            <>
                <UserProfile profiledata={session} />
            </>
            : isAccTypeOrg(useaccType) ?
                <>
                    <VereinProfilePage profiledata={session} />
                </>
                :
                <>
                    {ProfileAccountController}
                </>
    )
})