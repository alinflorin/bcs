import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, Route, Routes } from "react-router";
import Home from "./routes/Home.tsx";
import Settings from "./routes/Settings.tsx";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { AuthProvider } from "react-oidc-context";
import Private from "./components/Private.tsx";
import Chat from "./components/Chat.tsx";
import oidcConfig from "./config/auth.ts";
import theme from "./config/theme.ts";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <AuthProvider {...oidcConfig}>
      <BrowserRouter>
        <Routes>
          <Route element={<App />}>
            <Route index element={<Home />} />
            <Route
              path="settings"
              element={
                <Private>
                  <Settings />
                </Private>
              }
            />
            <Route
              path="chat/:id"
              element={
                <Private>
                  <Chat />
                </Private>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </ThemeProvider>
);
