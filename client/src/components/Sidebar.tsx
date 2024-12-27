import { Link } from "react-router";
import { Navigation } from "./Navigation";
import { DottedSeparator } from "@/components/ui/dotted-separator";
import logo from "@/assets/logo.png"

export const Sidebar = () => {
  return (
    <aside className="h-full bg-neutral-100 px-4 pb-4 pt-0.5 w-full">
      <Link to="/">
        <img 
          src={logo} 
          alt="Logo" 
          width={164} 
          height={50}

        />
      </Link>

      <DottedSeparator className="mt-0.5 mb-2" />

      <p className="px-4">workspace</p>

      <DottedSeparator className="my-2 mb-4" />
      
      <Navigation />
      
      <DottedSeparator className="my-4" />
    </aside>
  );
};