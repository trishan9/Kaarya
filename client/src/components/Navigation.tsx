import { Link, useLocation } from "react-router";
import { Settings, UsersIcon } from "lucide-react";
import {
  GoCheckCircle,
  GoCheckCircleFill,
  GoHome,
  GoHomeFill,
} from "react-icons/go";
import { MdChatBubbleOutline, MdChatBubble } from "react-icons/md";
import { cn } from "@/lib/utils";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";

const routes = [
  {
    label: "Home",
    href: "",
    icon: GoHome,
    aciveIcon: GoHomeFill,
  },
  {
    label: "My Tasks",
    href: "/tasks",
    icon: GoCheckCircle,
    aciveIcon: GoCheckCircleFill,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
    aciveIcon: Settings,
  },
  {
    label: "Members",
    href: "/members",
    icon: UsersIcon,
    aciveIcon: UsersIcon,
  },
  {
    label: "Connect",
    href: "/connect",
    icon: MdChatBubbleOutline,
    aciveIcon: MdChatBubble,
  },
];

export const Navigation = () => {
  const workspaceId = useWorkspaceId();
  const location = useLocation();

  return (
    <ul className="flex flex-col">
      {routes.map(({ aciveIcon, href, icon, label }) => {
        const absoluteHref = `/workspaces/${workspaceId}${href}`;
        const isActive = location.pathname === absoluteHref;
        const Icon = isActive ? aciveIcon : icon;

        return (
          <Link key={href} to={absoluteHref} className="no-underline">
            <div
              className={cn(
                "flex items-center gap-2.5 p-2.5 mb-0.5 rounded-md font-medium hover:text-primary transition text-neutral-500",
                isActive && "bg-white shadow-sm hover:opacity-100 text-primary",
              )}
            >
              <Icon className="size-5 text-neutral-500" />
              {label}
            </div>
          </Link>
        );
      })}
    </ul>
  );
};
