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
import NotFound from "./NotFound";

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
  WorkspaceIdSettings
};
