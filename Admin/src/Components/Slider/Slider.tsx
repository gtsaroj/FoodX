import React from "react";
import collegeLogo from "../../assets/logo/texas.png";
import {
  LayoutDashboard,
  ListOrdered,
  BookUser,
  LineChart,
  Utensils,
  Shapes,
  Mail,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Slider: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className=" w-[300px] lg:h-[100vh]  bg-[var(--light-foreground)] flex gap-10 flex-col items-center justify-center rounded-md px-3 py-4 ">
      <div className="w-[200px]">
        <img className="container h-full " src={collegeLogo} alt="" />
      </div>
      {/* Admin Account Design */}
      
      {/* <div className="flex bg-[#d8d6dc60] items-center justify-center p-1 gap-2">
        <div className="w-[50px]">
          <img className="container h-full" src={avatar} alt="" />
        </div>
        <div>
          <h1 className="text-sm text-[var(--dark-secondary-text)] ">
            sarojgt326@gmail.com
          </h1>
          <h1 className="text-sm text-[var(--dark-secondary-text)] font-semibold ">
            Saroj GT
          </h1>
        </div>
        <button>
          {" "}
          <ArrowDown className=" size-4 text-[var(--dark-secondary-text)] " />{" "}
        </button>
      </div> */}
      
      <ul className=" w-full flex flex-col items-start justify-center gap-8">
        <li
          onClick={() => navigate("/")}
          className="flex items-center justify-start gap-5 cursor-pointer hover:bg-[#8a849577] w-full py-1 px-2 rounded-md duration-150  "
        >
          <LayoutDashboard />
          <span>Dashboard</span>
        </li>
        <li onClick={()=> navigate("/analytics")} className="flex items-center justify-start gap-5 cursor-pointer hover:bg-[#8a849577]  w-full py-1 px-2 rounded-md duration-150 ">
          <LineChart />
          <span>Analytics</span>
        </li>
        <li
          onClick={() => navigate("/food-list")}
          className="flex items-center justify-start gap-5 cursor-pointer hover:bg-[#8a849577]  w-full py-1 px-2 rounded-md duration-150 "
        >
          <Utensils />
          <span>Items</span>
        </li>
        <li className="flex items-center justify-start gap-5 cursor-pointer hover:bg-[#8a849577]  w-full py-1 px-2 rounded-md duration-150 ">
          <Shapes />
          <span>Category</span>
        </li>
        <li onClick={()=> navigate("/order-list")} className="flex items-center justify-start gap-5 cursor-pointer hover:bg-[#8a849577] w-full py-1 px-2 rounded-md duration-150   ">
          <ListOrdered />
          <span>Order</span>
        </li>
        <li onClick={()=> navigate("/customer-list")} className="flex items-center justify-start gap-5 cursor-pointer hover:bg-[#8a849577]  w-full py-1 px-2 rounded-md duration-150  ">
          <BookUser />
          <span>Customers</span>
        </li>
        <li className="flex items-center justify-start gap-5 cursor-pointer hover:bg-[#8a849577]  w-full py-1 px-2 rounded-md duration-150  ">
          <Mail />
          <span>Contact</span>
        </li>


      </ul>
    </div>
  );
};

export default Slider;
