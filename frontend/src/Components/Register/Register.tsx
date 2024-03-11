import React, {
  ChangeEvent,
  FormEvent,
  LegacyRef,
  useRef,
  useState,
} from "react";
import { ValidationType } from "../../models/Register.model";
import { Eye } from "lucide-react";
import { signUpNewUser } from "../../firebase/Authentication";
import { registerNewUser } from "../../Reducer/authActions";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../Reducer/Store";
import { useNavigate } from "react-router-dom";

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [RegisterValue, setRegisterValue] = useState<ValidationType>({
    avatar: "",
    firstname: "",
    lastname: "",
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
    const FileUrl = URL.createObjectURL(file);
    setRegisterValue({ ...RegisterValue, avatar: FileUrl });
    setSelectedImage(file);
  };
  function Validation(error: Record<string, string>) {
    const symbols = `!@#$%^&*()<>"`;
    const numbers = `1234567890`;

    for (const inputValue in RegisterValue) {
      if (
        RegisterValue.hasOwnProperty(inputValue) &&
        RegisterValue[inputValue as keyof ValidationType] === ""
      )
        error[inputValue] = `* Required`;
    }

    if (Object.keys(error).length !== 0) {
      return error;
    }

    const regex = /^[\w-]+(\.[\w-]+) *@texascollege\.edu\.np$/;
    if (!regex.test(RegisterValue.email)) {
      error.email = "Not a valid  email";
    }
    if (
      RegisterValue.password.charAt(0) !==
      RegisterValue.password.charAt(0).toUpperCase()
    ) {
      error.password = "Password start with capital letter";
    }
    if (RegisterValue.password.length < 8) {
      error.password = "Password atleast contains 8 characters";
    }
    if (
      !symbols
        .split("")
        .some((symbol) => RegisterValue.password.includes(symbol)) &&
      !numbers
        .split("")
        .some((number) => RegisterValue.password.includes(number))
    ) {
      error.password = "password should atleast contains numbers or symbols";
    }
    if (RegisterValue.password !== RegisterValue.confirmpassword) {
      error.password = "password does not match";
    }
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
        const { avatar, password, email, lastname, firstname } = RegisterValue;
        SetDataSend(false);
        await signUpNewUser(
          email,
          password,
          `${firstname + " " + lastname}`,
          avatar
        )
          .then(async () => {
            const dispatchingData = await dispatch(
              registerNewUser(RegisterValue as ValidationType)
            );

            if (!dispatchingData) {
              throw new Error(`please enter correct email : ${error}`);
            }
            RegisterValue.avatar = "";
            RegisterValue.firstname = "";
            RegisterValue.lastname = "";
            RegisterValue.password = "";
            RegisterValue.confirmpassword = "";
            RegisterValue.email = "";
            SetDataSend(true);
          })

          .catch((error) => {
            throw new Error(`All fields are required : ${error}`);
          });
          SetDataSend(true)
        
      }
    } catch (error) {
      console.error(`Failed while sending form: ${error}`);
      SetDataSend(true);
    }
  };
  console.log(ValidateError);

  return (
    <div className="lg:flex  lg:flex-row md:flex-col bg-[var(--light-background)]  sm:h-[100vh] h-full items-center justify-around  sm:justify-between lg:px-[150px] lg:py-[50px] md:py-[5px]">
      <div className="bg-[var(--light-foreground)] lg:bg-[#726c6c00]">
        <img
          src="../../../public/logo/Fx.png"
          alt=""
          className="lg:w-[500px]  w-[125px] mb-5  "
        />
      </div>
      <div className="flex flex-col items-center">
        <div className="flex flex-col items-center  bg-[var(--light-foreground)] rounded-md sm:px-[50px] sm:py-[20px]  px-[10px] py-[6px]">
          <div className=" px-5 pb-[10px] text-[25px] font-bold text-[var(--primary-color)]  text-center">
            <h1 className="md:hidden">Signin</h1>
            <h1 className="hidden md:block">Signin with Email</h1>
          </div>

          <form
            action=""
            onSubmit={handleFormSubmit}
            className="flex flex-col items-center  gap-[7px]  sm:items-center w-full"
          >
            <div className="flex flex-col items-center justify-center gap-1">
              {SelectedImage ? (
                <img
                  src={URL.createObjectURL(SelectedImage)}
                  alt=""
                  className="rounded-full w-[100px] h-[100px] border-[1px] opacity-[0px] bg-[var(--light-background)] outline-none"
                />
              ) : (
                <img
                  src="../../../public/defaultimages/default.webp"
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
                className="rounded-full w-[100px] h-[100px] border-[1px] opacity-[0px] bg-[var(--light-background)] outline-none  hidden"
                ref={Ref as LegacyRef<HTMLInputElement>}
                onChange={imageChange}
              />
              <button
                className="bg-[var(--primary-color)]  text-[white] py-[3px] px-[5px] font-Poppins text-[14px] rounded-md"
                onClick={fileUPload}
              >
                select image
              </button>
            </div>
            <div className="flex items-center gap-[10px] justify-between w-full">
              <div className="flex flex-col items-start h-[65px] lg:h-[73px]">
                <label htmlFor={RegisterValue["firstname"]}>firstname</label>
                <input
                  type="text"
                  value={RegisterValue["firstname"]}
                  onChange={(e) => handleInputChange(e, "firstname")}
                  className="w-[150px] outline-none py-[5px] lg:py-[7px] px-[8px] focus:bg-[#d9d9d9] rounded-md border-[1px]"
                />
                {
                  <div className="text-[12px] text-[#af2e2e]">
                    {ValidateError.firstname}
                  </div>
                }
              </div>
              <div className="flex flex-col items-start h-[65px] lg:h-[73px]">
                <label htmlFor={RegisterValue["lastname"]}>lastname</label>
                <input
                  type="text"
                  value={RegisterValue["lastname"]}
                  onChange={(e) => handleInputChange(e, "lastname")}
                  className="w-[150px] outline-none py-[5px] lg:py-[7px] px-[8px] focus:bg-[#d9d9d9] rounded-md border-[1px]"
                />
                {ValidateError && (
                  <div className="text-[12px] text-[#af2e2e] ">
                    {ValidateError.lastname}
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col h-[65px] lg:h-[73px]  items-start ">
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
                className="outline-none py-[5px] lg:py-[7px] px-[8px] focus:bg-[#d9d9d9] rounded-md border-[1px] w-[300px] "
              />
              {ValidateError["email"] && (
                <div className="text-[12px] text-[#af2e2e] flex flex-col ">
                  {ValidateError["email"]}
                </div>
              )}
            </div>
            <div className="flex flex-col h-[65px] lg:h-[73px]  items-start  relative cursor-pointer">
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
                className="outline-none py-[5px] lg:py-[7px] px-[8px] focus:bg-[#d9d9d9] rounded-md border-[1px] w-[300px] "
              />
              <Eye
                className="absolute top-[33px] right-[14px] w-[15px] h-[15px]"
                onClick={() => setShowPassword(!ShowPassword)}
              />

              {ValidateError["password"] && (
                <div className="text-[12px] text-[#af2e2e] flex flex-col ">
                  {ValidateError["password"]}
                </div>
              )}
            </div>
            <div className="flex flex-col h-[65px] lg:h-[73px]  items-start relative  cursor-pointer">
              <label
                htmlFor="confirmpassword"
                className="font-Poppins text-[15px]"
              >
                ConfirmPassword
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
                className="outline-none  relative py-[5px] lg:py-[7px] px-[8px] focus:bg-[#d9d9d9] rounded-md border-[1px] w-[300px] "
              />

              <Eye
                className="absolute top-[33px] right-[14px] w-[15px] h-[15px]"
                onClick={() => setShowPassword(!ShowPassword)}
              />
              {ValidateError["confirmpassword"] && (
                <div className="text-[12px] text-[#af2e2e] flex flex-col ">
                  {ValidateError["confirmpassword"]}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="bg-[var(--primary-color)] text-[white] w-full py-[6px] rounded-md mt-[20px] hover:bg-[var(--primary-dark)]"
            >
              {DataSend ? "submit" : "sending..."}
            </button>
          </form>
          <h3
            className="sm:text-[15px] text-[13px] font-Poppins mt-[5px] hover:underline cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Not have an Account? <a>SignIn</a>
          </h3>
        </div>
      </div>
    </div>
  );
};
