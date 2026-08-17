import { useState } from "react";
import type { User } from "../types/componentTypes";

export function useAuth() {
  const [authed, setAuthed] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  return {
    authed,
    user,
    logIn(user: User) {
      setAuthed(true);
      setUser(user);
    },
    logOut() {
      setAuthed(false);
      setUser(null);
    },
  };
}
