import { Sun, User2Icon } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../Reducer/Store";
import { User } from "../models/user.model";

const Navbar = () => {
  const user = useSelector(
    (state: RootState) => state.root.auth.userInfo
  ) as User;

  return (
    <div className="w-full border-b-2 border-[var(--light-background)] h-[80px] flex justify-between items-center gap-5 px-3 py-4">
      <h1 className="px-3 text-2xl">
        Welcome back,{" "}
        <span className="font-semibold tracking-wide">{user?.fullName}</span>
      </h1>
    </div>
  );
};

export default Navbar;
