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
} from "./pages";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthWrapper />}>
          <Route element={<ProtectedLayout />}>
            <Route index element={<Home />} />

            <Route path="workspace" element={<StandaloneLayout />}>
              <Route
                path="create"
                element={<CreateWorkspace />}
              />
            </Route>
          </Route>

          <Route element={<AuthLayout />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
