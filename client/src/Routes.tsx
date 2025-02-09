import { BrowserRouter, Route, Routes } from "react-router";
import {
  CreateWorkspacePage,
  HomePage,
  LoginPage,
  RegisterPage,
  NotFoundPage,
  WorkspaceSettingsPage,
  WorkspaceConnectPage,
  WorkspaceMembersPage,
  WorkspaceIdPage,
  ProjectSettingsPage,
  TasksPage,
  TaskIdPage,
  ProjectIdPage,
  ProjectLogsPage,
  JoinWorkspacePage,
} from "./pages";
import {
  AuthLayout,
  AuthWrapper,
  ProtectedLayout,
  StandaloneLayout,
  DashboardLayout,
} from "./pages/layouts";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<NotFoundPage />} />

        <Route element={<AuthWrapper />}>
          <Route element={<AuthLayout />}>
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
          </Route>

          <Route element={<ProtectedLayout />}>
            <Route index element={<HomePage />} />

            <Route path="workspaces">
              <Route element={<StandaloneLayout />}>
                <Route path="create" element={<CreateWorkspacePage />} />

                <Route path=":workspaceId">
                  <Route path="settings" element={<WorkspaceSettingsPage />} />

                  <Route path="members" element={<WorkspaceMembersPage />} />

                  <Route
                    path="join/:inviteCode"
                    element={<JoinWorkspacePage />}
                  />

                  <Route path="projects">
                    <Route
                      path=":projectId/settings"
                      element={<ProjectSettingsPage />}
                    />
                  </Route>
                </Route>
              </Route>

              <Route path=":workspaceId" element={<DashboardLayout />}>
                <Route index element={<WorkspaceIdPage />} />

                <Route path="tasks" element={<TasksPage />} />

                <Route path="tasks/:taskId" element={<TaskIdPage />} />

                <Route path="projects">
                  <Route path=":projectId" element={<ProjectIdPage />} />

                  <Route path=":projectId/logs" element={<ProjectLogsPage />} />
                </Route>

                <Route path="connect" element={<WorkspaceConnectPage />} />
              </Route>
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;