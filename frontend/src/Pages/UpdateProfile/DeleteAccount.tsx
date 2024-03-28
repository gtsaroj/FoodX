import React from "react";

const DeleteAccount = () => {
  return (
    <div className="flex flex-col w-full  items-baseline p-3 rounded-md justify-center gap-10 pb-5">
      <div className="flex flex-col items-start  justify-center gap-16">
        <h1 className="text-[25px]">Delete Account</h1>
        <div className="flex flex-col items-baseline justify-center gap-2">
          <p className="text-xl ">Would you like to delete account ?</p>
          <h2 className="text-sm lg:pr-36  sm:pr-20 pr-12 text-[var(--dark-secondary-text)] ">
            This action is irreversible and all your data will be lost. If you
            need assistance or have concerns, contact us at foodx@gmail.com. To
            proceed with account deletion, click below.
          </h2>
        </div>
      </div>

        <form action="" className="w-full items-baseline flex flex-col pr-10">
          <div className="flex flex-col w-[300px] items-start gap-1">
            <label>Type "Delete My Account" Below</label>
            <input
              type="text"
              id="phoneNumber"
              value=""
              className="outline-none py-[5px] lg:py-[7px] px-[8px] focus:bg-[#d9d9d9] rounded-md border-[1px] w-full"
            />
          </div>
          <div className="w-full flex justify-end">
          <button
            type="submit"
            className=" w-[200px] h-[40px] text-sm  rounded-md bg-[var(--primary-color)] hover:bg-[var(--primary-light)] text-[var(--light-text)]  font-bold tracking-wide transition-colors duration-500 ease-in-out mt-5"
          >
            Delete My Account
          </button>
   </div>
        </form>
     
    </div>
  );
};

export default DeleteAccount;
