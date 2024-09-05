import React, { useEffect, useRef } from "react";
import { makeRequest } from "../../makeRequest";
import { signOutUser } from "../../firebase/Authentication";
import { useDispatch } from "react-redux";
import { authLogout } from "../../Reducer/user.reducer";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

interface userModel {
  uid: string;
  email: string;
  fullName: string;
  avatar: string;
}
interface Prop {
  user: userModel;
}

const Profile: React.FC<Prop> = ({ user }: Prop) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const toastLoader = toast.loading("Logging out, please wait...");
    try {
      const response = await makeRequest.post("/users/logout");

      if (response.status === 200) {
        await signOutUser();
        dispatch(authLogout());
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        toast.dismiss(toastLoader);
        toast.success("Logged out successfully!");
      } else {
        throw new Error("Logout failed");
      }
    } catch (error) {
      toast.dismiss(toastLoader);
      toast.error("Error logging out. Please try again.");
      throw new Error("Error logging out." + error);
    }
  };

  return (
    <div className=" px-3 border border-[var(--dark-border)] shadow-md py-4 flex bg-[var(--light-foreground)] flex-col w-[350px]  rounded-md items-baseline justify-center gap-5">
      <div className="flex flex-col items-baseline justify-center gap-1 w-full">
        <p className="text-[17px] tracking-wide text-[var(--dark-text)]">
          Currently in
        </p>
        <div
          onClick={() => navigate("/profile")}
          className="flex items-center justify-start gap-3 cursor-pointer w-full hover:bg-[var(--light-background)] p-1 rounded-md"
        >
          <div>
            <img
              src={user.avatar}
              className="w-[100px] h-[77px] rounded-full"
              alt=""
            />
          </div>
          <div className="flex flex-col items-baseline justify-center gap-1 w-full">
            <div className="flex justify-between w-full">
              <p className="text-[var(--dark-text)] text-lg font-semibold">
                {user.fullName}
              </p>
            </div>

            <p className="text-sm ">{user.email}</p>
          </div>
        </div>
      </div>
      <div className="w-full flex-col space-y-2 items-start justify-center">
        <p className="text-[13px] text-[var(--dark-text)]">More options</p>
        <div className="flex flex-col items-baseline justify-start gap-1 w-full">
          <button
            onClick={() => navigate("/orders")}
            className=" flex justify-start items-center  rounded text-[var(--dark-text)] hover:bg-[var(--light-background)] w-full text-[17px] py-1.5 px-4 "
          >
            View Orders
          </button>
          <button
            onClick={() => handleLogout()}
            className=" flex justify-start items-center  rounded text-[var(--dark-text)]  w-full text-[17px] py-1.5 px-4 hover:bg-[var(--light-background)]"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
