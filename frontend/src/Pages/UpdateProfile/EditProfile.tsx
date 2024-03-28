import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { Pencil } from "lucide-react";

import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { storeImageInFirebase } from "../../firebase/storage";

import toast from "react-hot-toast";
import { allFieldsRequired, checkValidNumber } from "./UpdateProfileValidation";
import { RootState } from "../../Reducer/Store";
import { UpdateProfileType } from "./UpdateProfile";

const EditProfile = () => {
  const navigate = useNavigate();
  // const dispatch = useDispatch<AppDispatch>();
  const [RegisterValue, setRegisterValue] = useState<UpdateProfileType>({
    avatar: "",
    fullName: "",
    phoneNumber: "",
  });

  const authUser = useSelector((state: RootState) => state.root.auth.userInfo);

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
        const { avatar, fullName, phoneNumber } = RegisterValue;
        SetDataSend(false);
        const imageUrl = await storeImageInFirebase(avatar, {
          folder: "users",
        });

        const ConvertedForm = {
          fullName,
          phoneNumber,
          avatar: imageUrl,
        };

        // const dispatchingData = await dispatch(
        //   registerNewUser(ConvertedForm as ValidationType)
        // );

        // if (!dispatchingData) {
        //   throw new Error(`Error while sending form : ${error}`);
        // }
        RegisterValue.fullName = "";
        RegisterValue.avatar = "";
        RegisterValue.phoneNumber = "";
        SetDataSend(true);

        SetDataSend(true);
        toast.success("Congratulations!, You logged in");
      }
    } catch (error) {
      RegisterValue.fullName = "";
      RegisterValue.avatar = "";
      RegisterValue.phoneNumber = "";
      toast.error(`User already logged in`);
      SetDataSend(true);
    }
  };
  return (
    <div className="lg:flex w-full  flex-col rounded-md bg-[var(--light-foreground)] items-baseline">
      <div className="flex flex-col items-baseline px-3 py-7 w-full">
        <div className="flex flex-col  py-5 items-baseline w-full  rounded-md md:px-[50px]   px-[10px]">
          <form
            action=""
            onSubmit={handleFormSubmit}
            className="flex flex-col items-end gap-10  sm:items-center w-full"
          >
            <div className="flex py-7 pl-3 pr-10 w-full rounded-md bg-[#8080807c] items-center justify-center gap-5">
              <div className="relative  duration-150   flex flex-col items-center justify-center gap-1">
                {SelectedImage ? (
                  <img
                    src={URL.createObjectURL(SelectedImage)}
                    alt=""
                    className="rounded-full w-20 h-20 border-[2px] border-[var(--primary-color)] opacity-[0px] bg-[var(--light-background)] outline-none"
                  />
                ) : (
                  <img
                    src={authUser.avatar}
                    alt=""
                    className="rounded-full w-24 h-20 border-[1px] opacity-[0px] bg-[var(--light-background)] outline-none"
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
              <div className="flex flex-col items-baseline justify-center gap-1 w-full">
                <p className="text-[var(--dark-text)] text-[20px] font-semibold">
                  {authUser.fullName}
                </p>

                <p className="text-sm ">Personal</p>
                <p className="text-sm">{authUser.email}</p>
              </div>
            </div>
            <div className="flex w-full  items-center justify-around gap-3">
              {/* fullname */}
              <div className="flex w-full flex-col h-[65px] lg:h-[73px]  items-start ">
                Fullname
                <label
                  htmlFor="fullName"
                  className="font-Poppins text-[15px]"
                ></label>
                <input
                  type="email"
                  id="fullName"
                  value={RegisterValue.fullName}
                  onChange={(e) =>
                    handleInputChange(e, "fullName" as keyof UpdateProfileType)
                  }
                  className="outline-none py-[5px] lg:py-[7px] px-[8px] focus:bg-[#d9d9d9]  w-full rounded-md border-[1px]  "
                />
                {ValidateError["fullName"] && (
                  <div className="text-[12px] text-[#af2e2e] flex flex-col ">
                    {ValidateError["fullName"]}
                  </div>
                )}
              </div>
              {/* Email */}
              {/* phoneNumber */}
              <div className="flex w-full flex-col h-[65px] lg:h-[73px]  items-start ">
                Phone Number
                <label
                  htmlFor="phoneNumber"
                  className="font-Poppins text-[15px]"
                ></label>
                <input
                  type="text"
                  id="phoneNumber"
                  value={RegisterValue.phoneNumber}
                  onChange={(e) =>
                    handleInputChange(
                      e,
                      "phoneNumber" as keyof UpdateProfileType
                    )
                  }
                  className="outline-none py-[5px] lg:py-[7px] px-[8px] focus:bg-[#d9d9d9] rounded-md border-[1px] w-full"
                />
                {ValidateError["email"] && (
                  <div className="text-[12px] text-[#af2e2e] flex flex-col ">
                    {ValidateError["number"]}
                  </div>
                )}
              </div>
            </div>
            <div className="flex w-full justify-end ">
              <button
                type="submit"
                className=" w-[200px] h-[40px] text-sm  rounded-md bg-[var(--primary-color)] hover:bg-[var(--primary-light)] text-[var(--light-text)]  font-bold tracking-wide transition-colors duration-500 ease-in-out mt-5"
              >
                {DataSend ? "Save Change" : "Sending..."}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
