import { component$, Resource, Signal } from "@builder.io/qwik";
import { UserProfile, VereinProfile } from "~/components/profile/profile";
import { useSession } from "../plugin@auth";
import { LoginOverviewParamsForm } from "~/components/auth/login";
import { ApiResponse } from "~/components/api";
import {
  useGetOrganizationSelf,
  useGetProjectsForOrganizationSelf,
} from "~/api/api_hooks.gen";
import { Session } from "@auth/qwik";
import { ApiRelevantOrganisationInformations } from "~/components/profile/types";
import { isAccTypeOrg, isAccTypeUser, useAccountType } from "~/auth/utils";
import { LoginAgainCard } from "~/components/profile/utils";

/**
 * Main Profile component: if the user is logged in, it will return the corresponding profile page type: normal user or organization.
 * If this page is called, while not beeing logged in, it will prompt you to do so.
 */
const VereinProfilePage = component$(
  (inputData: {
    profiledata: Readonly<Signal<null>> | Readonly<Signal<Session>>;
  }) => {
    const orgaRequest = useGetOrganizationSelf();
    const session = inputData.profiledata;
    const orgaProjectsRequest = useGetProjectsForOrganizationSelf();
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

    return (
      <Resource
        value={orgaRequest}
        onResolved={(response) => (
          <ApiResponse
            response={response}
            on200$={(r) => (
              <div>
                <Resource
                  value={orgaProjectsRequest}
                  onResolved={(projResponse) => (
                    <ApiResponse
                      response={projResponse}
                      on200$={(projR) => (
                        <VereinProfile
                          orgaData={r}
                          projectsData={projR}
                          profiledata={session}
                        />
                      )}
                      on401$={() => <LoginAgainCard />}
                      on404$={() => (
                        <VereinProfile
                          orgaData={r}
                          projectsData={[]}
                          profiledata={session}
                        />
                      )}
                      defaultError$={(r) => r}
                    />
                  )}
                />
              </div>
            )}
            on401$={() => <LoginAgainCard />}
            on404$={() => (
              <VereinProfile
                orgaData={emptyOrga}
                projectsData={[]}
                profiledata={session}
              />
            )}
            on500$={() => <div>Ein unerwarteter Fehler ist aufgetreten.</div>}
            defaultError$={(r) => r}
          />
        )}
      />
    );
  },
);

export default component$(() => {
  const session = useSession();
  const useaccType = useAccountType(session);

  return isAccTypeUser(useaccType) ? (
    <UserProfile profiledata={session} />
  ) : isAccTypeOrg(useaccType) ? (
    <VereinProfilePage profiledata={session} />
  ) : (
    <div class="flex justify-center p-32">
      <div class="card w-96 bg-base-100 shadow-xl">
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
  );
});
