import { Eye, EyeOff } from "lucide-react";
import React, { ChangeEvent, useState } from "react";

const PasswordChange = () => {
  const [oldPassword, setOldPassword] = useState<string>();
  const [newPassword, SetNewPassword] = useState<string>();
  const [cofirmNewPassword, setConfirmNewPassword] = useState<string>();
  const [ShowPassword, setShowPassword] = useState<boolean>(false);

  const [changePassword, setChangePassword] = useState<boolean>(false);

  const handleInputChange = (e: ChangeEvent, field: string) => {};
  return (
    <div className="flex items-center w-full rounded-md  px-10     py-5 justify-center">
      <form
        action="
 "
        className="flex flex-col gap-3  w-full items-end "
      >
        <div className="flex w-full flex-col h-[65px] lg:h-[73px]  items-start relative  cursor-pointer">
          <label htmlFor="confirmpassword" className=" text-[15px]">
            Confirm Password
          </label>
          {changePassword ? (
            <input
              type={ShowPassword ? "text" : "password"}
              id="confirmpassword"
              value={cofirmNewPassword}
              onChange={(e) => handleInputChange(e, "confirmNewPassword")}
              className="outline-none  relative py-[5px] lg:py-[7px] px-[8px] focus:bg-[#d9d9d9] rounded-md border-[1px] w-full "
            />
          ) : (
            <input
              type={ShowPassword ? "text" : "password"}
              id="confirmpassword"
              value={cofirmNewPassword}
              onChange={(e) => handleInputChange(e, "confirmNewPassword")}
              className="outline-none  relative py-[5px] lg:py-[7px] px-[8px] focus:bg-[#d9d9d9] rounded-md border-[1px] w-full "
              readOnly
            />
          )}

          <div
            className="absolute  top-[29px] lg:top-[33px]  right-[14px] w-[15px] h-[15px] text-[var(--dark-secondary-text)] "
            onClick={() => setShowPassword(!ShowPassword)}
          >
            {ShowPassword ? <Eye /> : <EyeOff />}
          </div>
        </div>
        <div className="w-full flex sm:flex-row flex-col justify-center items-center gap-[10px]">
          <div className="flex w-full flex-col h-[65px] lg:h-[73px]  items-start  relative cursor-pointer">
            <label htmlFor="password" className="font-Poppins text-[15px]">
              Password
            </label>
            {changePassword ? (
              <input
                type={ShowPassword ? "text" : "password"}
                id="password"
                value={newPassword}
                onChange={(e) => handleInputChange(e, "newPassword")}
                className="outline-none py-[5px] lg:py-[7px] px-[8px] focus:bg-[#d9d9d9] rounded-md border-[1px] w-full "
              />
            ) : (
              <input
                type={ShowPassword ? "text" : "password"}
                id="password"
                value={newPassword}
                onChange={(e) => handleInputChange(e, "newPassword")}
                className="outline-none py-[5px] lg:py-[7px] px-[8px] focus:bg-[#d9d9d9] rounded-md border-[1px] w-full "
                readOnly
              />
            )}

            <div
              className="absolute top-[29px] lg:top-[33px] text-[var(--dark-secondary-text)]  right-[14px] w-[15px] h-[15px]"
              onClick={() => setShowPassword(!ShowPassword)}
            >
              {ShowPassword ? <Eye /> : <EyeOff />}
            </div>
          </div>
          <div className="flex w-full flex-col h-[65px] lg:h-[73px]  items-start relative  cursor-pointer">
            <label htmlFor="confirmpassword" className=" text-[15px]">
              Confirm Password
            </label>
            {changePassword ? (
              <input
                type={ShowPassword ? "text" : "password"}
                id="confirmpassword"
                value={cofirmNewPassword}
                onChange={(e) => handleInputChange(e, "confirmNewPassword")}
                className="outline-none  relative py-[5px] lg:py-[7px] px-[8px] focus:bg-[#d9d9d9] rounded-md border-[1px] w-full "
              />
            ) : (
              <input
                type={ShowPassword ? "text" : "password"}
                id="confirmpassword"
                value={cofirmNewPassword}
                onChange={(e) => handleInputChange(e, "confirmNewPassword")}
                className="outline-none  relative py-[5px] lg:py-[7px] px-[8px] focus:bg-[#d9d9d9] rounded-md border-[1px] w-full "
                readOnly
              />
            )}

            <div
              className="absolute  top-[29px] lg:top-[33px]  right-[14px] w-[15px] h-[15px] text-[var(--dark-secondary-text)] "
              onClick={() => setShowPassword(!ShowPassword)}
            >
              {ShowPassword ? <Eye /> : <EyeOff />}
            </div>
          </div>
        </div>
        {changePassword ? (
          <button
            type="submit"
            className=" w-[200px] h-[40px] text-sm  rounded-md bg-[var(--primary-color)] hover:bg-[var(--primary-light)] text-[var(--light-text)]  font-bold tracking-wide transition-colors duration-500 ease-in-out mt-5"
          >
            Save Change
          </button>
        ) : (
          <p className=" flex cursor-pointer items-center justify-center w-[200px] h-[40px] text-sm  rounded-md bg-[var(--primary-color)] hover:bg-[var(--primary-light)] text-[var(--light-text)]  font-bold tracking-wide transition-colors duration-500 ease-in-out mt-5">
            Change Password
          </p>
        )}
      </form>
    </div>
  );
};

export default PasswordChange;
