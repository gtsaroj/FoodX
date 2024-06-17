import React, { useEffect, useRef, useState } from "react";
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
  Menu,
  User,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Logout from "../Logout/Logout";
import { signOut } from "../../Services";

interface DesktopSliderProp{
  closeFn : ()=> void
}

export const DesktopSlider: React.FC<DesktopSliderProp> = ({closeFn}) => {
  const navigate = useNavigate();

  const [openContact, setOpenContact] = useState<boolean>(false);
  const [openCollection, setOpenCollection] = useState<boolean>(false);

  const auth = {
    role: "Admin",
  };

  return (
    <div className="  w-[300px]  2xl:px-9 py-2 h-screen  bg-[var(--light-foreground)] flex  flex-col items-center justify-between rounded px-3  ">
      <div className="flex flex-col gap-7 py-2 overflow-auto w-full">
        <div className=" hidden xl:flex w-[200px]">
          <img className="w-full h-full " src={collegeLogo} alt="" />
        </div>
        <div className=" flex pr-5 items-center justify-between xl:hidden ">
          <div className="w-[200px]">
            {" "}
            <img className="w-full h-full " src={collegeLogo} alt="" />
          </div>
          <button onClick={closeFn}>
          <X className="size-9"/>
         </button>
        </div>
        <div className="lg:h-[100vh] overflow-auto">
          <ul className=" w-full flex flex-col items-start justify-center gap-5">
            <li
              onClick={() => navigate("/admin")}
              className="flex items-center justify-start gap-5 cursor-pointer hover:bg-[#8a849577] w-full py-3 px-2 rounded duration-150  "
            >
              <LayoutDashboard />
              <span>Dashboard</span>
            </li>
            {auth.role !== "Admin" ? (
              ""
            ) : (
              <li
                onClick={() => navigate("analytics")}
                className="flex items-center justify-start gap-5 cursor-pointer hover:bg-[#8a849577]  w-full p-3 rounded duration-150 "
              >
                <LineChart />
                <span>Analytics</span>
              </li>
            )}
            <li className="flex relative w-full flex-col gap-3 items-center justify-start  ">
              <button
                onClick={() => setOpenCollection(!openCollection)}
                className="flex  items-center justify-start gap-5 cursor-pointer hover:bg-[#8a849577]  w-full p-3 rounded duration-500"
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
                  onClick={() => navigate("collection/foodlist")}
                  className=" text-[14px] flex items-center justify-start gap-5 cursor-pointer hover:bg-[#8a849577]  w-full p-3 rounded duration-150"
                >
                  <Utensils className="size-5" />
                  Food list
                </li>
                <li
                  onClick={() => navigate("collection/banner")}
                  className=" text-[14px] flex items-center justify-start gap-5 cursor-pointer hover:bg-[#8a849577]  w-full p-3 rounded duration-150"
                >
                  <Fullscreen className="size-5" />
                  Banner
                </li>
              </ul>
            </li>
            <li
              onClick={() => navigate("category")}
              className="flex items-center justify-start gap-5 cursor-pointer hover:bg-[#8a849577]  w-full p-3 rounded duration-150 "
            >
              <Shapes />
              <span>Category</span>
            </li>
            <li
              onClick={() => navigate("order-list")}
              className="flex items-center justify-start gap-5 cursor-pointer hover:bg-[#8a849577] w-full p-3 rounded duration-150   "
            >
              <ListOrdered />
              <span>Order</span>
            </li>
            {auth.role !== "Admin" ? (
              ""
            ) : (
              <li
                onClick={() => navigate("customer-list")}
                className="flex items-center justify-start gap-5 cursor-pointer hover:bg-[#8a849577]  w-full p-3 rounded duration-150  "
              >
                <BookUser />
                <span>Customers</span>
              </li>
            )}
            <li className="flex relative w-full flex-col gap-3 items-center justify-start  ">
              <button
                onClick={() => setOpenContact(!openContact)}
                className="flex  items-center justify-start gap-5 cursor-pointer hover:bg-[#8a849577]  w-full p-3 rounded duration-500"
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
                {auth.role !== "Admin" ? (
                  ""
                ) : (
                  <li
                    onClick={() => navigate("contact/admin")}
                    className=" text-[14px] flex items-center justify-start gap-5 cursor-pointer hover:bg-[#8a849577]  w-full p-3 rounded duration-150"
                  >
                    <CircleUser />
                    Admin Details
                  </li>
                )}
                {auth.role !== "Chef" ? (
                  ""
                ) : (
                  <li
                    onClick={() => navigate("contact/admin")}
                    className=" text-[14px] flex items-center justify-start gap-5 cursor-pointer hover:bg-[#8a849577]  w-full p-3 rounded duration-150"
                  >
                    <CircleUser />
                    Chef Details
                  </li>
                )}
                {auth.role !== "Admin" ? (
                  ""
                ) : (
                  <li
                    onClick={() => navigate("contact/tickets")}
                    className=" text-[14px] flex items-center justify-start gap-5 cursor-pointer hover:bg-[#8a849577]  w-full p-3 rounded duration-150"
                  >
                    <Ticket />
                    My Requests
                  </li>
                )}
              </ul>
            </li>
          </ul>
        </div>
        <Logout logout={() => signOut()} />
      </div>
    </div>
  );
};

export const MobileSlider: React.FC = () => {
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const reference = useRef<HTMLDivElement>();
  useEffect(() => {
    if (openMenu) {
      document.body.style.overflow = "hidden";
      if (reference.current) {
        reference.current.style.overflow = "auto";
      }
    } else {
      document.body.style.overflow = "auto";
    }
  }, [openMenu]);

  return (
    <div className=" relative w-full lg:shadow-none flex justify-between items-center  px-4">
      <div className="flex items-center justify-center gap-4">
        <button onClick={() => setOpenMenu(!openMenu)}>
          {openMenu ? <X className="size-8" /> : <Menu className="size-8" />}
        </button>
        <div className="w-[150px]">
          <img className="w-full h-full" src={collegeLogo} alt="" />
        </div>
      </div>
      <div>
        <User />
      </div>
      <div
        ref={reference as any}
        className={`absolute z-[3000] shadow shadow-black duration-150 top-[-11px] ${
          openMenu ? "left-[-11px]" : "left-[-3000px]"
        } `}
      >
        <DesktopSlider closeFn={()=>setOpenMenu(!openMenu)} />
      </div>
    </div>
  );
};
