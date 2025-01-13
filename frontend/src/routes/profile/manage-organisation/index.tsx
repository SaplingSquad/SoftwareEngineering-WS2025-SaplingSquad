import {
    $,
    component$,
    Resource,
    useComputed$,
    useOnWindow,
    useSignal,
    useStore,
} from "@builder.io/qwik";
import { useGetOrganizationSelf, useGetTags } from "~/api/api_hooks.gen";
import { useAccountType, isAccTypeUser, isAccTypeOrg } from "~/auth/useauthheader";
import { ApiResponse } from "~/components/api";
import { LoginOverviewParamsForm } from "~/components/auth/login";
import { Vereinsignup, Badge } from "~/components/profile/manage-organisation";
import { ApiRelevantOrganisationInformations, UserProfile, VereinProfile } from "~/components/profile/profile";
import { useSession } from "~/routes/plugin@auth";


export default component$(() => {

    const session = useSession();
    const useaccType = useAccountType(session);

    const orgaRequest = useGetOrganizationSelf();

    const getTag = useGetTags();

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
        regionName: ''
    }

    return (
        isAccTypeOrg(useaccType) ?
            <>
                <div>
                    <Resource
                        value={getTag}
                        onResolved={(response) => (
                            <ApiResponse
                                response={response}
                                on200$={(tagsResponse) =>
                                    <Resource
                                        value={orgaRequest}
                                        onResolved={(response) => (
                                            <ApiResponse
                                                response={response}
                                                on200$={(r) => <div class="h-3/6"><p>200</p><Vereinsignup orgaData={r} tags={tagsResponse} /></div>}
                                                on401$={() => <div class="h-3/6"><p>401</p><Vereinsignup orgaData={emptyOrga} tags={tagsResponse} /></div>}
                                                on404$={() => <div class="h-3/6"><p>404</p><Vereinsignup orgaData={emptyOrga} tags={tagsResponse} /></div>}
                                                on500$={() => <div class="h-3/6"><p>500</p><Vereinsignup orgaData={emptyOrga} tags={tagsResponse} /></div>}
                                                defaultError$={(r) => r}
                                            />
                                        )}
                                    />
                                }
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