import { useAuth } from "../../hooks";
import { AuthContext } from "./AuthContext";

export function AuthContextProvider({
  children,
}: {
  children: React.ReactElement;
}) {
  const { user, logIn, logOut } = useAuth();

  return (
    <AuthContext.Provider value={{ user, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}
