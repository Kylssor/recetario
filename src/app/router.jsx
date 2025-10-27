import { createBrowserRouter } from "react-router-dom"
import Login from "../modules/auth/pages/login"
import Register from "../modules/auth/pages/register"
import Home from "../modules/recipes/pages/home"
import Shell from "./layout/shell"

export const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/register", element: <Register /> },
  {
    path: "/home",
    element: (
      <Shell>
        <Home />
      </Shell>
    ),
  },
]);
