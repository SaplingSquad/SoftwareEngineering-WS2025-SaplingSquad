import { component$, Resource, useStore, } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import { requestHandler } from "@builder.io/qwik-city/middleware/request-handler";
import { useGetOrganizationSelf, useGetProjectsForOrganizationSelf } from "~/api/api_hooks.gen";
import { ApiResponse } from "~/components/api";
import { ProjectCreation } from "~/components/profile/manage-project";
import type { ProfileProjectsProps } from "~/components/profile/profile";

export const getUrlParams = routeLoader$((requestEvent) => {
    return requestEvent.url.toString()
});

export default component$(() => {
    const url = getUrlParams();
    const urlparam = (new URL(url.value)).searchParams.get('selproj');
    const selectedProject = urlparam ? parseInt(urlparam) : -1;
    const orgaProjectsRequest = useGetProjectsForOrganizationSelf();
    const orgaRequest = useGetOrganizationSelf();
    return (
        <>
            <div>
                {selectedProject}
            </div>
            <div>
                <Resource
                    value={orgaProjectsRequest}
                    onResolved={(projResponse) => (
                        <ApiResponse
                            response={projResponse}
                            on200$={(projR) => <ProjectCreation selProject={selectedProject} projects={projR} />}
                            on401$={() => "Token Expired. Please login again."}
                            on404$={() => <ProjectCreation selProject={selectedProject} projects={[]} />}
                            defaultError$={(r) => r}
                        />
                    )}
                />



            </div>
        </>
    )
})