import React from "react";
import Dasboard from "./Pages/Dasboard";
import {
  Outlet,
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import Slider from "./Components/Slider/Slider";
import Analytics from "./Pages/Analytics";
import OrderList from "./Pages/OrderList";
import CustomerList from "./Pages/CustomerList";
import TicketPage from "./Pages/TicketPage";
import { AdminProfile } from "./Pages/Admin/AdminProfile";
import BannerPage from "./Pages/BannerPage";
import FoodPage from "./Pages/FoodPage";

const MainPage = () => {
  return (
    <div className="w-full overflow-hidden flex justify-center items-center ">
      <div className="flex container lg:h-[100vh] gap-2 py-3 items-start justify-center  px-5">
        <Slider />
        <div className="container lg:h-[100vh]  overflow-y-scroll  rounded-md flex  items-start justify-center bg-[var(--light-foreground)]  ">
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
        <Route path="/" element={<MainPage />}>
          <Route path="/" element={<Dasboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/order-list" element={<OrderList />} />
          <Route path="/customer-list" element={<CustomerList />} />
          <Route path="/contact/tickets" element={<TicketPage />} />
          <Route path="/contact/admin" element={<AdminProfile />} />
          <Route path="/collection/foodlist" element={<FoodPage />} />
          <Route path="/collection/banner" element={<BannerPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
