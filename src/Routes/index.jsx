import { createBrowserRouter } from "react-router-dom";
import Layout from "../Layout";
import Login from "../Pages/Auth/Login";
import Register from "../Pages/Auth/Register";

import Users from "../Pages/Users";
import Brands from "../Pages/Brands";
import Products from "../Pages/Products";
import Categories from "../Pages/Categories";

const router = createBrowserRouter([
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index:true ,
        element: <Products />,
      },
      {
        path: "/categories",
        element: <Categories />,
      },
      {
        path: "/brands",
        element: <Brands />,
      },
      {
        path: "users",
        element: <Users />,
      },
    ],
  },
]);
export default router;
