import { Navigate } from "react-router";
import { useAuthContext } from "../../hooks/contextConsume";

export default function HomePage() {
  const { user } = useAuthContext();

  return user === null ? (
    <Navigate to="/login" replace />
  ) : (
    <Navigate to="/home" replace />
  );
}
