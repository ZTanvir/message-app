import type React from "react";
import { Navigate } from "react-router";
import { useAuthContext } from "../hooks/contextConsume";

export default function RequireAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuthContext();
  return user !== null ? children : <Navigate to="/login" replace />;
}
