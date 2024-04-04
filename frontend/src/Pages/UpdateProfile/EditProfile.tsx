import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { Pencil } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { storeImageInFirebase } from "../../firebase/storage";
import toast from "react-hot-toast";
import { allFieldsRequired, checkValidNumber } from "./UpdateProfileValidation";
import { AppDispatch, RootState } from "../../Reducer/Store";
import { UpdateProfileType } from "./UpdateProfile";
import { UpdateProfileUser } from "../../Reducer/AuthUpdateUser";
import { updateUserProfile } from "../../firebase/utils";
import HashLoader from "react-spinners/HashLoader";
import { auth } from "../../firebase";

const EditProfile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const authUser = useSelector((state: RootState) => state.root.auth.userInfo);

  const [RegisterValue, setRegisterValue] = useState<UpdateProfileType>({
    avatar: authUser?.avatar,
    fullName: authUser?.fullName,
    phoneNumber: authUser?.phoneNumber,
  });
  const [editProfile, setEditProfile] = useState<boolean>(false);
  const [updateUser, setUpdateUser] = useState<boolean>(false);

  const [ValidateError, setValidateError] = useState<Record<string, string>>(
    {}
  );
  const [SelectedImage, setSelectedImage] = useState<any>(null);

  const Ref = useRef<HTMLInputElement | null>(null);

  function fileUPload() {
    Ref.current?.click();
  }



  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    inputField: string
  ) => {
    setRegisterValue({ ...RegisterValue, [inputField]: e.target.value });
  };

  useEffect(() => {
    setRegisterValue({
      ...RegisterValue,
      fullName: authUser.fullName,
      avatar: authUser.avatar,
      phoneNumber: authUser.phoneNumber,
    });
  }, [authUser]);

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
    setUpdateUser(true);
    try {
      const validatedRegister = Validation(error);
      if (validatedRegister === null || undefined) {
        const { avatar, fullName, phoneNumber } = RegisterValue;


      
        let imageUrl = null;
        if (SelectedImage.name) {
         
          imageUrl = await storeImageInFirebase(SelectedImage, {
            folder: "users",
          });
        }

        if (imageUrl) {
          await updateUserProfile(imageUrl);
        } else {
          imageUrl = avatar;
        }


        const ConvertedForm = {
          fullName,
          phoneNumber,
          avatar: imageUrl,
        };

        const dispatchingData = await dispatch(
          UpdateProfileUser(ConvertedForm)
        );

        if (!dispatchingData) {
          throw new Error(`Error while sending form : ${error}`);
        }
        toast.success("Update Successfully");
        RegisterValue.fullName = "";
        RegisterValue.avatar = "";
        RegisterValue.phoneNumber = "";

        setEditProfile(false);
      }
    } catch (error) {
      RegisterValue.fullName = "";
      RegisterValue.avatar = "";
      RegisterValue.phoneNumber = "";
      toast.error(`User already logged in`);
    }
    setUpdateUser(false);
  };
  return (
    <div className="lg:flex  w-full  flex-col rounded-md items-center sm:items-baseline">
      <div className="flex  flex-col items-baseline px-3 py-7 w-full">
        <div className="flex flex-col  py-5 items-baseline w-full  rounded-md md:px-[50px]   px-[10px]">
          <form
            action=""
            onSubmit={handleFormSubmit}
            className="flex flex-col items-end gap-10  sm:items-center w-full"
          >
            <div
              className={`  flex py-7 pl-3 pr-10 w-full rounded-md bg-[#8080807c] items-center justify-center gap-5 ${
                updateUser ? "bg-[#8080807c] animate-pulse" : ""
              }`}
            >
              <div
                className={`relative ${editProfile ? "group/image" : ""} 
                ${updateUser ? "invisible" : ""}
                  duration-150   flex flex-col items-center justify-center gap-1`}
              >
                {SelectedImage ? (
                  <img
                    src={URL.createObjectURL(SelectedImage)}
                    alt=""
                    className="rounded-full w-20 h-20 border-[2px] border-[var(--primary-color)] opacity-[0px] bg-[var(--light-background)] outline-none"
                  />
                ) : (
                  <img
                    src={RegisterValue.avatar}
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
              <div
                className={`flex flex-col items-baseline justify-center gap-1 w-full ${
                  updateUser ? "invisible" : ""
                }`}
              >
                <p className="text-[var(--dark-text)] text-[20px] font-semibold">
                  {authUser?.fullName}
                </p>

                <p className="text-sm ">Personal</p>
                <p className="text-sm">{authUser?.email}</p>
              </div>
            </div>
            <div
              className={`flex sm:flex-row flex-col items-center w-full  sm:items-center justify-center sm:justify-around gap-3 ${
                updateUser ? "bg-[#8080807c] animate-pulse " : ""
              }`}
            >
              {/* fullname */}
              <div
                className={`flex w-full flex-col h-[65px] lg:h-[73px]  items-start  ${
                  updateUser ? "invisible" : ""
                }`}
              >
                Fullname
                <label
                  htmlFor="fullName"
                  className="font-Poppins text-[15px]"
                ></label>
                {editProfile ? (
                  <input
                    type="text"
                    id="fullName"
                    value={RegisterValue.fullName}
                    onChange={(e) =>
                      handleInputChange(
                        e,
                        "fullName" as keyof UpdateProfileType
                      )
                    }
                    required
                    className="outline-none py-[5px] lg:py-[7px] px-[8px] focus:bg-[#d9d9d9]  w-full rounded-md border-[1px]  "
                  />
                ) : (
                  <input
                    type="text"
                    id="fullName"
                    value={RegisterValue.fullName}
                    onChange={(e) =>
                      handleInputChange(
                        e,
                        "fullName" as keyof UpdateProfileType
                      )
                    }
                    className="outline-none py-[5px] lg:py-[7px] px-[8px] focus:bg-[#d9d9d9]  w-full rounded-md border-[1px]  "
                    readOnly
                  />
                )}
                {ValidateError["fullName"] && (
                  <div className="text-[12px] text-[#af2e2e] flex flex-col ">
                    {ValidateError["fullName"]}
                  </div>
                )}
              </div>
              {/* Email */}
              {/* phoneNumber */}
              <div
                className={`flex w-full flex-col h-[65px] lg:h-[73px]  items-start  ${
                  updateUser ? "invisible" : ""
                } `}
              >
                Phone Number
                <label
                  htmlFor="phoneNumber"
                  className="font-Poppins text-[15px]"
                ></label>
                {editProfile ? (
                  <input
                    type="text"
                    id="phoneNumber"
                    value={RegisterValue.phoneNumber as string}
                    onChange={(e) =>
                      handleInputChange(
                        e,
                        "phoneNumber" as keyof UpdateProfileType
                      )
                    }
                    required
                    className="outline-none py-[5px] lg:py-[7px] px-[8px] focus:bg-[#d9d9d9] rounded-md border-[1px] w-full"
                  />
                ) : (
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
                    readOnly
                  />
                )}
                {ValidateError["number"] && (
                  <div className="text-[12px] text-[#af2e2e] flex flex-col ">
                    {ValidateError["number"]}
                  </div>
                )}
              </div>
            </div>
            <div className="flex w-full justify-end ">
              {editProfile ? (
                <button
                  type="submit"
                  className=" w-[200px] h-[40px] text-sm  rounded-md bg-[var(--primary-color)] hover:bg-[var(--primary-light)] text-[var(--light-text)]  font-bold tracking-wide transition-colors duration-500 ease-in-out mt-5"
                >
                  {updateUser ? (
                    <div className="flex items-center justify-center gap-3">
                      {" "}
                      Save <HashLoader color="white" size={"15px"} />
                    </div>
                  ) : (
                    "Save Change"
                  )}
                </button>
              ) : (
                <div
                  onClick={() => setEditProfile(!editProfile)}
                  className=" cursor-pointer w-[200px] flex items-center justify-center h-[40px] text-sm  rounded-md bg-[var(--primary-color)] hover:bg-[var(--primary-light)] text-[var(--light-text)]  font-bold tracking-wide transition-colors duration-500 ease-in-out mt-5"
                >
                  Edit Profile
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
