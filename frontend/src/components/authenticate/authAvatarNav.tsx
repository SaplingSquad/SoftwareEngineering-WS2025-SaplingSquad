import { component$, useComputed$ } from "@builder.io/qwik";
import { useSession } from "~/routes/plugin@auth";
import { LoginOverviewParamsForm } from "../auth/login";
import { LogoutParamsForm } from "../auth/logout";
import { ProfileImage } from "../profile/utils";

export const LoginAvatar = component$(() => {
    const session = useSession();

    const LoginProfile = useComputed$(() => {
        const email = session.value?.user?.email;
        return (
            email ?
                <>
                    <a href="../profile" class="btn btn-ghost btn-circle avatar bg-base-100">
                        <ProfileImage profiledata={session} imgSize="size-12 rounded-full"/>
                    </a>
                </>
                :
                <>
                    <LoginOverviewParamsForm redirectTo={"/map"}>
                        <button class="btn btn-primary">Login/Signup</button>
                    </LoginOverviewParamsForm>
                </>
        )
    })

    return (
        <>
            {LoginProfile}
        </>
    )
})