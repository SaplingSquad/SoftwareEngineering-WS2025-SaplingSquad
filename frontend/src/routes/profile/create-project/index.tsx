import { component$, useStore, } from "@builder.io/qwik";
import { ProjectCreation } from "~/components/create-project";
import { Profile } from "~/components/profile";
import type { ProfileProjectsProps } from "~/components/profile";

export default component$(() => {
    return (
        <>
            <ProjectCreation />
        </>
    )
})