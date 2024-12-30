import { useLocation } from "react-router";
import { UserButton } from "./UserButton";
import { MobileSidebar } from "./MobileSidebar";

const pathnameMap = {
  tasks: {
    title: "My Tasks",
    description: "View all of your tasks here",
  },
  projects: {
    title: "My Projects",
    description: "View tasks of your project here",
  },
} as const;

const defaultMap = {
  title: "Home",
  description: "Monitor all of your projects and tasks here",
};

export const Navbar = () => {
  const location = useLocation();
  const parts = location.pathname.split("/");
  const pathnameKey = parts[3] as keyof typeof pathnameMap;
  const { description, title } = pathnameMap[pathnameKey] || defaultMap;

  return (
    <nav className="pt-4 px-6 flex items-center justify-between">
      <div className="flex-col hidden lg:flex">
        <h1 className="text-2xl font-bold">{title}</h1>

        <p className="text-muted-foreground">{description}</p>
      </div>

      <MobileSidebar />

      <UserButton />
    </nav>
  );
};
