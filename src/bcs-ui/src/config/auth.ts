import type { AuthProviderProps } from "react-oidc-context";

const oidcConfig: AuthProviderProps = {
  authority: "https://dev-kpiuw0wghy7ta8x8.us.auth0.com",
  client_id: "ZB6G0jz2KVW6acAmLhdibQ5ykL02YcBy",
  redirect_uri: window.location.origin,
  response_type: "code",
  scope: "openid profile email offline_access",
  onSigninCallback: () => {
    window.history.replaceState({}, document.title, "/");
  },
};

export default oidcConfig;