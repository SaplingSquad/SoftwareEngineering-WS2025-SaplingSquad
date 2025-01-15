import { component$, Resource } from "@builder.io/qwik";
import { useGetOrganizationSelf, useGetTags } from "~/api/api_hooks.gen";
import { isAccTypeOrg, useAccountType } from "~/auth/utils";
import { ApiResponse } from "~/components/api";
import { Vereinsignup } from "~/components/profile/manage-organisation";
import { ApiRelevantOrganisationInformations } from "~/components/profile/types";
import { LoginAgainCard } from "~/components/profile/utils";

import { useSession } from "~/routes/plugin@auth";

export default component$(() => {
  const session = useSession();
  const useaccType = useAccountType(session);

  const orgaRequest = useGetOrganizationSelf();

  const getTag = useGetTags();

  const emptyOrga: ApiRelevantOrganisationInformations = {
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
    regionName: "",
  };

  return isAccTypeOrg(useaccType) ? (
    <Resource
      value={getTag}
      onResolved={(response) => (
        <ApiResponse
          response={response}
          on200$={(tagsResponse) => (
            <Resource
              value={orgaRequest}
              onResolved={(response) => (
                <ApiResponse
                  response={response}
                  on200$={(r) => (
                    <Vereinsignup orgaData={r} tags={tagsResponse} />
                  )}
                  on401$={() => <LoginAgainCard />}
                  on404$={() => (
                    <Vereinsignup orgaData={emptyOrga} tags={tagsResponse} />
                  )}
                  defaultError$={(r) => r}
                />
              )}
            />
          )}
          defaultError$={(r) => r}
        />
      )}
    />
  ) : (
    <div class="flex justify-center p-32">
      <div class="card w-96 bg-base-100 shadow-xl">
        <div class="card-body items-center text-center">
          <h2 class="card-title">Kein Vereinsaccount</h2>
          <div class="card-actions">
            <button class="btn btn-primary">Zurück zum Profil</button>
          </div>
        </div>
      </div>
    </div>
  );
});
