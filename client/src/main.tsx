import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import viteEnv from "../env";
import { BrowserRouter, Routes, Route } from "react-router";
import AuthLayout from "./layouts/AuthLayout";
import Login from "./pages/auth/component/login";
import SignUp from "./pages/auth/component/signUp";
import HomePage from "./pages/home";
import RequireAuth from "./components/RequireAuth";
import { AuthContextProvider } from "./contexts/authContext/AuthProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/home"
            element={
              <RequireAuth>
                <h1>Welcome to chat</h1>
              </RequireAuth>
            }
          />
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
          </Route>
        </Routes>
      </AuthContextProvider>
    </BrowserRouter>
  </StrictMode>,
);
