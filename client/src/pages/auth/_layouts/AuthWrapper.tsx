import { Outlet } from "react-router";
import { useAuthStore } from "@/state-stores/auth";
import { useGetMe } from "@/hooks/useAuth";
import { PageLoader } from "@/components/PageLoader";

const AuthWrapper = () => {
  const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated);
  const setUser = useAuthStore((state) => state.setUser);
  const { data: user, isLoading } = useGetMe();

  if (isLoading) {
    return <PageLoader />;
  }

  if (user?.data?.data) {
    setUser(user.data.data);
    setIsAuthenticated(true);
  }

  return <Outlet />;
};

export default AuthWrapper;
