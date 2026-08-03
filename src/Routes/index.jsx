import { createBrowserRouter } from "react-router-dom";
import Layout from "../Layout";
import Register from "../Pages/Auth/Register";
import LoginOtp from "../Pages/Auth/LoginOtp";
import Categories from "../Pages/Categories";
import Brands from "../Pages/Brands";
import LoginPass from "../Pages/Auth/LoginPass";
import Login from "../Pages/Auth/Login";
import Products from "../Pages/Products";
import Users from "../Pages/Users";
import Home from "../Pages/Home";
import CreateProduct from "../Pages/Products/CreateProduct";
import CreateCategory from "../Pages/Categories/CreateCategory";
import CreateBrand from "../Pages/Brands/CreateBrand";
import Slides from "../Pages/Slides";
import CreateSlide from "../Pages/Slides/CreateSlide";
import Discounts from "../Pages/Discount";


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
    path: "/loginPass",
    element: <LoginPass />,
  },
  {
    path: "/loginOtp",
    element: <LoginOtp />,
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element:<Home/>
      },
      {
        path: "categories",
        element: <Categories />,
      },
      {
        path: "brands",
        element: <Brands />,
      },
      {
        path: "/products",
        element: <Products />,
      },
      {
        path:"users" ,
        element:<Users/>
      },
      {
        path:"/slides" ,
        element:<Slides/>
      },
      {
        path:"createProduct" ,
        element:<CreateProduct/>
      },
      {
        path:"/createCategory" ,
        element:<CreateCategory/>
      },
      {
        path:"/createBrand" ,
        element:<CreateBrand/>
      },
      {
        path:"/createSlide" ,
        element:<CreateSlide/>
      },
      {
        path:"/discount" ,
        element:<Discounts/>
      },
    ],
  },

]);

export default router;
