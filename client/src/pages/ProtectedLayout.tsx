import { useAuthStore } from "@/state-stores/auth";
import { Navigate, Outlet } from "react-router";

const ProtectedLayout = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    console.log("User is not authenicated!");
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedLayout;
