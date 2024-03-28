import React, { useEffect, useRef } from "react";
import { makeRequest } from "../../makeRequest";
import { signOutUser } from "../../firebase/Authentication";
import { useDispatch } from "react-redux";
import { authLogout } from "../../Reducer/authReducer";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

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
    const response = await makeRequest.post("/users/logout");
    console.log(response.data);
    await signOutUser();
    dispatch(authLogout());
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
  };
 

  return (
    <div className=" px-3 py-4 flex bg-[var(--light-text)] flex-col w-[300px]  rounded-md items-baseline justify-center gap-5">
      <div className="flex flex-col items-baseline justify-center gap-1 w-full">
        <p className="text-[12px] text-[var(--dark-text)]">Currently in</p>
        <div className="flex items-center justify-start gap-3 w-full hover:bg-[#8080807c] p-1 rounded-md">
          <div>
            <img src={user.avatar} className="w-20 h-16 rounded-full" alt="" />
          </div>
          <div className="flex flex-col items-baseline justify-center gap-1 w-full">
            <div className="flex justify-between w-full">
              <p className="text-[var(--dark-text)] text-[15px] font-semibold">
                {user.fullName}
              </p>
              <button
                onClick={() => navigate("/update-profile")}
                className="text-sm pr-2 text-[var(--dark-text)] hover:underline"
              >
                edit
              </button>
            </div>
            <p className="text-sm ">Personal</p>
            <p className="text-sm">{user.email}</p>
          </div>
        </div>
      </div>
      <div className="w-full flex-col space-y-2 items-start justify-center">
        <p className="text-[13px] text-[var(--dark-text)]">More options</p>
        <div className="flex flex-col items-baseline justify-start gap-1 w-full">
          <button className=" flex justify-start items-center  rounded-sm text-[var(--dark-text)] hover:bg-[#8080807c] w-full text-[15px] py-1 px-4 bg-[var(--secondary-light-text)]">
            View Orders
          </button>
          <button
            onClick={() => handleLogout()}
            className=" flex justify-start items-center  rounded-sm text-[var(--dark-text)] hover:bg-[#8080807c] w-full text-[15px] py-1 px-4 bg-[var(--secondary-light-text)]"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
