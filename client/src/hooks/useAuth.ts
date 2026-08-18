import { useState } from "react";
import type { User } from "../types/types";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);

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
