import { Link } from "react-router";
import { Navigation } from "./Navigation";
import { DottedSeparator } from "@/components/ui/dotted-separator";
import logo from "@/assets/logo.png";
import { WorkspaceSwitcher } from "./WorkspaceSwitcher";
import { Projects } from "@/components/Projects";

export const Sidebar = () => {
  return (
    <aside className="h-full bg-neutral-100 px-4 pb-4 pt-0.5 w-full">
      <Link to="/">
        <img src={logo} alt="Logo" width={164} height={50} />
      </Link>

      <DottedSeparator className="mt-0.5 mb-4" />

      <WorkspaceSwitcher />

      <DottedSeparator className="my-4" />

      <Navigation />

      <DottedSeparator className="my-4" />

      <Projects />
    </aside>
  );
};
