import React from "react";

import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import EditProfile from "./EditProfile";
import PasswordChange from "./PasswordChange";
import DeleteAccount from "./DeleteAccount";

export interface UpdateProfileType {
  avatar: string | File;
  fullName: string;
  phoneNumber: string;
}

export const UpdateProfile: React.FC = () => {
  const navigate = useNavigate();

  const param = useParams().setting;


  let content;
  if (param === "edit-profile") {
    content = <EditProfile />;
  } else if (param === "change-password") {
    content = <PasswordChange />;
  } else if (param === "delete-account") {
    content = <DeleteAccount />;
  }

  return (
    <div>
      <div className=" w-full h-full flex items-baseline justify-start px-5 pb-[10px] font-bold text-[var(--primary-color)]  text-center">
        <h1 className="md:hidden text-sm">Profile{" > "}{param}</h1>
        <h1 className="hidden md:block text-sm">Profile{" > "}{param}</h1>
      </div>
      <div className="flex  justify-start items-start gap-1  lg:gap-16 w-full">
        <div className="flex h-[65vh] flex-col py-8 gap-16 items-baseline px-3 bg-[var(--light-text)] w-full sm:max-w-[300px] sm:min-w-[250px] rounded-md">
          <h1 className="text-2xl">Setting</h1>
          <div className="flex flex-col  items-baseline gap-5 w-full">
            <button
              onClick={() => navigate("/update-profile/edit-profile")}
              className=" flex justify-start items-center  rounded-sm text-[var(--dark-text)] hover:bg-[#8080807c] w-full text-[16px] py-1 px-4 bg-[var(--secondary-light-text)]"
            >
              Edit Profile
            </button>
            <button
              onClick={() => navigate("/update-profile/change-password")}
              className=" flex justify-start items-center  rounded-sm text-[var(--dark-text)] hover:bg-[#8080807c] w-full text-[16px] py-1 px-4 bg-[var(--secondary-light-text)]"
            >
              Password Change
            </button>
            <button
              onClick={() => navigate("/update-profile/delete-account")}
              className=" flex justify-start items-center  rounded-sm text-[var(--dark-text)] hover:bg-[#8080807c] w-full text-[16px] py-1 px-4 bg-[var(--secondary-light-text)]"
            >
              Delete Account
            </button>
         
          </div>
        </div>
 
        <div className=" sm:flex hidden w-full px-3  ">
        <div className=" h-[65vh]  bg-[var(--light-foreground)] w-full ">
        {content === undefined ? <EditProfile/> : content}
        </div>
       </div>
      </div>
    </div>
  );
};

export const Register = () => {
  return (
    <div className="w-full h-full justify-center items-center">
      <UpdateProfile />

      <Toaster />
    </div>
  );
};
