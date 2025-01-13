import { component$, createContextId, Resource, Signal, useComputed$, useContext, useContextProvider, useSignal, useStore, } from "@builder.io/qwik";
import { UserProfile, VereinProfile } from "~/components/profile/profile";
import type { ApiRelevantOrganisationInformations, OrgaInformationsProps, ProfileProjectsProps } from "~/components/profile/profile";
import { useSession } from "../plugin@auth";
import { getAccountType, isAccTypeOrg, isAccTypeUser, useAccountType } from "~/auth/useauthheader";
import { LoginOverviewParamsForm } from "~/components/auth/login";
import { routeLoader$ } from "@builder.io/qwik-city";
import { api } from "~/api/api_url";
import { ApiResponse } from "~/components/api";
import { TestContext } from "node:test";
import { objectOutputType } from "zod";
import { useGetOrganizationSelf } from "~/api/api_hooks.gen";

const DEMO_IMAGE = "https://picsum.photos/300";

const projectdata: ProfileProjectsProps[] = [
    { img: DEMO_IMAGE, title: "Bildung für Kinder", text: "benachteiligte Kinder unterstützen und ihnen Zugang zu Bildung ermöglichen?" },
    { img: DEMO_IMAGE, title: "Artenschutz und Biodiversität", text: "dich für den Schutz gefährdeter Tierarten und den Erhalt der Biodiversität einsetzen?" },
    { img: DEMO_IMAGE, title: "Hungerbekämpfung", text: "dazu beitragen, den Welthunger zu bekämpfen und Menschen in Not mit Lebensmitteln zu versorgen?" },
    { img: DEMO_IMAGE, title: "Katastrophenhilfe", text: "Gemeinden in Katastrophengebieten mit Nothilfe und langfristiger Unterstützung beistehen?" },
]

export default component$(() => {
    const store = useStore(projectdata);

    const session = useSession();
    const useaccType = useAccountType(session);

    const numbiii = useSignal(1);



    //const questionRequest = useGetQuestionById({ questionId: numbiii })
    const orgaRequest = useGetOrganizationSelf();

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

    const emptyOrgaStore = useStore(emptyOrga)


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
                    <div>
                        <Resource
                            value={orgaRequest}
                            onResolved={(response) => (
                                <ApiResponse
                                    response={response}
                                    on200$={(r) => <div><p>Success {JSON.stringify(r)}</p><VereinProfile orgaData={r} projectdata={store} profiledata={session} /></div>}
                                    on401$={() => <div><p>401</p><VereinProfile orgaData={emptyOrga} projectdata={store} profiledata={session} /></div>}
                                    on404$={() => <div><p>404</p><VereinProfile orgaData={emptyOrga} projectdata={store} profiledata={session} /></div>}
                                    on500$={() => <div><p>500</p><VereinProfile orgaData={emptyOrga} projectdata={store} profiledata={session} /></div>}
                                    defaultError$={(r) => r}
                                />
                            )}
                        />
                    </div>
                </>
                :
                <>
                    {ProfileAccountController}
                </>
    )
})