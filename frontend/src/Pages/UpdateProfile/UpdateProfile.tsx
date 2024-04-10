import React from "react";
import { Toaster } from "react-hot-toast";
import EditProfile from "./EditProfile";
import PasswordChange from "./PasswordChange";
import DeleteAccount from "./DeleteAccount";

export interface UpdateProfileType {
  avatar?: any;
  fullName: string;
  phoneNumber: string;
}

export const UpdateProfile: React.FC = () => {
  return (
    <div className="bg-[var(--light-foreground)] flex flex-col items-center  w-full py-6 px-4">
      <div className="flex flex-col sm:items-baseline items-center justify-center gap-3">
        <h1 className=" pl-4 sm:pl-2 w-full text-start text-xl">
          Edit Profile
        </h1>
        <div>
          <EditProfile />
        </div>
        <div className="flex py-16 flex-col items-baseline gap-3">
          <h1 className="pl-4 sm:pl-2 text-xl">Change Password</h1>
          <div>
            <PasswordChange />
          </div>
        </div>
        <div className="flex flex-col items-baseline gap-3">
          <h1 className="pl-4 sm:pl-2 text-xl">Delete Account</h1>
          <div>
            <DeleteAccount />
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
