import { Outlet } from "react-router";
import { useAuthStore } from "@/state-stores/auth";
import { LandingPage } from "@/pages";

const ProtectedLayout = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <LandingPage />;
  }

  return <Outlet />;
};

export default ProtectedLayout;
