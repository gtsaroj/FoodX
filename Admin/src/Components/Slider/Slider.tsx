import React, { ChangeEvent, useEffect, useRef, useState } from "react";
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
import Logout from "../Logout/Logout";
import { signOut } from "../../Services";
import { Loader } from "../Common/Loader/Loader";
import { useSelector } from "react-redux";
import { RootState } from "../../Reducer/Store";
import Profile from "../../Auth/AuthProfile";

interface DesktopSliderProp {
  closeFn: () => void;
  open: boolean;
}

export const DesktopSlider: React.FC<DesktopSliderProp> = ({
  closeFn,
  open,
}) => {
  const reference = useRef<HTMLDivElement | null>(null);
  const [openContact, setOpenContact] = useState<boolean>(false);
  const [openCollection, setOpenCollection] = useState<boolean>(false);
  const [url, setUrl] = useState<string>("");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        reference.current &&
        !reference.current.contains(event.target as any)
      ) {
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
    role: "admin",
  };

  return (
    <div
      ref={reference}
      className="  w-[300px] px-3 py-4 h-screen  bg-[var(--light-foreground)] flex flex-col items-center justify-between rounded "
    >
      <div className="flex flex-col justify-between w-full h-full gap-5 py-2 overflow-auto ">
        {/* College Logo Section */}
        <div className="flex items-center justify-center w-full py-3 ">
          <div className="items-center justify-center hidden xl:flex ">
            <img
              className=" xl:w-full max-w-[200px]"
              src={collegeLogo}
              alt=""
            />
          </div>

          <div className="flex items-center justify-between gap-3 pb-8 pr-5 xl:hidden">
            <div className="w-[200px]">
              <img className="w-full h-full " src={collegeLogo} alt="" />
            </div>
            <button onClick={closeFn} className="hover:text-red-600">
              <X className="size-9" />
            </button>
          </div>
        </div>

        {/* Actions Section */}
        <div className="flex items-start justify-start flex-grow h-full overflow-auto ">
          <ul className="flex flex-col text-[var(--dark-text)] items-start justify-center w-full gap-5">
            <li
              onClick={() => setUrl("/admin")}
              className="flex items-center dark:hover:text-[var(--light-text)] justify-start gap-5 cursor-pointer hover:bg-[#e8e8e8] dark:hover:bg-[#9ca3af]  w-full py-3 px-2 rounded duration-150  "
            >
              <LayoutDashboard />
              <span>Dashboard</span>
            </li>
            {auth.role !== "admin" ? (
              ""
            ) : (
              <li
                onClick={() => setUrl("analytics")}
                className="flex items-center justify-start dark:hover:text-[var(--light-text)] gap-5 cursor-pointer hover:bg-[#e8e8e8] dark:hover:bg-[#9ca3af]   w-full p-3 rounded duration-150 "
              >
                <LineChart />
                <span>Analytics</span>
              </li>
            )}
            <li className="relative flex flex-col items-center justify-start w-full gap-3 ">
              <button
                onClick={() => setOpenCollection(!openCollection)}
                className="flex  items-center  dark:hover:text-[var(--light-text)] justify-start gap-5 cursor-pointer dark:hover:bg-[#9ca3af]  hover:bg-[#e8e8e8]  w-full p-3 rounded duration-500"
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
                  onClick={() => setUrl("collection/foodlist")}
                  className=" text-[14px] flex items-center dark:hover:text-[var(--light-text)] justify-start gap-5 cursor-pointer dark:hover:bg-[#9ca3af]  hover:bg-[#e8e8e8]  w-full p-3 rounded duration-150"
                >
                  <Utensils className="size-5" />
                  Food list
                </li>
                <li
                  onClick={() => setUrl("collection/banner")}
                  className=" text-[14px] flex items-center dark:hover:text-[var(--light-text)] justify-start gap-5 cursor-pointer dark:hover:bg-[#9ca3af]  hover:bg-[#e8e8e8]  w-full p-3 rounded duration-150"
                >
                  <Fullscreen className="size-5" />
                  Banner
                </li>
              </ul>
            </li>
            <li
              onClick={() => setUrl("category")}
              className="flex items-center justify-start gap-5 dark:hover:text-[var(--light-text)] cursor-pointer hover:bg-[#e8e8e8] dark:hover:bg-[#9ca3af]   w-full p-3 rounded duration-150 "
            >
              <Shapes />
              <span>Category</span>
            </li>
            <li
              onClick={() => setUrl("order-list")}
              className="flex items-center justify-start gap-5  dark:hover:text-[var(--light-text)] cursor-pointer hover:bg-[#e8e8e8] dark:hover:bg-[#9ca3af]  w-full p-3 rounded duration-150   "
            >
              <ListOrdered />
              <span>Order</span>
            </li>
            {auth.role !== "admin" ? (
              ""
            ) : (
              <li
                onClick={() => setUrl("customer-list")}
                className="flex items-center justify-start dark:hover:text-[var(--light-text)] gap-5 cursor-pointer hover:bg-[#e8e8e8] dark:hover:bg-[#9ca3af]   w-full p-3 rounded duration-150  "
              >
                <BookUser />
                <span>Customers</span>
              </li>
            )}
            <li className="relative flex flex-col items-center justify-start w-full gap-3 ">
              <button
                onClick={() => setOpenContact(!openContact)}
                className="flex  items-center justify-start dark:hover:text-[var(--light-text)] gap-5 cursor-pointer hover:bg-[#e8e8e8] dark:hover:bg-[#9ca3af]   w-full p-3 rounded duration-500"
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
                {auth.role !== "admin" ? (
                  ""
                ) : (
                  <li
                    onClick={() => setUrl("contact/profile")}
                    className=" text-[14px] flex items-center dark:hover:text-[var(--light-text)] justify-start gap-5 cursor-pointer dark:hover:bg-[#9ca3af] hover:bg-[#e8e8e8]  w-full p-3 rounded duration-150"
                  >
                    <CircleUser />
                    Admin Details
                  </li>
                )}
                {auth.role !== "Chef" ? (
                  ""
                ) : (
                  <li
                    onClick={() => setUrl("contact/profile")}
                    className=" text-[14px] flex items-center dark:hover:text-[var(--light-text)] justify-start gap-5 cursor-pointer dark:hover:bg-[#9ca3af]  hover:bg-[#e8e8e8]  w-full p-3 rounded duration-150"
                  >
                    <CircleUser />
                    Chef Details
                  </li>
                )}
                {auth.role !== "admin" ? (
                  ""
                ) : (
                  <li
                    onClick={() => setUrl("contact/tickets")}
                    className=" text-[14px] flex items-center dark:hover:text-[var(--light-text)] justify-start gap-5 cursor-pointer dark:hover:bg-[#9ca3af]  hover:bg-[#e8e8e8]  w-full p-3 rounded duration-150"
                  >
                    <Ticket />
                    My Requests
                  </li>
                )}
              </ul>
            </li>
          </ul>
        </div>

        {/* Logout Section */}
        <Logout logout={() => signOut()} />
      </div>
      {url && <Loader url={url} />}
    </div>
  );
};

