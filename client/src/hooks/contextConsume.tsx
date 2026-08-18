import { useContext } from "react";
import { AuthContext } from "../contexts/authContext/AuthContext";

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be with in an AuthContext");
  }
  return context;
}
