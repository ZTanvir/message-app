import { Navigate, useLocation } from "react-router";
import { useAuthContext } from "../../hooks/contextConsume";

export default function AppPage() {
  const { user } = useAuthContext();
  const location = useLocation();
  if (user === null) {
    return <Navigate to="/login" replace state={{ path: location.pathname }} />;
  } else if (user) {
    return (
      <Navigate to="/messages" replace state={{ path: location.pathname }} />
    );
  }
}
