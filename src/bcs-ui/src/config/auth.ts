import { UserManager } from "oidc-client-ts";
import type { AuthProviderProps } from "react-oidc-context";

const oidcConfig: AuthProviderProps = {
  authority: "https://dev-kpiuw0wghy7ta8x8.us.auth0.com",
  client_id: "ZB6G0jz2KVW6acAmLhdibQ5ykL02YcBy",
  redirect_uri: window.location.origin,
  response_type: "code",
  extraQueryParams: {
    audience: 'https://bcs-api/'
  },
  scope: "openid profile email offline_access api:use",
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