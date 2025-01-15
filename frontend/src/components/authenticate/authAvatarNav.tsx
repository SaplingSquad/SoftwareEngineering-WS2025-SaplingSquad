import { component$ } from "@builder.io/qwik";
import { useSession } from "~/routes/plugin@auth";
import { LoginOverviewParamsForm } from "../auth/login";
import { ProfileImage } from "../profile/utils";
import { Link } from "@builder.io/qwik-city";

export const LoginAvatar = component$(() => {
  const session = useSession();

  const email = session.value?.user?.email;

  return email ? (
    <Link href="../profile" class="btn btn-circle bg-base-100">
      <div class="avatar">
        <ProfileImage
          profiledata={session}
          imgSize="size-12 rounded-full shadow-2xl"
        />
      </div>
    </Link>
  ) : (
    <LoginOverviewParamsForm redirectTo={"/map"}>
      <button class="btn btn-primary">Login/Signup</button>
    </LoginOverviewParamsForm>
  );
});
