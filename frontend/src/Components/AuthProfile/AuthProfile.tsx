import React, { useState } from "react";
import { makeRequest } from "../../makeRequest";
import { signOutUser } from "../../firebase/Authentication";
import { useDispatch } from "react-redux";
import { authLogout } from "../../Reducer/user.reducer";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { User } from "../../models/user.model";
import { resetCart } from "../../Reducer/product.reducer";
import { DarkMode } from "../Button/DarkMode.button";
import { BringToFront, LogOut } from "lucide-react";

interface Prop {
  user: User;
  closeModal: () => void;
}

const Profile: React.FC<Prop> = ({ user, closeModal }: Prop) => {
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const toastLoader = toast.loading("Logging out, please wait...");
    setLoading(true);
    try {
      const response = await makeRequest.post("/users/logout");

      if (response.status === 200) {
        await signOutUser();
        dispatch(authLogout());
        dispatch(resetCart());
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        toast.dismiss(toastLoader);
        toast.success("Logged out successfully!");
      } else {
        console.log(` Error : authProfile`);
      }
    } catch (error) {
      toast.dismiss(toastLoader);
      toast.error("Error logging out. Please try again.");
      // throw new Error("Error logging out." + error);
    }
    setLoading(false);
    closeModal();
  };

  return (
    <div className=" px-3 border border-[var(--dark-border)] shadow-md py-4 flex bg-[var(--light-foreground)] flex-col sm:w-[350px] w-[300px]  rounded-md items-baseline justify-center gap-5">
      <div className="flex flex-col items-baseline justify-center gap-1 w-full">
        <p className="sm:text-[17px] text-[14px] tracking-wide text-[var(--dark-text)]">
          Currently in
        </p>
        <div
          onClick={() => {
            navigate("/profile");
            closeModal();
          }}
          className="flex items-center justify-start gap-3 cursor-pointer w-full hover:bg-[var(--light-background)] p-1 rounded-md"
        >
          <div>
            <img
              src={user.avatar}
              className="sm:w-[100px] w-[60px] h-[50px] sm:h-[77px] rounded-full"
              alt=""
            />
          </div>
          <div className="flex flex-col items-baseline justify-center gap-0.5 w-full">
            <div className="flex justify-between w-full">
              <p className="text-[var(--dark-text)] text-[14px] sm:text-lg font-semibold">
                {user.fullName}
              </p>
            </div>

            <p className="sm:text-sm text-xs text-[var(--dark-secondary-text)] ">
              {user.email}
            </p>
          </div>
        </div>
      </div>
      <div className="w-full flex-col space-y-2 items-start justify-center">
        <p className="text-[13px] text-[var(--dark-text)]">More options</p>
        <div className="flex flex-col items-baseline justify-start gap-1 w-full">
          <button
            onClick={() => {
              navigate("/orders");
              closeModal();
            }}
            className=" flex items-center justify-start gap-5  cursor-pointer hover:bg-[#e8e8e8] dark:hover:bg-[#121b28]   w-full p-3 rounded duration-150 "
          >
            <BringToFront className="size-5" />
            View Orders
          </button>
          <DarkMode />
          <button
            disabled={loading}
            onClick={() => handleLogout()}
            className=" flex items-center justify-start gap-5  cursor-pointer hover:bg-[#e8e8e8] dark:hover:bg-[#121b28] w-full p-3 rounded duration-150"
          >
            <LogOut className="size-5 " />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
