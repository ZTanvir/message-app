import { Navigate, useLocation, Outlet } from "react-router";
import Sidebar from "../components/Sidebar";
import { useAuthContext } from "../hooks/contextConsume";

export default function DashboardLayout() {
  const { user } = useAuthContext();
  const location = useLocation();
  if (user === null) {
    return <Navigate to="/login" replace state={{ path: location.pathname }} />;
  }
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <div className="order-1 mt-auto lg:order-0 lg:mt-0">
        <Sidebar />
      </div>
      <Outlet />
    </div>
  );
}
