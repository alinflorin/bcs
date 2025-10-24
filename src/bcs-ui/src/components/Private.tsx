import type { PropsWithChildren } from "react";
import { useAuth } from "react-oidc-context";
import { useLocation } from "react-router";

export interface PrivateProps {
  adminOnly?: boolean;
}

export default function Private(props: PropsWithChildren<PrivateProps>) {
  const auth = useAuth();
  const location = useLocation();

  if (auth.isLoading) {
    return null;
  }
  
  if (
    !auth.isAuthenticated ||
    (props.adminOnly &&
      !auth.user?.profile?.["https://bcs-api/roles"]?.includes("admin"))
  ) {
    sessionStorage.setItem("postLoginRedirect", location.pathname);
    auth.signinRedirect();
    return null;
  }

  return props.children;
}
