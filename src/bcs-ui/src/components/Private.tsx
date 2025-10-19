import type { PropsWithChildren } from "react";
import { useAuth } from "react-oidc-context";
import { useLocation } from "react-router";

export default function Private(props: PropsWithChildren) {
  const auth = useAuth();
  const location = useLocation();

  if (auth.isLoading) {
    return null;
  }

  if (!auth.isAuthenticated) {
    sessionStorage.setItem('postLoginRedirect', location.pathname);
    auth.signinRedirect();
    return null;
  }

  return props.children;
}
