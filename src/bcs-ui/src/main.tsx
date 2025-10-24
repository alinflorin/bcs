import { createRoot } from "react-dom/client";
import "./index.css";
import "./services/interceptor";
import App from "./App.tsx";
import { BrowserRouter, Route, Routes } from "react-router";
import Home from "./routes/Home.tsx";
import Settings from "./routes/Settings.tsx";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { AuthProvider } from "react-oidc-context";
import Private from "./components/Private.tsx";
import ViewChat from "./routes/ViewChat.tsx";
import oidcConfig from "./config/auth.ts";
import theme from "./config/theme.ts";
import OauthCallback from "./routes/OauthCallback.tsx";
import NotificationsProvider from "./providers/notifications-provider.tsx";
import NewChat from "./routes/NewChat.tsx";
import Search from "./routes/Search.tsx";
import { Provider as BusProvider } from "react-bus";
import Admin from "./routes/Admin.tsx";
import { ConfirmProvider } from "./hooks/useConfirmDialog.tsx";
import ViewPublicChat from "./routes/ViewPublicChat.tsx";

createRoot(document.getElementById("root")!).render(
  <BusProvider>
    <NotificationsProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider {...oidcConfig}>
          <ConfirmProvider>
            <BrowserRouter>
              <Routes>
                <Route element={<App />}>
                  <Route index element={<Home />} />
                  <Route path="public/:publicId" element={<ViewPublicChat />} />
                  <Route path="oauth-callback" element={<OauthCallback />} />
                  <Route path="settings" element={ <Private> <Settings/> </Private>} />
                  <Route path="new-chat" element={ <Private> <NewChat/> </Private>}/>
                  <Route path="chat/:id" element={ <Private><ViewChat/> </Private>}/>
                  <Route path="search" element={ <Private> <Search/> </Private>}/>
                  <Route path="admin" element={ <Private adminOnly={true}><Admin/> </Private>}/>
                </Route>
              </Routes>
            </BrowserRouter>
          </ConfirmProvider>
        </AuthProvider>
      </ThemeProvider>
    </NotificationsProvider>
  </BusProvider>
);
