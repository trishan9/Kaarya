import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "@/state-stores/auth";

const ProtectedLayout = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedLayout;
