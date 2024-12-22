import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import { Home, Login, Register } from "./pages";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />

        <Route
          element={
            <div className="p-6">
              Auth Layout
              <Outlet />
            </div>
          }
        >
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
