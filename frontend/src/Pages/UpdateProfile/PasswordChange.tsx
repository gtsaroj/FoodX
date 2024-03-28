import React, { ChangeEvent, useState } from "react";

const PasswordChange = () => {
  const [oldPassword, setOldPassword] = useState<string>();
  const [newPassword, SetNewPassword] = useState<string>();
  const [cofirmNewPassword, setConfirmNewPassword] = useState<string>();

  const handleInputChange = (e: ChangeEvent) => {};
  return (
    <div className="flex items-center w-full rounded-md  px-10     py-5 justify-center">
      <form
        action="
 "
        className="flex flex-col items-center "
      >
        <div className="flex w-full flex-col h-[65px] lg:h-[73px]  items-start ">
          <label htmlFor="fullName" className="font-Poppins text-[15px]">
            {" "}
            Old Password
          </label>
          <input
            type="email"
            id="fullName"
            value={oldPassword}
            onChange={(e) => handleInputChange(e)}
            className="outline-none py-[5px] lg:py-[7px] px-[8px] focus:bg-[#d9d9d9] rounded-md border-[1px] w-full "
          />
        </div>
        <div className="flex w-full flex-col h-[65px] lg:h-[73px]  items-start ">
          <label htmlFor="fullName" className="font-Poppins text-[15px]">
            {" "}
            New Password
          </label>
          <input
            type="email"
            id="fullName"
            value={oldPassword}
            onChange={(e) => handleInputChange(e)}
            className="outline-none py-[5px] lg:py-[7px] px-[8px] focus:bg-[#d9d9d9] rounded-md border-[1px] w-full "
          />
        </div>
        <div className="flex w-full flex-col h-[65px] lg:h-[73px]  items-start ">
          <label htmlFor="fullName" className="font-Poppins text-[15px]">
            {" "}
            Confirm New Password
          </label>
          <input
            type="email"
            id="fullName"
            value={oldPassword}
            onChange={(e) => handleInputChange(e)}
            className="outline-none py-[5px] lg:py-[7px] px-[8px] focus:bg-[#d9d9d9] rounded-md border-[1px] w-full "
          />
        </div>
        <button
          type="submit"
          className=" w-full h-[40px] text-lg  rounded-md bg-[var(--primary-color)] hover:bg-[var(--primary-light)] text-[var(--light-text)] sm:text-xl font-bold tracking-wide transition-colors duration-500 ease-in-out mt-5"
        >
          Password Change
        </button>
      </form>
    </div>
  );
};

export default PasswordChange;
