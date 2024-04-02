import React, { ChangeEvent, FormEvent, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { makeRequest } from "../../makeRequest";
import { deleteAccount } from "../../firebase/utils";
import { useDispatch } from "react-redux";
import { authLogout } from "../../Reducer/authReducer";
import Cookies from "js-cookie";
import HashLoader from "react-spinners/HashLoader";

const DeleteAccount: React.FC = () => {
  const [confirmDelete, setConfirmDelete] = useState<string>();
  const [deletingAccount, setDeletingAccount] = useState<boolean>(false);
  const dispatch = useDispatch();

  console.log(deletingAccount);
  const HandleDeleteAccount = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (confirmDelete !== "Delete My Account") {
      return toast.error("Please Confirm To Delete ");
    }

    try {
      setDeletingAccount(true);
      await makeRequest.post("/users/delete-user");
      await deleteAccount();
      dispatch(authLogout());
      Cookies.remove("refreshToken");
      Cookies.remove("accessToken");
      setDeletingAccount(false);
    } catch (error) {
      setDeletingAccount(true);
      throw new Error("Failed To Delete Account" + error);
    }
    setDeletingAccount(false);
  };

  return (
    <div className="flex flex-col w-full  items-baseline p-3 rounded-md justify-center gap-10 pb-5">
      <div className="flex flex-col items-start  justify-center gap-16">
        <div className="flex flex-col items-baseline justify-center gap-2">
          <p className="text-xl ">Would you like to delete account ?</p>
          <h2 className="text-sm sm:w-[700px] w-full lg:pr-36  sm:pr-20 pr-12 text-[var(--dark-secondary-text)] ">
            This action is irreversible and all your data will be lost. If you
            need assistance or have concerns, contact us at foodx@gmail.com. To
            proceed with account deletion, click below.
          </h2>
        </div>
      </div>

      <form
        action=""
        className="w-full items-baseline flex flex-col pr-10"
        onSubmit={HandleDeleteAccount}
      >
        <div className="flex flex-col w-[300px] items-start gap-1">
          <label htmlFor="">Type "Delete My Account" Below</label>
          <input
            type="text"
            onChange={(e) => setConfirmDelete(e.target.value)}
            value={confirmDelete}
            className="outline-none py-[5px] lg:py-[7px] px-[8px] focus:bg-[#d9d9d9] rounded-md border-[1px] w-full"
          />
        </div>
        <div className="w-full flex justify-end">
          <button className=" w-[200px] h-[40px] rounded-md bg-[var(--primary-color)] hover:bg-[var(--primary-light)] text-[var(--light-text)] text-sm font-bold tracking-wide transition-colors duration-500 ease-in-out mt-5 ">
            {deletingAccount ? (
              <div className="flex text-sm items-center justify-center gap-6">
                Deleting <HashLoader color="white" size={"15px"} />
              </div>
            ) : (
              "Delete Account"
            )}
          </button>
        </div>
      </form>
      <Toaster />
    </div>
  );
};

export default DeleteAccount;
