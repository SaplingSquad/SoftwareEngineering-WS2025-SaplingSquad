import { component$, useStore, } from "@builder.io/qwik";
import { ProjectCreation } from "~/components/profile/create-project";
import { Profile } from "~/components/profile/profile";
import type { ProfileProjectsProps } from "~/components/profile/profile";

export default component$(() => {
    return (
        <>
            <ProjectCreation />
        </>
    )
})