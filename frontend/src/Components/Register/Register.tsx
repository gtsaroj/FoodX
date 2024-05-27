import React, { ChangeEvent, FormEvent, useRef, useState } from "react";
import { ValidationType } from "../../models/Register.model";
import { Eye, EyeOff, Pencil } from "lucide-react";
import { signUpNewUser } from "../../firebase/Authentication";
import { registerNewUser } from "../../Reducer/authActions";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../Reducer/Store";
import { useNavigate } from "react-router-dom";
import { checkValidNumber, validatePasswordOnChange } from "./RegisterHandler";
import { allFieldsRequired } from "./RegisterHandler";
import { storeImageInFirebase } from "../../firebase/storage";
import { AuthFooter } from "../Footer/AuthFooter";
import avatar from "../../logo/avatar.png";
import logo from "../../logo/Fx.png";
import toast, { Toaster } from "react-hot-toast";
import ClipLoader from "react-spinners/HashLoader";
import { signUp } from "../../Services";
import { Role } from "./Validation";
import { singUpAction } from "../../Reducer/Action";

export const RegisterContainer: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [RegisterValue, setRegisterValue] = useState<ValidationType>({
    avatar: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmpassword: "",
  });

  const [ValidateError, setValidateError] = useState<Record<string, string>>(
    {}
  );
  const [SelectedImage, setSelectedImage] = useState<File | null>(null);

  const Ref = useRef<HTMLInputElement | null>(null);

  function fileUPload() {
    Ref.current?.click();
  }
  const [ShowPassword, setShowPassword] = useState(false);
  const [DataSend, SetDataSend] = useState<boolean>(true);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    inputField: string
  ) => {
    setRegisterValue({ ...RegisterValue, [inputField]: e.target.value });
  };

  const imageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) {
      throw new Error("Uploading failed...");
    }
    const file = event.target.files[0];
    setRegisterValue({ ...RegisterValue, avatar: file });
    setSelectedImage(file);
  };
  function Validation(error: Record<string, string>) {
    allFieldsRequired(RegisterValue, error);
    // validateEmail(RegisterValue, error);
    checkValidNumber(RegisterValue, error);
    validatePasswordOnChange(RegisterValue, error);

    if (Object.keys(error).length === 0) {
      return null;
    } else {
      return error;
    }
  }

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const error: Record<string, string> = {};
    Validation(error);
    setValidateError(error);

    try {
      const validatedRegister = Validation(error);
      if (validatedRegister === null || undefined) {
        const {
          avatar,
          password,
          email,
          lastName,
          firstName,
          phoneNumber,
          role,
        } = RegisterValue;
        SetDataSend(false);
        const imageUrl = await storeImageInFirebase(avatar, {
          folder: "users",
        });

        const ConvertedForm = {
          firstName,
          lastName,
          phoneNumber,
          email,
          password,
          avatar: imageUrl,
          role: "customers",
        };

        await dispatch(singUpAction(ConvertedForm as ValidationType));
        RegisterValue.avatar = "";
        RegisterValue.firstName = "";
        RegisterValue.lastName = "";
        RegisterValue.password = "";
        RegisterValue.confirmpassword = "";
        RegisterValue.email = "";
        (RegisterValue.phoneNumber = ""), SetDataSend(true);

        SetDataSend(true);
        toast.success("Congratulations!, You logged in");
      }
    } catch (error) {
      console.log(error);
      // RegisterValue.avatar = "";
      // RegisterValue.firstName = "";
      // RegisterValue.lastName = "";
      // RegisterValue.password = "";
      // RegisterValue.confirmpassword = "";
      // RegisterValue.email = "";
      // RegisterValue.phoneNumber = "";
      toast.error(`User already logged in`);
      SetDataSend(true);
    }
  };

  return (
    <div className="lg:flex  lg:flex-row md:flex-col bg-[var(--light-background)]   h-full items-center lg:gap-40 justify-center  lg:px-[20px] lg:py-7">
      <div className="bg-[var(--light-foreground)] lg:bg-[#726c6c00]">
        <img src={logo} alt="" className="lg:w-[500px]  w-[125px] mb-5" />
      </div>
      <div className="flex flex-col items-center px-3 py-7">
        <div className="flex flex-col  py-5 items-center  bg-[var(--light-foreground)] rounded-md sm:px-[50px]   px-[10px]">
          <div className=" px-5 pb-[10px] text-[25px] font-bold text-[var(--primary-color)]  text-center">
            <h1 className="md:hidden">Sign In</h1>
            <h1 className="hidden md:block">Sign In With Email</h1>
          </div>

          <form
            action=""
            onSubmit={handleFormSubmit}
            className="flex flex-col items-center gap-[7px]  sm:items-center max-w-[400px] sm:w-full"
          >
            <div className="relative duration-150 group/image  flex flex-col items-center justify-center gap-1">
              {SelectedImage ? (
                <img
                  src={URL.createObjectURL(SelectedImage)}
                  alt=""
                  className="rounded-full w-[100px] h-[100px] border-[2px] border-[var(--primary-color)] opacity-[0px] bg-[var(--light-background)] outline-none"
                />
              ) : (
                <img
                  src={avatar}
                  alt=""
                  className="rounded-full w-[100px] h-[100px] border-[1px] opacity-[0px] bg-[var(--light-background)] outline-none"
                />
              )}
              {ValidateError["avatar"] && (
                <div className="text-[12px] text-[#af2e2e] ">
                  {ValidateError["avatar"]}
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                className=" hidden rounded-full w-[100px] h-[100px] border-[1px] opacity-[0px] bg-[var(--light-background)] outline-none  "
                ref={Ref as any}
                onChange={imageChange}
              />
              <div
                className="absolute p-2  group-hover/image:visible invisible w-[100px] h-[100px] rounded-full flex justify-end items-end cursor-pointer bg-[#86b1e75e]  text-[white] py-[3px] px-[5px] font-Poppins text-[14px] "
                onClick={fileUPload}
              >
                <div className="bg-[var(--light-background)] rounded-full p-[4px] ">
                  <Pencil
                    fill="#2c398d"
                    className="  text-[var(--light-text)] size-[19px] "
                  />
                </div>
              </div>
            </div>
            {/* fullname */}
            <div className="flex items-center gap-[10px] justify-between w-full">
              <div className="flex w-full flex-col items-start h-[65px] lg:h-[73px]">
                <label htmlFor={RegisterValue["firstName"]}>First Name</label>
                <input
                  type="text"
                  value={RegisterValue["firstName"]}
                  onChange={(e) => handleInputChange(e, "firstName")}
                  className=" w-full sm:w-[200px] outline-none py-[5px] lg:py-[7px] px-[8px] focus:bg-[#d9d9d9] rounded-md border-[1px]"
                />
                {
                  <div className="text-[12px] text-[#af2e2e]">
                    {ValidateError.firstname}
                  </div>
                }
              </div>
              <div className="flex w-full flex-col items-start h-[65px] lg:h-[73px]">
                <label htmlFor={RegisterValue["lastName"]}>Last Name</label>
                <input
                  type="text"
                  value={RegisterValue["lastName"]}
                  onChange={(e) => handleInputChange(e, "lastName")}
                  className=" w-full sm:w-[200px] outline-none py-[5px] lg:py-[7px] px-[8px] focus:bg-[#d9d9d9] rounded-md border-[1px]"
                />
                {ValidateError && (
                  <div className="text-[12px] text-[#af2e2e] ">
                    {ValidateError.lastname}
                  </div>
                )}
              </div>
            </div>
            {/* Email */}
            <div className="flex w-full flex-col h-[65px] lg:h-[73px]  items-start ">
              Email
              <label
                htmlFor="email"
                className="font-Poppins text-[15px]"
              ></label>
              <input
                type="email"
                id="email"
                value={RegisterValue.email}
                onChange={(e) =>
                  handleInputChange(e, "email" as keyof ValidationType)
                }
                className="outline-none py-[5px] lg:py-[7px] px-[8px] focus:bg-[#d9d9d9] rounded-md border-[1px] w-full sm:w-[400px] "
              />
              {ValidateError["email"] && (
                <div className="text-[12px] text-[#af2e2e] flex flex-col ">
                  {ValidateError["email"]}
                </div>
              )}
            </div>
            {/* phoneNumber */}
            <div className="flex w-full flex-col h-[65px] lg:h-[73px]  items-start ">
              Phone Number
              <label
                htmlFor="phoneNumber"
                className="font-Poppins text-[15px]"
              ></label>
              <input
                type="text"
                id="text"
                value={RegisterValue.phoneNumber}
                onChange={(e) =>
                  handleInputChange(e, "phoneNumber" as keyof ValidationType)
                }
                className="outline-none py-[5px] lg:py-[7px] px-[8px] focus:bg-[#d9d9d9] rounded-md border-[1px] w-full sm:w-[400px] "
              />
              {ValidateError["email"] && (
                <div className="text-[12px] text-[#af2e2e] flex flex-col ">
                  {ValidateError["number"]}
                </div>
              )}
            </div>
            {/* passwords */}
            <div className="w-full flex justify-center items-center gap-[10px]">
              <div className="flex w-full flex-col h-[65px] lg:h-[73px]  items-start  relative cursor-pointer">
                <label htmlFor="password" className="font-Poppins text-[15px]">
                  Password
                </label>
                <input
                  type={ShowPassword ? "text" : "password"}
                  id="password"
                  value={RegisterValue.password}
                  onChange={(e) =>
                    handleInputChange(e, "password" as keyof ValidationType)
                  }
                  className="outline-none py-[5px] lg:py-[7px] px-[8px] focus:bg-[#d9d9d9] rounded-md border-[1px] w-full sm:w-[200px] "
                />

                <div
                  className="absolute top-[29px] lg:top-[33px] text-[var(--dark-secondary-text)]  right-[14px] w-[15px] h-[15px]"
                  onClick={() => setShowPassword(!ShowPassword)}
                >
                  {ShowPassword ? <Eye /> : <EyeOff />}
                </div>

                {ValidateError["password"] && (
                  <div className="text-[12px] text-[#af2e2e] flex flex-col ">
                    {ValidateError["password"]}
                  </div>
                )}
              </div>
              <div className="flex w-full flex-col h-[65px] lg:h-[73px]  items-start relative  cursor-pointer">
                <label htmlFor="confirmpassword" className=" text-[15px]">
                  Confirm Password
                </label>
                <input
                  type={ShowPassword ? "text" : "password"}
                  id="confirmpassword"
                  value={RegisterValue.confirmpassword}
                  onChange={(e) =>
                    handleInputChange(
                      e,
                      "confirmpassword" as keyof ValidationType
                    )
                  }
                  className="outline-none  relative py-[5px] lg:py-[7px] px-[8px] focus:bg-[#d9d9d9] rounded-md border-[1px] w-full sm:w-[200px] "
                />

                <div
                  className="absolute  top-[29px] lg:top-[33px]  right-[14px] w-[15px] h-[15px] text-[var(--dark-secondary-text)] "
                  onClick={() => setShowPassword(!ShowPassword)}
                >
                  {ShowPassword ? <Eye /> : <EyeOff />}
                </div>
                {ValidateError["confirmpassword"] && (
                  <div className="text-[12px] text-[#af2e2e] flex flex-col ">
                    {ValidateError["confirmpassword"]}
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              className=" w-full h-[40px] text-lg  rounded-md bg-[var(--primary-color)] hover:bg-[var(--primary-light)] text-[var(--light-text)] sm:text-xl font-bold tracking-wide transition-colors duration-500 ease-in-out mt-5"
            >
              {DataSend ? (
                "Submit"
              ) : (
                <div className="flex items-center justify-center gap-2">
                  Sending <ClipLoader color="white" size={"20px"} />
                </div>
              )}
            </button>
          </form>
          <p
            className=" my-5  text-sm text-[var(--dark-secondary-text)]  font-Poppins hover:underline cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Already have an account?{" "}
            <a className="hover:text-[var(--primary-color)]">SignIn</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export const Register = () => {
  return (
    <div className="w-full h-full justify-center items-center">
      <RegisterContainer />
      <AuthFooter />
      <Toaster />
    </div>
  );
};
