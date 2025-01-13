import {
    $,
    component$,
    Resource,
    useComputed$,
    useOnWindow,
    useSignal,
    useStore,
} from "@builder.io/qwik";
import { useGetOrganizationSelf } from "~/api/api_hooks.gen";
import { useAccountType, isAccTypeUser, isAccTypeOrg } from "~/auth/useauthheader";
import { ApiResponse } from "~/components/api";
import { LoginOverviewParamsForm } from "~/components/auth/login";
import { Vereinsignup, Badge } from "~/components/profile/manage-organisation";
import { ApiRelevantOrganisationInformations, UserProfile, VereinProfile } from "~/components/profile/profile";
import { useSession } from "~/routes/plugin@auth";

const data: Badge[] = [
    { title: "Kinder", answer: false },
    { title: "Natur", answer: false },
    { title: "Wilderei", answer: false },
    { title: "Pandas", answer: false },
    { title: "Löwen", answer: false },
    { title: "Kinder", answer: false },
    { title: "Natur", answer: false },
    { title: "Wilderei", answer: false },
    { title: "Pandas", answer: false },
    { title: "Löwen", answer: false },
    { title: "Kinder", answer: false },
    { title: "Natur", answer: false },
    { title: "Wilderei", answer: false },
    { title: "Pandas", answer: false },
    { title: "Löwen", answer: false },
    { title: "Kinder", answer: false },
    { title: "Natur", answer: false },
    { title: "Wilderei", answer: false },
    { title: "Pandas", answer: false },
    { title: "Löwen", answer: false },
    { title: "Kinder", answer: false },
    { title: "Natur", answer: false },
    { title: "Wilderei", answer: false },
    { title: "Pandas", answer: false },
    { title: "Löwen", answer: false },
    { title: "Kinder", answer: false },
    { title: "Natur", answer: false },
    { title: "Wilderei", answer: false },
    { title: "Pandas", answer: false },
    { title: "Löwen", answer: false },
    { title: "Kinder", answer: false },
    { title: "Natur", answer: false },
    { title: "Wilderei", answer: false },
    { title: "Pandas", answer: false },
    { title: "Löwen", answer: false },
    { title: "Kinder", answer: false },
    { title: "Natur", answer: false },
    { title: "Wilderei", answer: false },
    { title: "Pandas", answer: false },
    { title: "Löwen", answer: false },
    { title: "Kinder", answer: false },
    { title: "Natur", answer: false },
    { title: "Wilderei", answer: false },
    { title: "Pandas", answer: false },
    { title: "Löwen", answer: false },
    { title: "Kinder", answer: false },
    { title: "Natur", answer: false },
    { title: "Wilderei", answer: false },
    { title: "Pandas", answer: false },
    { title: "Löwen", answer: false },
    { title: "Kinder", answer: false },
    { title: "Natur", answer: false },
    { title: "Wilderei", answer: false },
    { title: "Pandas", answer: false },
    { title: "Löwen", answer: false },
    { title: "Kinder", answer: false },
    { title: "Natur", answer: false },
    { title: "Wilderei", answer: false },
    { title: "Pandas", answer: false },
    { title: "Löwen", answer: false },
    { title: "Kinder", answer: false },
    { title: "Natur", answer: false },
    { title: "Wilderei", answer: false },
    { title: "Pandas", answer: false },
    { title: "Löwen", answer: false },
    { title: "Kinder", answer: false },
    { title: "Natur", answer: false },
    { title: "Wilderei", answer: false },
    { title: "Pandas", answer: false },
    { title: "Löwen", answer: false },
]

export default component$(() => {

    const session = useSession();
    const useaccType = useAccountType(session);

    const orgaRequest = useGetOrganizationSelf();

    const vereintag = useStore(data);

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
        isAccTypeOrg(useaccType) ?
            <>
                <div>
                    <Resource
                        value={orgaRequest}
                        onResolved={(response) => (
                            <ApiResponse
                                response={response}
                                on200$={(r) => <div><p>200</p><Vereinsignup orgaData={r} data={vereintag} /></div>}
                                on401$={() => <div><p>401</p><Vereinsignup orgaData={emptyOrga} data={vereintag} /></div>}
                                on404$={() => <div><p>404</p><Vereinsignup orgaData={emptyOrga} data={vereintag} /></div>}
                                on500$={() => <div><p>500</p><Vereinsignup orgaData={emptyOrga} data={vereintag} /></div>}
                                defaultError$={(r) => r}
                            />
                        )}
                    />
                </div>
            </>
            :
            <>
                <div class="flex justify-center p-32">
                    <div class="card bg-base-100 w-96 shadow-xl">
                        <div class="card-body items-center text-center">
                            <h2 class="card-title">Kein Vereinsaccount</h2>
                            <div class="card-actions">
                                <button class="btn btn-primary">Zurück zum Profil</button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
    )
})

export const old = component$(() => {
    const vereintag = useStore(data);
    return (
        <>
            <div class="h-3/6">
                {/*<Vereinsignup orgaData={emptyOrga} data={vereintag} />*/}
            </div>
        </>
    )
})