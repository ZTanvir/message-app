import { useEffect, useState } from "react";
import type { User } from "../types/types";
import authService from "../services/authService";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function checkUserLoginStatus() {
      const data = await authService.checkLoggedIn();
      if (data.success) {
        setUser(data.user);
        return;
      }
      setUser(null);
    }
    checkUserLoginStatus();
  }, []);

  return {
    user,
    logIn(user: User) {
      setUser(user);
    },
    logOut() {
      setUser(null);
    },
  };
}
