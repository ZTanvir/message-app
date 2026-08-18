import { useAuth } from "../../hooks";
import { AuthContext } from "./AuthContext";

export function AuthContextProvider({
  children,
}: {
  children: React.ReactElement;
}) {
  const { authed, user, logIn, logOut } = useAuth();

  return (
    <AuthContext.Provider value={{ authed, user, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}
