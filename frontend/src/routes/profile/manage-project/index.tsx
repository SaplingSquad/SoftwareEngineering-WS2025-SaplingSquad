import { component$, useStore, } from "@builder.io/qwik";
import { ProjectCreation } from "~/components/profile/manage-project";
import type { ProfileProjectsProps } from "~/components/profile/profile";

export default component$(() => {
    return (
        <>
            <ProjectCreation />
        </>
    )
})