export const MobileSlider: React.FC = () => {
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const [isDark, setIsDark] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const profileReference = useRef<HTMLDivElement>();


  useEffect(() => {
    const closeModal = (event: MouseEvent) => {
      if (
        profileReference.current &&
        !profileReference.current.contains(event.target as any)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", closeModal);
    }
    if (isDark) {
      document.body.classList.add("dark");
    }
    if (!isDark) {
      document.body.classList.remove("dark");
    }

    return () => {
      document.removeEventListener("mousedown", closeModal);
    };
  }, [isDark, isOpen]);
  const reference = useRef<HTMLDivElement>(null);
  const user = useSelector(
    (state: RootState) => state.root.auth.userInfo
  );

  return (
    <div className="relative flex items-center justify-between w-full px-4 lg:shadow-none">
      <div className="flex items-center justify-center gap-4">
        <div className="w-[150px]">
          <img className="w-full h-full" src={collegeLogo} alt="" />
        </div>
      </div>
      <div className="flex  items-center justify-around gap-3">
        <button onClick={() => setOpenMenu(!openMenu)}>
          {openMenu ? <X className="size-8 text-[var(--dark-text)] " /> : <Menu className="size-8 text-[var(--dark-text)] " />}
        </button>
        <div className="flex gap-5 items-center justify-start">
          <label className="switch">
            <input
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setIsDark(event.target.checked)
              }
              type="checkbox"
            />
            <span className="slider"></span>
          </label>
          <div>
            {user ? (
              <div
                onClick={() => setIsOpen(!isOpen)}
                ref={profileReference as any}
                className=" relative  cursor-pointer  "
              >
                {" "}
                <img
                  src={user.avatar}
                  className="w-10 hover:ring-[var(--dark-border)] hover:ring-4 duration-150 h-10 rounded-full"
                  alt=""
                />
                <div
                  className={`absolute duration-150 right-[-5px] top-12 ${
                    isOpen
                      ? "visible z-[1] opacity-100 translate-y-0"
                      : "invisible -translate-y-2 opacity-0 z-[-1]"
                  } `}
                >
                  <Profile user={user} />
                </div>
              </div>
            ) : (
              <User />
            )}
          </div>
        </div>
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
