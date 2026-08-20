import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import _viteEnv from "../env";
import { BrowserRouter, Routes, Route } from "react-router";
import HomePage from "./pages/home";
import AuthLayout from "./layouts/AuthLayout";
import Login from "./pages/auth/component/login";
import SignUp from "./pages/auth/component/signUp";
import { AuthContextProvider } from "./contexts/authContext/AuthProvider";
import DashboardLayout from "./layouts/DashboardLayout";
import AppPage from "./pages/app";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <Routes>
          <Route path="/" element={<AppPage />} />
          <Route element={<DashboardLayout />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/profile/:userId" element={<HomePage />} />
          </Route>

          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
          </Route>
        </Routes>
      </AuthContextProvider>
    </BrowserRouter>
  </StrictMode>,
);
