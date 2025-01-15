import { component$, Resource } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import {
  useGetProjectsForOrganizationSelf,
  useGetTags,
} from "~/api/api_hooks.gen";
import { ApiResponse } from "~/components/api";
import { ProjectCreation } from "~/components/profile/manage-project";
import { LoginAgainCard } from "~/components/profile/utils";

export const getUrlParams = routeLoader$((requestEvent) => {
  return requestEvent.url.toString();
});

export default component$(() => {
  const url = getUrlParams();
  const urlparam = new URL(url.value).searchParams.get("selproj");
  const selectedProject = urlparam ? parseInt(urlparam) : -1;
  const orgaProjectsRequest = useGetProjectsForOrganizationSelf();
  const getTag = useGetTags();
  return (
    <Resource
      value={getTag}
      onResolved={(tags) => (
        <ApiResponse
          response={tags}
          on200$={(tagsResponse) => (
            <Resource
              value={orgaProjectsRequest}
              onResolved={(projResponse) => (
                <ApiResponse
                  response={projResponse}
                  on200$={(projR) => (
                    <ProjectCreation
                      selProject={selectedProject}
                      projects={projR}
                      tags={tagsResponse}
                    />
                  )}
                  on401$={() => <LoginAgainCard />}
                  on404$={() => (
                    <ProjectCreation
                      selProject={selectedProject}
                      projects={[]}
                      tags={tagsResponse}
                    />
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
  );
});
