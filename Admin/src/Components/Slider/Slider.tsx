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

interface DesktopSliderProp {
  closeFn: () => void;
  open: boolean;
}

export const DesktopSlider: React.FC<DesktopSliderProp> = ({
  closeFn,
  open,
}) => {
  console.log(open);
  const navigate = useNavigate();
  const reference = useRef<HTMLDivElement | null>(null);
  const [openContact, setOpenContact] = useState<boolean>(false);
  const [openCollection, setOpenCollection] = useState<boolean>(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (reference.current && !reference.current.contains(event.target)) {
        open && closeFn();
      }
    };
    if (open) {
      document.body.style.overflowY = "hidden";
      window.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      window.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflowY = "unset";
    };
  }, [open, closeFn]);

  const auth = {
    role: "admins",
  };

  return (
    <div
      ref={reference}
      className="  w-[300px]  2xl:px-9 py-4 h-screen  bg-[var(--light-foreground)] flex  flex-col items-center justify-between rounded px-3  "
    >
      <div className="flex flex-col justify-between gap-5 py-2 overflow-auto w-full">
        <div className=" hidden xl:flex pb-8 w-[200px]">
          <img className="w-full h-full " src={collegeLogo} alt="" />
        </div>
        <div className=" flex pr-5  pb-8 items-center justify-between xl:hidden ">
          <div className="w-[200px]">
            {" "}
            <img className="w-full h-full " src={collegeLogo} alt="" />
          </div>
          <button onClick={closeFn}>
            <X className="size-9" />
          </button>
        </div>
        <div className="lg:h-[80vh] overflow-auto">
          <ul className=" w-full flex flex-col items-start justify-center gap-7">
            <li
              onClick={() => navigate("/admin")}
              className="flex items-center justify-start gap-5 cursor-pointer hover:bg-[#8a849577] w-full py-3 px-2 rounded duration-150  "
            >
              <LayoutDashboard />
              <span>Dashboard</span>
            </li>
            {auth.role !== "admins" ? (
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
            {auth.role !== "admins" ? (
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
                {auth.role !== "admins" ? (
                  ""
                ) : (
                  <li
                    onClick={() => navigate("contact/profile")}
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
                    onClick={() => navigate("contact/profile")}
                    className=" text-[14px] flex items-center justify-start gap-5 cursor-pointer hover:bg-[#8a849577]  w-full p-3 rounded duration-150"
                  >
                    <CircleUser />
                    Chef Details
                  </li>
                )}
                {auth.role !== "admins" ? (
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
  console.log(openMenu);
  const reference = useRef<HTMLDivElement>(null);

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
        className={`absolute w-[1300px] z-[100] duration-200  ${
          openMenu ? "backdrop-blur-sm opacity-100 " : "blur-0 "
        }   duration-150 top-[-11px] ${
          openMenu ? "left-[-11px]" : "left-[-3000px]"
        } `}
      >
        <DesktopSlider open={openMenu} closeFn={() => setOpenMenu(!openMenu)} />
      </div>
    </div>
  );
};
