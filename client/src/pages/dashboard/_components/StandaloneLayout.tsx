import { Link, Outlet } from "react-router";
import logo from "@/assets/logo.png";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const StandaloneLayout = () => {
  return (
    <main className="min-h-screen bg-neutral-100">
      <div className="mx-auto max-w-screen-2xl p-4">
        <nav className="flex justify-between items-center h-[73px]">
          <Link to="/">
            <img src={logo} alt="logo" width={152} height={56} />
          </Link>

          <Avatar>
            <AvatarFallback className="bg-gray-200 border border-gray-300">
              T
            </AvatarFallback>
          </Avatar>
        </nav>
        <div className="flex flex-col items-center justify-center py-4 md:py-12">
          <Outlet />
        </div>
      </div>
    </main>
  );
};

export default StandaloneLayout;
