import Footer from "./Components/Footer/Footer";
import Login from "./Components/Login/Login";
import { Header } from "./Components/Navbar/Navbar";
import { Register } from "./Components/Register/Register";
import NotFoundPage from "./Pages/404Page/NotFoundPage";
import Home from "./Pages/Home/Home";
import {
  Routes,
  Route,
  BrowserRouter,
  Outlet,
} from "react-router-dom";
import { ForgotPassword } from "./Components/ForgotPassword/ForgotPassword";
import { MobileCart, Payment } from "./Components/Payment/Payment.tsx";
import { OrderComponent } from "./Pages/Order/Order.tsx";
import { UserProfileComponent } from "./Pages/UpdateProfile/ProfileSection.tsx";
import { useEffect, useState } from "react";
import { RootState } from "./Store.ts";
import { useSelector } from "react-redux";

const HomePage = () => {
  return (
    <div className="flex items-center justify-center w-full h-full min-w-[100vw]  ">
      <div className="w-full h-full max-w-[1500px] flex flex-col justify-center items-center ">
        <div className="mb-[100px] z-50">
          <Header />
        </div>
        <div className="w-full">
          <Outlet/>
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
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        {/* <Route path="/email-verification" element={<VerificationPage />} /> */}
        <Route>
          <Route path="/" element={<HomePage />}>
            <Route index element={<Home />} />
            <Route path="/cart" element={<MobileCart />}></Route>
            <Route path="/profile" element={<UserProfileComponent />} />
            <Route path="/orders" element={<OrderComponent />} />
            <Route path="/cart/checkout" element={<Payment />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};
