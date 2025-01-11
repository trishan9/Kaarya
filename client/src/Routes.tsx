import { BrowserRouter, Route, Routes } from "react-router";
import {
  AuthLayout,
  AuthWrapper,
  CreateWorkspace,
  Home,
  Login,
  ProtectedLayout,
  Register,
  StandaloneLayout,
  DashboardLayout,
  NotFound,
  WorkspaceIdSettings,
  WorkspaceIdJoinPage,
  MembersList,
} from "./pages";
import LandingPage from "./pages/marketing/LandingPage";
import { ProjectIdPage } from "./pages/dashboard/projects/ProjectIdPage";
import { ProjectIdSettingsPage } from "./pages/dashboard/projects/ProjectIdSettingsPage";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthWrapper />}>
          <Route element={<ProtectedLayout />}>
            <Route index element={<Home />} />

            <Route path="workspaces">
              <Route element={<StandaloneLayout />}>
                <Route path="create" element={<CreateWorkspace />} />

                <Route path=":workspaceId">
                  <Route path="settings" element={<WorkspaceIdSettings />} />
                  <Route path="members" element={<MembersList />} />
                  <Route path="join/:inviteCode" element={<WorkspaceIdJoinPage />} />

                  <Route path="projects">
                  <Route path=":projectId/settings" element={<ProjectIdSettingsPage />} />
                </Route>

                </Route>
              </Route>

              <Route path=":workspaceId" element={<DashboardLayout />}>
                <Route index element={<div>This is Workspace Page</div>} />

                <Route path="tasks" element={<div>This is Task Page</div>} />

                <Route path="projects">
                  <Route path=":projectId" element={<ProjectIdPage />} />
                </Route>

                <Route
                  path="members"
                  element={<div>This is Members Page</div>}
                />
              </Route>
            </Route>
          </Route>

          <Route element={<AuthLayout />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>
        </Route>

        <Route path="/landing" element={<LandingPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
