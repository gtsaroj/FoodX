import React, { useEffect, useState } from "react";
import Dasboard from "./Pages/Dasboard";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Outlet,
} from "react-router-dom";
import { DesktopSlider, MobileSlider } from "./Components/Slider/Slider";
import Analytics from "./Pages/Analytics";
import OrderList from "./Pages/OrderList";
import CustomerList from "./Pages/CustomerList";
import TicketPage from "./Pages/TicketPage";
import { AdminProfile } from "./Pages/Admin/AdminProfile";
import BannerPage from "./Pages/BannerPage";
import FoodPage from "./Pages/FoodPage";
import Login from "./Auth/Login/Login";
import { Register } from "./Auth/Register/Register";
import { PrivateRoute } from "./PrivateRoute";
import { useSelector } from "react-redux";
import { RootState } from "./Reducer/Store";
import NotFoundPage from "./Pages/404Page/NotFoundPage";
import Footer from "./Footer/Footer";
import { CategoryPage } from "./Pages/CategoryPage";

const MainPage = () => {
  return (
    <div className="w-full overflow-hidden flex  flex-col justify-center items-center ">
      <div className=" flex xl:flex-row flex-col w-full 2xl:container lg:h-[100vh] gap-2 py-3 items-start justify-center  px-3 xl:px-5">
        <div className="xl:flex hidden ">
          <DesktopSlider />
        </div>
        <div className="flex  xl:hidden w-full">
          <MobileSlider/>
         </div>
        <div className="2xl:container px-7 w-full h-[100vh] overflow-y-auto flex flex-col items-center bg-[var(--light-foreground)]  ">
          <Outlet />
          <Footer/>
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
        <Route path="register/" element={<Register />} />
        <Route element={<PrivateRoute UserRole={["admins", "Chef"]} />}>
          <Route path="admin/" element={<MainPage />}>
            <Route element={<PrivateRoute UserRole={["admins", "Chef"]} />}>
              <Route index element={<Dasboard />} />
            </Route>
            <Route element={<PrivateRoute UserRole={["admins"]} />}>
              <Route path="analytics" element={<Analytics />} />
            </Route>
            <Route element={<PrivateRoute UserRole={["admins", "Chef"]} />}>
              <Route path="order-list" element={<OrderList />} />
            </Route>
            <Route element={<PrivateRoute UserRole={["admins"]} />}>
              <Route path="customer-list" element={<CustomerList />} />
            </Route>

            <Route element={<PrivateRoute UserRole={["admins"]} />}>
              <Route path="contact/tickets" element={<TicketPage />} />
            </Route>
            <Route element={<PrivateRoute UserRole={["admins"]} />}>
              <Route path="contact/admin" element={<AdminProfile />} />
            </Route>
            <Route element={<PrivateRoute UserRole={["admins", "Chef"]} />}>
              <Route path="collection/foodlist" element={<FoodPage />} />
            </Route>
            <Route element={<PrivateRoute UserRole={["admins", "Chef"]} />}>
              <Route path="collection/banner" element={<BannerPage />} />
            </Route>
            <Route element={<PrivateRoute UserRole={["admins", "Chef"]} />}>
              <Route path="category" element={<CategoryPage />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
