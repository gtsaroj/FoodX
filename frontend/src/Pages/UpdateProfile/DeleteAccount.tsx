import React, { FormEvent, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { makeRequest } from "../../makeRequest";
import { deleteAccount } from "../../firebase/utils";
import { useDispatch } from "react-redux";
import { authLogout } from "../../Reducer/authReducer";
import Cookies from "js-cookie";
import ReAuth from "./ReAuth";

const DeleteAccount: React.FC = () => {
  const [confirmDelete, setConfirmDelete] = useState<string>();
  const [step2, setStep2] = useState<boolean>(false);

  const dispatch = useDispatch();

  const HandleDeleteAccount = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (confirmDelete !== "Delete My Account") {
      return toast.error("Please Confirm To Delete ");
    }
    setStep2(true);
  };

  const confirmToDelete = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await makeRequest.post("/users/delete-user");
      await deleteAccount().then(() =>
        setTimeout(() => {
          toast.success("Account Deleted Successfully");
        }, 2000)
      );

      dispatch(authLogout());
      Cookies.remove("refreshToken");
      Cookies.remove("accessToken");
    } catch (error) {
      throw new Error("Failed To Delete Account" + error);
    }
  };

  return (
    <div
      className={`relative px-7 py-5 flex  flex-col items-start justify-center max-w-[600px] bg-[var(--light-foreground)] gap-10 p-3 pb-5 rounded-md text-[var(--dark-text)] ${
        step2 ? "invisible" : ""
      }`}
    >
      <div className="flex flex-col items-start justify-center gap-16">
        <div className="flex flex-col items-baseline justify-center gap-2">
          <p className="font-semibold">Would you like to delete account ?</p>
          <h2 className="text-sm w-full lg:pr-36  sm:pr-20 pr-12 text-[var(--dark-secondary-text)] ">
            This action is irreversible and all your data will be lost. If you
            need assistance or have concerns, contact us at foodx@gmail.com. To
            proceed with account deletion, click below.
          </h2>
        </div>
      </div>

      <form
        action=""
        className={` w-full items-baseline flex flex-col pr-10 duration-150 ${
          step2 ? "invisible opacity-[0] " : "visible opacity-[1] "
        }`}
        onSubmit={HandleDeleteAccount}
      >
        <div className="flex flex-col items-start gap-1">
          <label htmlFor="">Type "Delete My Account" Below</label>
          <input
            type="text"
            onChange={(e) => setConfirmDelete(e.target.value)}
            value={confirmDelete}
            className="outline-none py-[5px] lg:py-[7px] px-[8px] focus:bg-[#d9d9d9] rounded-md border-[1px] w-full"
          />
        </div>
        <div className="flex  w-full">
          <button className=" w-[200px] h-[40px] rounded-md bg-[var(--primary-color)] hover:bg-[var(--primary-light)] text-[var(--light-text)] text-sm font-bold tracking-wide transition-colors duration-500 ease-in-out mt-5 ">
            Delete Account
          </button>
        </div>
      </form>

      <Toaster />
      <div
        className={` flex w-full h-full bottom-0 right-0 top-[50px] overflow-hidden  duration-300 z-[5]  items-center justify-center bg-[#00000041]  fixed ${
          step2 ? "visible opacity-[1] " : "invisible opacity-0"
        }`}
      >
        <ReAuth
          reAuthUsers={() =>
            confirmToDelete(event as unknown as FormEvent<HTMLFormElement>)
          }
        />
      </div>
    </div>
  );
};

export default DeleteAccount;
