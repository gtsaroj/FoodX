import { Sun, User2Icon } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../Reducer/Store";
import { User as user } from "../models/user.model";
import { User } from "lucide-react";
import "../index.css";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import Profile from "../Auth/AuthProfile";

const Navbar = () => {
  const [isDark, setIsDark] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const profileReference = useRef<HTMLDivElement>();

  const user = useSelector(
    (state: RootState) => state.root.auth.userInfo
  ) as user;

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

  return (
    <div className="w-full  shadow-md shadow-[var(--light-foreground)] border-b-2 border-[var(--light-background)] h-[80px] hidden xl:flex justify-between  items-center gap-5 px-5 py-4">
      <h1 className="px-3 text-[var(--dark-text)] text-2xl">
        Welcome back,{" "}
        <span className="font-semibold tracking-wide">{user?.fullName}</span>
      </h1>
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
  );
};

export default Navbar;
