import { useSession } from "~/routes/plugin@auth";

function useAuthHeader() {
  const session = useSession();
  if (session.value?.accessToken) {
    return { Authorization: `Bearer ${session.value?.accessToken}` };
  } else {
    return undefined;
  }
}
