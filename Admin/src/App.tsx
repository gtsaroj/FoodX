import React from "react";
import Dasboard from "./Pages/Dasboard";
import {
  Outlet,
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import Slider from "./Components/Slider/Slider";
import FoodList from "./Pages/FoodList";
import Analytics from "./Pages/Analytics";
import OrderList from "./Pages/OrderList";
import CustomerList from "./Pages/CustomerList";

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
          <Route path="/food-list" element={<FoodList />} />
          <Route path="/order-list" element={<OrderList />} />
          <Route path="/customer-list" element={<CustomerList />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
