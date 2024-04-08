import React from "react";
import collegeLogo from "../../assets/logo/texas.png";
import avatar from "../../assets/logo/avatar.png";
import {
  LayoutDashboard,
  ListOrdered,
  BookUser,
  LineChart,
  Utensils,
} from "lucide-react";

const Slider: React.FC = () => {
  return (
    <div className=" w-[300px] bg-[var(--light-foreground)] flex pl-4 gap-10 flex-col items-baseline justify-center rounded-md py-3 my-2">
      <div className="flex  flex-col items-center">
        <div className="flex items-center justify-center">
          <img className="w-[120px] h-[60px] " src={collegeLogo} alt="" />
        </div>
        <div className="flex flex-col items-start justify-center gap-2">
          <img className="w-[60px] h-[60px]" src={avatar} alt="" />
          <h1 className="text-sm ">Saroj GT</h1>
        </div>
      </div>
      <ul className="flex flex-col items-start justify-center gap-5">
        <li className="flex items-center justify-center gap-1">
          <LayoutDashboard />
          <span>Dashboard</span>
        </li>
        <li className="flex items-center justify-center gap-1">
          <ListOrdered />
          <span>Order List</span>
        </li>
        <li className="flex items-center justify-center gap-1">
          <BookUser />
          <span>Customers</span>
        </li>
        <li className="flex items-center justify-center gap-1">
          <LineChart />
          <span>Analytics</span>
        </li>
        <li className="flex items-center justify-center gap-1">
          <Utensils />
          <span>Items</span>
        </li>
      </ul>
    </div>
  );
};

export default Slider;
