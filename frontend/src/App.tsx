import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Routes,
  Route,
  BrowserRouter,
  Outlet,
  Navigate,
} from "react-router-dom";
import { RootState } from "./Store.ts";
import PrivateRoute from "./PrivateRoute.tsx";
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
const Payment = React.lazy(() =>
  import("./Components/Payment/Payment.tsx").then((module) => ({
    default: module.Payment,
  }))
);
const AdminProfile = React.lazy(() =>
  import("./Pages/Profile/AdminProfile.tsx").then((module) => ({
    default: module.AdminProfile,
  }))
);
const Order = React.lazy(() => import("./Pages/Order/Order.tsx"));

const HomePage: React.FC = () => {
  return (
    <div

      className="flex items-center justify-center w-full h-full min-w-[100vw]  "
    >
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
              <Route path="/cart/checkout" element={<Payment />} />
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};
