import { QwikAuth$ } from "@auth/qwik";
import Keycloak from "@auth/qwik/providers/keycloak"; //https://authjs.dev/getting-started/typescript#module-augmentation

//https://authjs.dev/getting-started/typescript#module-augmentation
declare module "@auth/qwik" {
  interface Session {
    accessToken?: string;
  }
}
declare module "@auth/core/jwt" {
  interface JWT {
    accessToken?: string;
  }
}

export const { onRequest, useSession, useSignIn, useSignOut } = QwikAuth$(
  () => ({
    pages: {
      signIn: "/login",
      signOut: "/logout",
      // verifyRequest: "/",
      // newUser: "/",
      // error: "/error",
    },
    //https://authjs.dev/guides/integrating-third-party-backends#storing-the-token-in-the-session
    callbacks: {
      jwt({ token, account }) {
        return { ...token, accessToken: account?.access_token };
      },
      session({ session, token }) {
        session.accessToken = token.accessToken;
        return session;
      },
    },
    providers: [
      Keycloak({
        id: "keycloak-users",
        issuer: "http://localhost:5555/auth/realms/sprout-users",
        clientId: "sprout-web",
      }),
      Keycloak({
        id: "keycloak-orgs",
        issuer: "http://localhost:5555/auth/realms/sprout-orgs",
        clientId: "sprout-web",
      }),
    ],
  }),
);
