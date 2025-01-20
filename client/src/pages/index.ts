import Home from "./Home";
import AuthLayout from "./auth/_components/AuthLayout";
import Login from "./auth/Login";
import Register from "./auth/Register";
import ProtectedLayout from "./ProtectedLayout";
import AuthWrapper from "./auth/_components/AuthWrapper";
import StandaloneLayout from "./dashboard/_components/StandaloneLayout";
import CreateWorkspace from "./dashboard/workspaces/CreateWorkspace";
import DashboardLayout from "./dashboard/_components/DashboardLayout";
import WorkspaceIdSettings from "./dashboard/workspaces/WorkspaceIdSettings";
import { WorkspaceIdJoinPage } from "./dashboard/workspaces/WorkspaceIdJoinPage";
import { MembersList } from "./dashboard/workspaces/MemberList";
import NotFound from "./NotFound";
import { WorkspaceIdPage } from "./dashboard/workspaces/WorkspaceIdPage";
export {
  ProtectedLayout,
  Home,
  AuthLayout,
  AuthWrapper,
  Login,
  Register,
  CreateWorkspace,
  StandaloneLayout,
  NotFound,
  DashboardLayout,
  WorkspaceIdPage,
  WorkspaceIdSettings,
  WorkspaceIdJoinPage,
  MembersList,
};
