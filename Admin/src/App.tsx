import React from "react";
import Dasboard from "./Pages/Dasboard";
import {
  Outlet,
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import Slider, { NavbarSend } from "./Components/Slider/Slider";
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

const MainPage = () => {
  return (
    <div className="w-full overflow-hidden flex justify-center items-center ">
      <div className=" flex xl:flex-row flex-col w-full 2xl:container lg:h-[100vh] gap-2 py-3 items-start justify-center  px-3 xl:px-5">
        <div className="xl:flex hidden ">
          <Slider />
        </div>
        <div className="xl:hidden w-full sticky top-0 overflow-y-auto flex">
          <NavbarSend />
        </div>
        <div className="2xl:container px-2 w-full lg:h-[100vh]  overflow-y-scroll  rounded-md flex  items-start justify-center bg-[var(--light-foreground)]  ">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<PrivateRoute UserRole={["Admin", "Chef"]} />}>
          <Route path="admin/" element={<MainPage />}>
            <Route element={<PrivateRoute UserRole={["Admin", "Chef"]} />}>
              <Route index element={<Dasboard />} />
            </Route>
            <Route element={<PrivateRoute UserRole={["Admin"]} />}>
              <Route path="analytics" element={<Analytics />} />
            </Route>
            <Route element={<PrivateRoute UserRole={["Admin", "Chef"]} />}>
              <Route path="order-list" element={<OrderList />} />
            </Route>
            <Route element={<PrivateRoute UserRole={["Admin"]} />}>
              <Route path="customer-list" element={<CustomerList />} />
            </Route>

            <Route element={<PrivateRoute UserRole={["Admin"]} />}>
              <Route path="contact/tickets" element={<TicketPage />} />
            </Route>
            <Route element={<PrivateRoute UserRole={["Admin"]} />}>
              <Route path="contact/admin" element={<AdminProfile />} />
            </Route>
            <Route element={<PrivateRoute UserRole={["Admin", "Chef"]} />}>
              <Route path="collection/foodlist" element={<FoodPage />} />
            </Route>
            <Route element={<PrivateRoute UserRole={["Admin", "Chef"]} />}>
              <Route path="collection/banner" element={<BannerPage />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
