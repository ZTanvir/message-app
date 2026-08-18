import { createContext } from "react";
import type { User } from "../../types/types";

type AuthContextType = {
  user: User | null;
  logIn: (user: User) => void;
  logOut: () => void;
};

export const AuthContext = createContext<null | AuthContextType>(null);
