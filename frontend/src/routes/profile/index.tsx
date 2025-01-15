import { component$, createContextId, Resource, Signal, useComputed$, useContext, useContextProvider, useSignal, useStore, } from "@builder.io/qwik";
import { UserProfile, VereinProfile } from "~/components/profile/profile";
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
import { ProfileProjectsProps, ApiRelevantOrganisationInformations } from "~/components/profile/types";

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
        tags: [],
        regionName: ""
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
                                <Resource
                                    value={orgaProjectsRequest}
                                    onResolved={(projResponse) => (
                                        <ApiResponse
                                            response={projResponse}
                                            on200$={(projR) => <div><VereinProfile orgaData={r} projectsData={projR} profiledata={session} /></div>}
                                            on401$={() =>
                                                <div class="flex justify-center p-32">
                                                    <div class="card bg-base-100 w-96 shadow-xl">
                                                        <div class="card-body items-center text-center">
                                                            <h2 class="card-title">Bitte neu anmelden.</h2>
                                                            <div class="card-actions">
                                                                <LoginOverviewParamsForm redirectTo={"/profile"}>
                                                                    <button class="btn btn-primary">Hier einloggen!</button>
                                                                </LoginOverviewParamsForm>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            }
                                            on404$={() => <div><VereinProfile orgaData={r} projectsData={[]} profiledata={session} /></div>}
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
                        on401$={() => <div class="flex justify-center p-32">
                            <div class="card bg-base-100 w-96 shadow-xl">
                                <div class="card-body items-center text-center">
                                    <h2 class="card-title">Bitte neu anmelden.</h2>
                                    <div class="card-actions">
                                        <LoginOverviewParamsForm redirectTo={"/profile"}>
                                            <button class="btn btn-primary">Hier einloggen!</button>
                                        </LoginOverviewParamsForm>
                                    </div>
                                </div>
                            </div>
                        </div>}
                        on404$={() => <div><VereinProfile orgaData={emptyOrga} projectsData={[]} profiledata={session} /></div>}
                        on500$={() => <div>Ein unerwarteter Fehler ist aufgetreten.</div>}
                        defaultError$={(r) => r}
                    />
                )}
            />
        </div>
    )
})

export default component$(() => {

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