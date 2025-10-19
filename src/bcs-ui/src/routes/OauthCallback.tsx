import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "react-oidc-context";

export default function OauthCallback() {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isAuthenticated) {
      // Retrieve saved route (if any)
      const returnTo = sessionStorage.getItem("postLoginRedirect") || "/";
      sessionStorage.removeItem("postLoginRedirect");
      navigate(returnTo, { replace: true });
    }
  }, [auth.isAuthenticated]);

  return <div>Finishing login...</div>;
}