import { Sun, User2Icon } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../Reducer/Store";
import { User as user } from "../models/user.model";
import { User } from "lucide-react";
import "../index.css";
import { ChangeEvent, useEffect, useState } from "react";

const Navbar = () => {
  const [isDark, setIsDark] = useState<boolean>(false);

  const user = useSelector(
    (state: RootState) => state.root.auth.userInfo
  ) as user;

  useEffect(() => {
    if (isDark) {
      document.body.classList.add("dark");
    }
    if (!isDark) {
      document.body.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <div className="w-full border-b-2 border-[var(--light-background)] h-[80px] flex justify-between items-center gap-5 px-5 py-4">
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
          <User />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
