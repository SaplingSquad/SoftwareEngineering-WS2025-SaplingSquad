import { Session } from "@auth/qwik";
import { ClassList, component$, Signal } from "@builder.io/qwik";
import { HiUserCircleOutline } from "@qwikest/icons/heroicons";

export const ProfileImage = component$((inputData: { profiledata: Readonly<Signal<null>> | Readonly<Signal<Session>>, imgSize: ClassList }) => {
    return (
        <>

            {
                inputData.profiledata.value?.user?.image ?
                    <>
                        <img class={inputData.imgSize} src={inputData.profiledata.value?.user?.image} />
                    </>
                    :
                    <>
                        <HiUserCircleOutline class={inputData.imgSize} />
                    </>
            }
        </>
    )
})