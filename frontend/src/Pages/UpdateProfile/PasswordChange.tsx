import { Eye, EyeOff } from "lucide-react";
import React, { ChangeEvent, FormEvent, useState } from "react";
import {
  ChangePasswordType,
  allFieldsRequired,
  checkPassword,
} from "./UpdateProfileValidation";
import { updateUserPassword } from "../../firebase/utils";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../Reducer/Store";
import { authLogout } from "../../Reducer/authReducer";
import HashLoader from "react-spinners/HashLoader";
import toast from "react-hot-toast";

const PasswordChange = () => {
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, SetNewPassword] = useState<string>("");
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");
  const [ShowPassword, setShowPassword] = useState<boolean>(false);
  let [ValidateError, setValidateError] = useState<Record<string, string>>({});

  const [changePassword, setChangePassword] = useState<boolean>(false);
  const [passwordChanging, setPasswordChanging] = useState<boolean>(false);

  function Validation(error: Record<string, string>) {
    const collectionOfPassword: ChangePasswordType = {
      oldPassword,
      newPassword,
      confirmNewPassword,
    };
    checkPassword(collectionOfPassword, error);

    if (Object.keys(error).length === 0) {
      return null;
    } else {
      return error;
    }
  }

  console.log(ValidateError);
  const dispatch = useDispatch<AppDispatch>();

  const HandlePasswordChange = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const error: Record<string, string> = {};
    Validation(error);
    setValidateError(error);

    try {
      if (Validation(error) === null) {
        setPasswordChanging(true);
        await updateUserPassword(newPassword).then((res: any) => {
          toast.success("Your password Changed SuccessFully");
          console.log(res);
          dispatch(authLogout());
        });
        setPasswordChanging(false);
      }
    } catch (error) {
      setPasswordChanging(true);
      throw new Error("Password Change Failed =>" + error);
    }
    setPasswordChanging(false);
  };

  return (
    <div className="flex items-center w-full rounded-md  px-10     py-5 justify-center">
      <form
        action="
 "
        onSubmit={HandlePasswordChange}
        className="flex flex-col gap-3  w-full items-end "
      >
        <div className="flex w-full flex-col h-[65px] lg:h-[73px]  items-start relative  cursor-pointer">
          <label htmlFor="confirmpassword" className=" text-[15px]">
            Old Password
          </label>
          {changePassword ? (
            <input
              type={ShowPassword ? "text" : "password"}
              id="confirmpassword"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="outline-none  relative py-[5px] lg:py-[7px] px-[8px] focus:bg-[#d9d9d9] rounded-md border-[1px] w-full "
            />
          ) : (
            <input
              type={ShowPassword ? "text" : "password"}
              id="confirmpassword"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
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
              New Password
            </label>
            {changePassword ? (
              <input
                type={ShowPassword ? "text" : "password"}
                id="password"
                value={newPassword}
                onChange={(e) => SetNewPassword(e.target.value)}
                className="outline-none py-[5px] lg:py-[7px] px-[8px] focus:bg-[#d9d9d9] rounded-md border-[1px] w-full "
              />
            ) : (
              <input
                type={ShowPassword ? "text" : "password"}
                id="password"
                value={newPassword}
                onChange={(e) => SetNewPassword(e.target.value)}
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
              Confirm New Password
            </label>
            {changePassword ? (
              <input
                type={ShowPassword ? "text" : "password"}
                id="confirmpassword"
                value={confirmNewPassword}
                onChange={(event) => setConfirmNewPassword(event.target.value)}
                className="outline-none  relative py-[5px] lg:py-[7px] px-[8px] focus:bg-[#d9d9d9] rounded-md border-[1px] w-full "
              />
            ) : (
              <input
                type={ShowPassword ? "text" : "password"}
                id="confirmpassword"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
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
            {passwordChanging ? (
              <div className="flex items-center justify-center gap-3 text-sm">
                Save Change
                <HashLoader color="white" size={"15px"} />
              </div>
            ) : (
              "  Save Change"
            )}
          </button>
        ) : (
          <p
            onClick={() => setChangePassword(!changePassword)}
            className=" flex cursor-pointer items-center justify-center w-[200px] h-[40px] text-sm  rounded-md bg-[var(--primary-color)] hover:bg-[var(--primary-light)] text-[var(--light-text)]  font-bold tracking-wide transition-colors duration-500 ease-in-out mt-5"
          >
            Change Password
          </p>
        )}
      </form>
    </div>
  );
};

export default PasswordChange;
