import type React from "react";
import { Navigate, useLocation } from "react-router";
import { useAuthContext } from "../hooks/contextConsume";

export default function RequireAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuthContext();
  const location = useLocation();
  return user !== null ? (
    children
  ) : (
    <Navigate to="/login" replace state={{ path: location.pathname }} />
  );
}
