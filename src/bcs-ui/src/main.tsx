import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, Route, Routes } from "react-router";
import Home from "./routes/Home.tsx";
import Settings from "./routes/Settings.tsx";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { AuthProvider } from "react-oidc-context";
import Private from "./components/Private.tsx";
import Chat from "./components/Chat.tsx";

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#00bfa5' },
    background: { default: '#121212', paper: '#1e1e1e' },
  },
});

const oidcConfig = {
  authority: "https://dev-kpiuw0wghy7ta8x8.us.auth0.com",
  client_id: "ZB6G0jz2KVW6acAmLhdibQ5ykL02YcBy",
  redirect_uri: window.location.origin,
  response_type: "code",
  scope: "openid profile email",
  onSigninCallback: () => {
    // Remove query params from URL
    window.history.replaceState({}, document.title, "/");
  },
  // ...
};

createRoot(document.getElementById("root")!).render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
  <AuthProvider {...oidcConfig}>
    <BrowserRouter>
      <Routes>
        <Route element={<App />}>
          <Route index element={<Home />} />
          <Route path="settings" element={<Private><Settings /></Private>} />
          <Route path="chat/:id" element={<Private><Chat /></Private>} />
        </Route>
      </Routes>
    </BrowserRouter>
    </AuthProvider>

  </ThemeProvider>
);
