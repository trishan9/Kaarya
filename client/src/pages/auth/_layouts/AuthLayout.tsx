import { Link, Navigate, Outlet, useLocation } from "react-router";
import kaaryaLogo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/state-stores/auth";

const AuthLayout = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const location = useLocation();
  const isLogin = location.pathname === "/login";

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="bg-neutral-100 min-h-screen">
      <div className="mx-auto max-w-screen-3xl px-4 sm:px-12 py-2">
        <nav className="flex items-center justify-between">
          <Link to="/">
            <img src={kaaryaLogo} width={150} height={56} alt="logo" />
          </Link>

          <Link to={isLogin ? "/register" : "/login"}>
            <Button>{isLogin ? "Register" : "Login"}</Button>
          </Link>
        </nav>

        <div className="flex flex-col items-center justify-center pt-4 md:py-14">
          <Outlet />
        </div>
      </div>
    </main>
  );
};

export default AuthLayout;
