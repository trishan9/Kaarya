import { Outlet } from "react-router";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/state-stores/auth";
import { useGetMe } from "@/hooks/useAuth";

const AuthWrapper = () => {
  const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated);
  const setUser = useAuthStore((state) => state.setUser);
  const { data: user, isLoading } = useGetMe();

  if (isLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-[#F5F7F6]">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (user?.data?.data) {
    console.log(user);
    setUser(user.data.data);
    setIsAuthenticated(true);
  }

  return <Outlet />;
};

export default AuthWrapper;
