import { useState } from "react";
import { Box, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Sidebar from "./components/Sidebar";
import { Outlet, useLocation, useNavigate } from "react-router";
import { useAuth } from "react-oidc-context";

export default function App() {
  const [open, setOpen] = useState(true);
  const auth = useAuth();
  const router = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await auth.signoutRedirect({
      post_logout_redirect_uri: window.location.origin,
    });
    await router("/");
  };

  const handleLogin = async () => {
    sessionStorage.setItem("postLoginRedirect", location.pathname);
    await auth.signinRedirect();
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        width: "100%",
        overflow: "hidden",
      }}
    >
      <Sidebar
        open={open}
        onLogin={handleLogin}
        onToggle={() => setOpen(!open)}
        user={auth.user}
        onLogout={handleLogout}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          transition: "margin 0.3s",
          marginLeft: 0,
          marginTop: 0,
          display: "flex",
          height: "100%",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <Box sx={{ width: "100%" }}>
          <IconButton
            sx={{
              display: { xs: "inline-flex", sm: "none" },
              mb: 0,
            }}
            onClick={() => setOpen(!open)}
          >
            <MenuIcon />
          </IconButton>
        </Box>

        <Box
          sx={{
            width: "100%",
            flex: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {auth.error && <div>Oops... {auth.error.message}</div>}
          {auth.isLoading && <div>Logging in...</div>}
          {!auth.error && !auth.isLoading && <Outlet />}
        </Box>
      </Box>
    </Box>
  );
}
