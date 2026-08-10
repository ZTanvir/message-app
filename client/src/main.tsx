import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import viteEnv from "../env";
import { BrowserRouter, Routes, Route } from "react-router";
import AuthLayout from "./layouts/AuthLayout";
import Login from "./pages/auth/component/login";
import SignUp from "./pages/auth/component/signUp";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<h1>dsds</h1>} />
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
