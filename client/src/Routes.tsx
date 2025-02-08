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
  WorkspaceIdPage,
  ProjectIdSettingsPage,
  TasksPage,
  TaskIdPage,
  ProjectIdPage,
  WorkspaceChatPage,
  ProjectLogs,
} from "./pages";

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

                  <Route
                    path="join/:inviteCode"
                    element={<WorkspaceIdJoinPage />}
                  />

                  <Route path="projects">
                    <Route
                      path=":projectId/settings"
                      element={<ProjectIdSettingsPage />}
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

                  <Route path=":projectId/logs" element={<ProjectLogs />} />
                </Route>

                <Route path="chat" element={<WorkspaceChatPage />} />
              </Route>
            </Route>
          </Route>

          <Route element={<AuthLayout />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
