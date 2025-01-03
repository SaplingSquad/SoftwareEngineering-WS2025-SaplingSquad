import type { QwikAuthConfig } from "@auth/qwik";
import { customFetch, QwikAuth$ } from "@auth/qwik";
import Keycloak from "@auth/qwik/providers/keycloak";
import { keycloak_url } from "~/auth/auth_url";
import { isServer } from "@builder.io/qwik/build";

//https://authjs.dev/getting-started/typescript#module-augmentation
declare module "@auth/qwik" {
  interface Session {
    accessToken?: string;
    providerId?: string;
    realm?: string;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    accessToken?: string;
    expiresAt?: number;
    refreshToken?: string;
    providerId?: string;
    error?: string;
  }
}

export const REFRESH_TOKEN_ERROR = "RefreshTokenError";

let customizedFetch: typeof fetch | undefined = undefined;
if (isServer) {
  // Allow self-signed certificates (only for development!)
  // https://authjs.dev/guides/corporate-proxy
  if (process.env.ALLOW_SELF_SIGNED_CERTIFICATES?.toLowerCase() == "true") {
    const { Agent, fetch: undiciFetch } = await import("undici");
    const dispatcher = new Agent({
      connect: {
        rejectUnauthorized: false,
      },
    });
    customizedFetch = (
      ...args: Parameters<typeof fetch>
    ): ReturnType<typeof fetch> => {
      // @ts-expect-error
      return undiciFetch(args[0], { ...args[1], dispatcher });
    };
  }
}

type JwtCallback = NonNullable<NonNullable<QwikAuthConfig["callbacks"]>["jwt"]>;
const extendToken: JwtCallback = async ({ token, account }) => {
  //https://authjs.dev/guides/refresh-token-rotation
  if (account) {
    console.log(account);
    // First login
    return {
      ...token,
      accessToken: account.access_token,
      expiresAt: account.expires_at,
      refreshToken: account.refresh_token,
      providerId: account.provider,
    };
  } else if (Date.now() < token.expiresAt! * 1000) {
    return token;
  } else {
    if (!token.refreshToken) {
      throw new TypeError("Missing refresh_token");
    }
    try {
      const issuerUri = keycloakRealmById(token.providerId!);
      const response = await (customizedFetch || fetch)(
        `${issuerUri}/protocol/openid-connect/token`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            grant_type: "refresh_token",
            refresh_token: token.refreshToken,
            client_id: clientId,
          }).toString(),
        },
      );
      const tokensOrError = await response.json();
      if (!response.ok) throw tokensOrError;
      const newTokens = tokensOrError as {
        access_token: string;
        expires_in: number;
        refresh_token?: string;
      };
      return {
        ...token,
        accessToken: newTokens.access_token,
        expiresAt: newTokens.expires_in,
        refreshToken: newTokens.refresh_token || token.refreshToken,
      };
    } catch (e) {
      console.error("Error refreshing access_token", e);
      token.error = REFRESH_TOKEN_ERROR;
      return token;
    }
  }
};

export const clientId = "sprout-web";
const providers = [
  Keycloak({
    [customFetch]: customizedFetch,
    id: "keycloak-users",
    issuer: keycloak_url("/realms/sprout-users").toString(),
    clientId,
  }),
  Keycloak({
    [customFetch]: customizedFetch,
    id: "keycloak-orgs",
    issuer: keycloak_url("/realms/sprout-orgs").toString(),
    clientId,
  }),
];

export function keycloakRealmById(id: string): string {
  return providers.find((provider) => provider.options?.id === id)!.options!
    .issuer!;
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
      jwt(params) {
        return extendToken(params);
      },
      session({ session, token }) {
        session.accessToken = token.accessToken;
        session.providerId = token.providerId;
        session.realm = keycloakRealmById(token.providerId!);
        return session;
      },
    },
    providers,
  }),
);
