import { UserManager } from "oidc-client-ts";
import type { AuthProviderProps } from "react-oidc-context";

const oidcConfig: AuthProviderProps = {
  authority: (window as any)._env_?.OIDC_ISSUER || "https://dev-kpiuw0wghy7ta8x8.us.auth0.com/",
  client_id: (window as any)._env_?.OIDC_CLIENT_ID || "ZB6G0jz2KVW6acAmLhdibQ5ykL02YcBy",
  redirect_uri: window.location.origin,
  response_type: "code",
  extraQueryParams: {
    audience: (window as any)._env_?.OIDC_AUDIENCE || 'https://bcs-api/'
  },
  scope: (window as any)._env_?.OIDC_SCOPES || "openid profile email offline_access api:use",
  onSigninCallback: () => {
    window.history.replaceState({}, document.title, "/");
  },
};

export const userManager = new UserManager(oidcConfig);

// Optional: function to get token
export const getAccessToken = async () => {
  const user = await userManager.getUser();
  return user?.access_token;
};

export default oidcConfig;