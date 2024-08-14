import React, { useEffect, useState } from "react";
import Dasboard from "./Pages/Dashboard/Dasboard";
import collegeLogo from "./assets/logo/texas.png";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Outlet,
} from "react-router-dom";
import { DesktopSlider, MobileSlider } from "./Components/Slider/Slider";
import Analytics from "./Pages/Analytics/Analytics";
import OrderList from "./Pages/Order/OrderList";
import CustomerList from "./Pages/Customers/CustomerList";
import TicketPage from "./Pages/Tickets/TicketPage";
import { AdminProfile } from "./Pages/Admin/AdminProfile";
import BannerPage from "./Pages/BannerPage";
import FoodPage from "./Pages/Food/FoodPage";
import Login from "./Auth/Login/Login";
import { Register } from "./Auth/Register/Register";
import { PrivateRoute } from "./PrivateRoute";
import { useSelector } from "react-redux";
import { RootState } from "./Reducer/Store";
import NotFoundPage from "./Pages/404Page/NotFoundPage";
import Footer from "./Footer/Footer";
import { CategoryPage } from "./Pages/Category/CategoryPage";
import Navbar from "./Navbar/Navbar";
import { Sun, User } from "lucide-react";

const MainPage = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    isDarkMode
      ? document.body.classList.add("dark")
      : document.body.classList.remove("dark");
  }, [isDarkMode]);
  return (
    <div className="flex flex-col items-center justify-center w-full overflow-hidden ">
      <div className="bg-[var(--light-background)] hidden xl:flex w-full  items-center justify-between px-4 py-3 ">
        <div className="flex items-center justify-center gap-4">
          <div className="w-[150px]">
            <img className="w-full h-full" src={collegeLogo} alt="" />
          </div>
        </div>
        <div className="flex  items-center  gap-3">
          <div
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="cursor-pointer"
          >
            <Sun size={25} />
          </div>
          <div>
            <User />
          </div>
        </div>
      </div>
      <div className=" flex xl:flex-row flex-col w-full 2xl:container lg:h-[100vh] gap-4 py-3 items-start justify-center  px-3 xl:px-5">
        <div className="hidden xl:flex ">
          <DesktopSlider closeFn={() => {}} open={false} />
        </div>
        <div className="flex w-full xl:hidden">
          <MobileSlider />
        </div>
        <div className="w-full h-[100vh]  2xl:justify-between overflow-y-auto flex flex-col items-center bg-[var(--light-foreground)]  ">
          <div className="w-full">
            <Navbar />
            <Outlet />
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  // persistor.purge()
  const auth = useSelector((state: RootState) => state.root.auth);
  const [showContent, setShowContent] = useState<boolean>(true);

  useEffect(() => {
    auth.success ? setShowContent(true) : setShowContent(false);
  }, [auth.success]);
  return (
    <Router>
      <Routes>
        <Route
          path="login/"
          element={showContent ? <Navigate to={"/admin"} replace /> : <Login />}
        />
        <Route
          path="register/"
          element={
            showContent ? <Navigate to={"/admin"} replace /> : <Register />
          }
        />
        <Route
          element={
            <PrivateRoute role={[{ role: "admin" }, { role: "chef" }]} />
          }
        >
          <Route path="admin/" element={<MainPage />}>
            <Route
              element={
                <PrivateRoute role={[{ role: "admin" }, { role: "chef" }]} />
              }
            >
              <Route index element={<Dasboard />} />
            </Route>
            <Route element={<PrivateRoute role={[{ role: "admin" }]} />}>
              <Route path="analytics" element={<Analytics />} />
            </Route>
            <Route
              element={
                <PrivateRoute role={[{ role: "admin" }, { role: "chef" }]} />
              }
            >
              <Route path="order-list" element={<OrderList />} />
            </Route>
            <Route
              element={
                <PrivateRoute role={[{ role: "admin" }, { role: "chef" }]} />
              }
            >
              <Route path="customer-list" element={<CustomerList />} />
            </Route>

            <Route
              element={
                <PrivateRoute role={[{ role: "admin" }, { role: "chef" }]} />
              }
            >
              <Route path="contact/tickets" element={<TicketPage />} />
            </Route>
            <Route
              element={
                <PrivateRoute role={[{ role: "admin" }, { role: "chef" }]} />
              }
            >
              <Route path="contact/profile" element={<AdminProfile />} />
            </Route>
            <Route
              element={
                <PrivateRoute role={[{ role: "admin" }, { role: "chef" }]} />
              }
            >
              <Route path="collection/foodlist" element={<FoodPage />} />
            </Route>
            <Route
              element={
                <PrivateRoute role={[{ role: "admin" }, { role: "chef" }]} />
              }
            >
              <Route path="collection/banner" element={<BannerPage />} />
            </Route>
            <Route
              element={
                <PrivateRoute role={[{ role: "admin" }, { role: "chef" }]} />
              }
            >
              <Route path="category" element={<CategoryPage />} />
            </Route>
            <Route
              element={
                <PrivateRoute role={[{ role: "admin" }, { role: "chef" }]} />
              }
            >
              <Route path="profile" element={<AdminProfile />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
