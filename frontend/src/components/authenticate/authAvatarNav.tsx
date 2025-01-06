import { component$, useComputed$ } from "@builder.io/qwik";
import { useSession } from "~/routes/plugin@auth";
import { LoginOverviewParamsForm } from "../auth/login";
import { LogoutParamsForm } from "../auth/logout";

export const LoginAvatar = component$(() => {
    const session = useSession();

    const LoginProfile = useComputed$(() => {
        const email = session.value?.user?.email;
        return (
            email ?
                <>
                    <a href="../profile" class="btn btn-ghost btn-circle avatar">
                        <div class="w-10 rounded-full">
                            <img
                                alt=""
                                class="h-full w-full"
                                height="400"
                                width="400"
                                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                        </div>

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