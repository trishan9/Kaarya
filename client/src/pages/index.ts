import { lazy } from "react";

import Home from "./Home";
const Login = lazy(() => import("./auth/Login"));
const Register = lazy(() => import("./auth/Register"));

export { Home, Login, Register };
