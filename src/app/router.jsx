import { createBrowserRouter } from "react-router-dom"
import Login from "../modules/auth/pages/login"
import Register from "../modules/auth/pages/register"
import Home from "../modules/recipes/pages/home"
import Shell from "./layout/shell"
import Profile from "../modules/user/pages/Profile"

export const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/register", element: <Register /> },
  {
    path: "/profile",
    element: (
      <Shell>
        <Profile />
      </Shell>
    ),
  },
  {
    path: "/home",
    element: (
      <Shell>
        <Home />
      </Shell>
    ),
  },
]);
