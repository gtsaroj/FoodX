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
    <div className="bg-[var(--light-foreground)] flex flex-col items-center  w-full py-8 px-4 text-[var(--dark-text)]">
      <div className="flex flex-col items-center justify-center gap-3 sm:items-baseline">
        <h1 className="w-full pl-4 text-2xl font-bold tracking-wider sm:pl-2 text-start text-[var(--dark-text)]">
          Edit Profile
        </h1>
        <div>
          <EditProfile />
        </div>
        <div className="flex flex-col items-start gap-3 py-8">
          <h1 className="pl-4 text-2xl font-bold tracking-wider sm:pl-2 text-[var(--dark-text)]">
            Change Password
          </h1>
          <div className="">
            <PasswordChange />
          </div>
        </div>
        <div className="flex flex-col items-baseline gap-3">
          <h1 className="pl-4 text-2xl font-bold sm:pl-2 text-[var(text-[var(--dark-text)])] tracking-wider">
            Delete Account
          </h1>
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
    <div className="items-center justify-center w-full h-full">
      <UpdateProfile />

      <Toaster />
    </div>
  );
};
