import { useEffect, useState } from "react";
import Footer from "./Components/Footer/Footer";
import Login from "./Components/Login/Login";
import { Header } from "./Components/Navbar/Navbar";
import { Register } from "./Components/Register/Register";
import NotFoundPage from "./Pages/404Page/NotFoundPage";
import Home from "./Pages/Home/Home";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "./Reducer/Store";
import PrivateRoute from "./PrivateRoute";
import VerificationPage from "./Components/VericationPage/VerificationPage";
import { ForgotPassword } from "./Components/ForgotPassword/ForgotPassword";
import Cart from "./Pages/Cart/Cart";
import {Payment} from "./Components/Payment/Payment.tsx"

const HomePage = () => {
  return (
    <div className="flex items-center justify-center w-full h-full min-w-[100vw]  ">
      <div className="w-full h-full max-w-[1500px] flex flex-col justify-center items-center ">
        <div className="mb-[100px] z-50">
          <Header />
        </div>
        <div className="w-full">
          <Home />
        </div>
        <div>
          <Footer />
        </div>
      </div>
    </div>
  );
};
export const App: React.FC = () => {
  // persistor.purge()
  const [ShowContent, SetShowContent] = useState<boolean>(true);
  const auth = useSelector((state: RootState) => state.root.auth);

  useEffect(() => {
    auth.success ? SetShowContent(true) : SetShowContent(false);
  }, [auth]);
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={ShowContent ? <Navigate to={"/"} /> : <Login />}
        />
        <Route
          path="/register"
          element={ShowContent ? <Navigate to={"/"} /> : <Register />}
        />
        <Route
          path="forgot-password"
          element={ShowContent ? <Navigate to={"/"} /> : <ForgotPassword />}
        />
        <Route path="/email-verification" element={<VerificationPage />} />
        <Route
          path="/"
          element={ShowContent ? <PrivateRoute /> : <Navigate to={"/login"} />}
        >
          <Route index element={<HomePage />} />
          <Route path="/cart" element ={<Payment/>} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};
