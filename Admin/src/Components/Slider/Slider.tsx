import React, { useState } from "react";
import collegeLogo from "../../assets/logo/texas.png";
import {
  LayoutDashboard,
  ListOrdered,
  BookUser,
  LineChart,
  Utensils,
  Shapes,
  Mail,
  CircleUser,
  Ticket,
  ChevronRight,
  Combine,
  Fullscreen,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Logout from "../Logout/Logout";

const Slider: React.FC = () => {
  const navigate = useNavigate();

  const [openContact, setOpenContact] = useState<boolean>(false);
  const [openCollection, setOpenCollection] = useState<boolean>(false);
  return (
    <div className=" w-[300px] lg:h-[100vh] overflow-auto py-8  bg-[var(--light-foreground)] flex gap-10 flex-col items-center justify-center rounded-md px-3 py-4 ">
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
        <li
          onClick={() => navigate("/analytics")}
          className="flex items-center justify-start gap-5 cursor-pointer hover:bg-[#8a849577]  w-full py-1 px-2 rounded-md duration-150 "
        >
          <LineChart />
          <span>Analytics</span>
        </li>
        <li className="flex relative w-full flex-col gap-3 items-center justify-start  ">
          <button
            onClick={() => setOpenCollection(!openCollection)}
            className="flex  items-center justify-start gap-5 cursor-pointer hover:bg-[#8a849577]  w-full py-1 px-2 rounded-md duration-500"
          >
            <Combine />
            <span>Collections</span>
            <ChevronRight
              className={` duration-200 size-5 ${
                openCollection ? "rotate-90" : ""
              } `}
            />
          </button>
          <ul
            className={`px-2 w-full flex flex-col duration-500  ${
              openCollection
                ? "flex z-[8] bottom-[-80px] opacity-100"
                : "hidden opacity-0 bottom-[0px] z-[-1]"
            } items-start   gap-3 justify-center`}
          >
            <li
              onClick={() => navigate("/collection/foodlist")}
              className=" text-[14px] flex items-center justify-start gap-5 cursor-pointer hover:bg-[#8a849577]  w-full py-1 px-2 rounded-md duration-150"
            >
              <Utensils  className="size-5"/>
              Food list
            </li>
            <li
              onClick={() => navigate("/collection/banner")}
              className=" text-[14px] flex items-center justify-start gap-5 cursor-pointer hover:bg-[#8a849577]  w-full py-1 px-2 rounded-md duration-150"
            >
              <Fullscreen className="size-5" />
              Banner
            </li>
          </ul>
        </li>
        <li className="flex items-center justify-start gap-5 cursor-pointer hover:bg-[#8a849577]  w-full py-1 px-2 rounded-md duration-150 ">
          <Shapes />
          <span>Category</span>
        </li>
        <li
          onClick={() => navigate("/order-list")}
          className="flex items-center justify-start gap-5 cursor-pointer hover:bg-[#8a849577] w-full py-1 px-2 rounded-md duration-150   "
        >
          <ListOrdered />
          <span>Order</span>
        </li>
        <li
          onClick={() => navigate("/customer-list")}
          className="flex items-center justify-start gap-5 cursor-pointer hover:bg-[#8a849577]  w-full py-1 px-2 rounded-md duration-150  "
        >
          <BookUser />
          <span>Customers</span>
        </li>
        <li className="flex relative w-full flex-col gap-3 items-center justify-start  ">
          <button
            onClick={() => setOpenContact(!openContact)}
            className="flex  items-center justify-start gap-5 cursor-pointer hover:bg-[#8a849577]  w-full py-1 px-2 rounded-md duration-500"
          >
            <Mail />
            <span>Contact</span>
            <ChevronRight
              className={` duration-200 size-5 ${
                openContact ? "rotate-90" : ""
              } `}
            />
          </button>
          <ul
            className={`px-2 w-full flex flex-col duration-500  ${
              openContact
                ? "flex z-[8] bottom-[-80px] opacity-100"
                : "hidden opacity-0 bottom-[0px] z-[-1]"
            } items-start   gap-3 justify-center`}
          >
            <li
              onClick={() => navigate("/contact/admin")}
              className=" text-[14px] flex items-center justify-start gap-5 cursor-pointer hover:bg-[#8a849577]  w-full py-1 px-2 rounded-md duration-150"
            >
              <CircleUser />
              Admin Details
            </li>
            <Link
              to={"/contact/tickets"}
              className=" text-[14px] flex items-center justify-start gap-5 cursor-pointer hover:bg-[#8a849577]  w-full py-1 px-2 rounded-md duration-150"
            >
              <Ticket />
              My Requests
            </Link>
          </ul>
        </li>
      </ul>
      <Logout />
    </div>
  );
};

export default Slider;
