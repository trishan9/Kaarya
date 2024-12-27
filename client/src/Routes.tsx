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
  NotFound
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
              </Route>
              
              <Route path=":workspaceId" element={<DashboardLayout />}>
                <Route index element={<div>This is Workspace Page</div>} />
                <Route path="settings" element={<div>This is Setting Page</div>} />
                <Route path="tasks" element={<div>This is Task Page</div>} />
                <Route path="members" element={<div>This is Members Page</div>} />
              </Route>
            </Route>
          </Route>

          <Route element={<AuthLayout />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound/>} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
