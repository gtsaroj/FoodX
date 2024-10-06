import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Routes,
  Route,
  BrowserRouter,
  Outlet,
  Navigate,
} from "react-router-dom";
import { AppDispatch, RootState } from "./Store.ts";
const PrivateRoute = React.lazy(() => import("./PrivateRoute.tsx"));
import { getFavourites } from "./Services/favourite.services.ts";
import { addToFavourite } from "./Reducer/favourite.reducer.ts";
import { socket } from "./Utility/socket.utility.ts";
const Footer = React.lazy(() => import("./Components/Footer/Footer"));
const Login = React.lazy(() => import("./Components/Login/Login"));
const Header = React.lazy(() =>
  import("./Components/Navbar/Navbar").then((module) => ({
    default: module.Header,
  }))
);
const Register = React.lazy(() =>
  import("./Components/Register/Register").then((module) => ({
    default: module.Register,
  }))
);
const NotFoundPage = React.lazy(() => import("./Pages/404/404.Page.tsx"));
const Home = React.lazy(() => import("./Pages/Home/Home"));
const ForgotPassword = React.lazy(() =>
  import("./Components/ForgotPassword/ForgotPassword").then((module) => ({
    default: module.ForgotPassword,
  }))
);
const CartPage = React.lazy(() =>
  import("./Pages/Cart/Cart.Page.tsx").then((module) => ({
    default: module.CartPage,
  }))
);
const CheckoutPage = React.lazy(() =>
  import("./Pages/Checkout/Page.Checkout.tsx").then((module) => ({
    default: module.CheckoutPage,
  }))
);
const AdminProfile = React.lazy(() =>
  import("./Pages/Profile/UserProfile.tsx").then((module) => ({
    default: module.AdminProfile,
  }))
);
const Order = React.lazy(() => import("./Pages/Order/Order.tsx"));

const HomePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const authUser = useSelector((state: RootState) => state.root.auth.userInfo);

  const getFavouireProducts = async () => {
    try {
      const response = await getFavourites(authUser.uid as string);
      response.data.products?.forEach((data: string) => {
        dispatch(addToFavourite(data));
      });
    } catch (error) {
      throw new Error("Error while adding favourite products" + error);
    }
  };

  useEffect(() => {
    if (!authUser.uid) return;
    getFavouireProducts();
  }, [authUser.uid]);

  useEffect(() => {
    socket.connect();
  }, []);

  return (
    <div className="flex items-center justify-center w-full h-full min-w-[100vw]  ">
      <div className="w-full h-full max-w-[1500px] flex flex-col justify-center items-center ">
        <div className="mb-[100px] z-50">
          <Header />
        </div>
        <div className="w-full">
          <Outlet />
        </div>
        <div className="w-full">
          <Footer />
        </div>
      </div>
    </div>
  );
};
export const App: React.FC = () => {
  const [showContent, SetShowContent] = useState<boolean>(true);
  const auth = useSelector((state: RootState) => state.root.auth);

  const [isDark] = useState<boolean>(() => {
    const prefersDarkScheme = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    return prefersDarkScheme;
  });
  useEffect(() => {
    if (isDark) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [isDark]);

  useEffect(() => {
    auth.success ? SetShowContent(true) : SetShowContent(false);
  }, [auth]);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={showContent ? <Navigate to={"/"} /> : <Login />}
        />
        <Route
          path="/register"
          element={showContent ? <Navigate to={"/"} /> : <Register />}
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        {/* <Route path="/email-verification" element={<VerificationPage />} /> */}
        <Route>
          <Route path="/" element={<HomePage />}>
            <Route index element={<Home />} />
            <Route path="/cart" element={<CartPage />}></Route>
            <Route path="/profile" element={<AdminProfile />} />
            <Route
              element={
                <PrivateRoute userRole={["customer", "chef", "admin"]} />
              }
            >
              <Route path="/orders" element={<Order />} />
            </Route>
            <Route
              element={
                <PrivateRoute userRole={["customer", "chef", "admin"]} />
              }
            >
              <Route path="/cart/checkout" element={<CheckoutPage />} />
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};
