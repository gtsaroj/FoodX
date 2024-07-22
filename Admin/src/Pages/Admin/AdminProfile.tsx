import { EditIcon, Eye, EyeOff, X } from "lucide-react";
import { useSelector } from "react-redux";
// import { RootState, Store } from "../../Reducer/Store";
import React, { FormEvent, useEffect, useRef, useState } from "react";
// import { getUserData } from "../../firebase/db";
// import { DbUser } from "../../models/UserModels";
import avatar from "../../assets/logo/avatar.png";
// import { storeImageInFirebase } from "../../firebase/storage";
// import { UpdateProfileUser } from "../../Reducer/AuthUpdateUser";
import ReAuth from "../../Auth/Profile/ReAuth";
import toast from "react-hot-toast";
// import { authLogout } from "../../Reducer/authReducer";
// import { updateUserPassword } from "../../firebase/utils";
import DeleteAccount from "../../Auth/Profile/DeleteAccount";
import DisableAccount from "../../Auth/Profile/DisableAccount";
import { getUserData } from "../../firebase/db";
import { RootState, Store } from "../../Reducer/Store";
import { DbUser } from "../../models/UserModels";
import { authLogout } from "../../Reducer/Action";
import { updateUserPassword } from "../../firebase/utils";
import { UpdateProfileUser } from "../../../../frontend/src/Reducer/AuthUpdateUser";
import { storeImageInFirebase } from "../../firebase/storage";
import { User } from "../../models/user.model";

export const AdminProfile = () => {
  const authUser = useSelector(
    (state: RootState) => state.root.auth.userInfo
  ) as User;
  const [userData, setUserData] = useState<DbUser>();

  useEffect(() => {
    const fetchData = async () => {
      const data = await getUserData("admins", authUser?.uid);

      setUserData(data);
      return data;
    };
    fetchData();
  }, [authUser.uid]);

  useEffect(() => {}, [userData]);

  console.log(userData);

  return (
    <div className="flex items-center justify-center w-full h-full px-3 py-5 ">
      <div className="max-w-[1800px] flex justify-center items-center  p-2 flex-grow flex-col gap-12">
        <div className="flex flex-col items-center justify-center flex-grow w-full p-3">
          <p className="flex items-start w-full text-start max-w-[1200px] text-xl font-semibold tracking-wide py-5 text-[var(--dark-text)]">
            My Profile
          </p>
          <ProfileCard
            fullName={userData?.fullName as string}
            avatar={userData?.avatar as string}
            role={userData?.role as string}
            email={userData?.email as string}
          />
        </div>
        <div className="flex flex-col items-center justify-center max-w-[1200px] w-full gap-2 lg:p-0  p-3 rounded ">
          <PersonlInformation
            fullName={userData?.fullName}
            avatar={userData?.avatar}
            role={userData?.role}
            email={userData?.email}
            phoneNumber={userData?.phoneNumber}
          />
        </div>
        <div className="flex flex-col items-center justify-center flex-grow w-full p-3">
          <p className="flex items-start w-full text-start max-w-[1200px] text-xl font-semibold tracking-wide py-5 text-[var(--dark-text)]">
            Danger Zone
          </p>
          <div className="w-full max-w-[1200px] border border-red-400 rounded">
            <ChangePasswordComponent />
          </div>
        </div>
      </div>
    </div>
  );
};

interface ProfileCardType {
  fullName: string;
  avatar: string;
  role: string;
  email: string;
  phoneNumber?: string;
}

const ProfileCard: React.FC<ProfileCardType> = (props: ProfileCardType) => {
  const uploadAvatarRef = useRef<HTMLInputElement | null>(null);
  const [edit, setEdit] = useState<boolean>(false);
  const [updateAvatar, setUpdateAvatar] = useState<string>(avatar);
  const [loading, setLoading] = useState<boolean>(true);
  const [selected, setSelected] = useState<boolean>(false);

  const UpdateUserProfile = async () => {
    const profile = {
      avatar: updateAvatar,
    };
    try {
      setLoading(false);
      const response = await Store.dispatch(UpdateProfileUser(profile));
      if (response) setLoading(true);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (
      !props.avatar &&
      !props.email &&
      !props.fullName &&
      !props.phoneNumber &&
      !props.role
    ) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [props]);

  console.log(loading);

  return (
    <div
      className={`flex items-center justify-between w-full h-full gap-5 p-5 max-w-[1200px] border border-[var(--light-border)] rounded ${
        loading
          ? ""
          : "bg-gradient-to-r from-gray-300 to-slate-400 animate-pulse "
      } `}
    >
      <div className="flex gap-5">
        <div className=" relative group/editable max-w-[80px] max-h-[80px] overflow-hidden rounded-full">
          {edit ? (
            <img src={updateAvatar} alt="" />
          ) : (
            <img
              src={props?.avatar}
              alt="user profile"
              className={`w-[80px] h-[80px] ${
                loading ? "visible" : "invisible"
              }`}
            />
          )}
          <div
            className={`absolute group-hover/editable:visible ${
              edit ? "flex" : "hidden"
            } invisible duration-200 top-0 left-0 right-0 `}
          >
            <input
              className="hidden"
              ref={uploadAvatarRef}
              type="file"
              onChange={async (event) => {
                if (event.target.files) {
                  const file = event.target.files[0];
                  setLoading(false);
                  const imageUrl = await storeImageInFirebase(file, {
                    folder: "users",
                  });
                  setUpdateAvatar(imageUrl as string);
                  setLoading(true);
                  setSelected(true);
                }
              }}
              accept="image/*"
            />
            <div
              onClick={() => uploadAvatarRef.current?.click()}
              className={` relative w-[80px] h-[80px]  rounded-full bg-[#86b1e75e] ${
                selected ? "hidden" : ""
              }`}
            >
              <div className="absolute flex items-end justify-end  bottom-2 right-3">
                <EditIcon className="size-4" />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-start justify-center gap-1">
          <p
            className={`font-semibold tracking-wider text-[var(--dark-text)] ${
              loading ? "visible" : "invisible"
            }`}
          >
            {props.fullName}
          </p>
          <p
            className={`text-xs tracking-wider text-[var(--dark-secondary-text)] ${
              loading ? "visible" : "invisible"
            }`}
          >
            {props?.role?.charAt(0).toUpperCase() + props?.role?.slice(1)}
          </p>
          <p
            className={`text-xs tracking-wider text-[var(--dark-secondary-text)] ${
              loading ? "visible" : "invisible"
            }`}
          >
            {props.email}
          </p>
        </div>
      </div>
      <div onClick={() => setEdit(!edit)}>
        {edit ? (
          <div onClick={UpdateUserProfile}>
            <UpdateUser />
          </div>
        ) : (
          <EditProfileIcon />
        )}
      </div>
    </div>
  );
};

export interface UpdateProfileInfo {
  avatar?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
}

const PersonlInformation = (props: any) => {
  const firstName = props?.fullName?.split(" ")[0];
  const lastName = props?.fullName?.split(" ")[1];

  const [edit, setEdit] = useState<boolean>(false);
  const [updateProfilInfo, setUpdateProfileInfo] =
    useState<UpdateProfileInfo>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!props.email) setLoading(true);
    else setLoading(false);
    setUpdateProfileInfo((prev) => ({
      ...prev,
      email: props?.email,
      firstName: firstName,
      lastName: lastName,
      phoneNumber: props.phoneNumber,
    }));
  }, [props]);

  const UpdateProfile = async () => {
    setLoading(true);
    await Store.dispatch(
      UpdateProfileUser(updateProfilInfo as UpdateProfileInfo)
    );

    setLoading(false);
  };

  return (
    <div className="flex-col items-center w-full lg:px-3">
      <div className="flex justify-between w-full pt-3 pb-4 ">
        <p className="text-xl font-semibold tracking-wide  text-[var(--dark-text)]">
          Personal Information
        </p>
        <div onClick={() => setEdit(!edit)} className="px-5 max-w-[1200px]">
          {edit ? (
            <button onClick={() => UpdateProfile()}>
              <UpdateUser />
            </button>
          ) : (
            <EditProfileIcon />
          )}
        </div>
      </div>
      <div
        className="max-w-[1200px] w-full grid grid-rows-3 gap-8 px-5 py-7 border border-[var(--light-border)] rounded
    "
      >
        <div
          className={`grid  items-center grid-cols-2 grid-flow-cols gap-7 ${
            loading
              ? " py-1.5 px-2 rounded bg-gradient-to-r from-gray-300 to-slate-400  animate-pulse"
              : ""
          }`}
        >
          <div
            className={`flex flex-col w-full gap-1 ${
              loading ? "invisible" : ""
            }`}
          >
            <p className=" tracking-wide text-[var(--dark-secondary-text)] text-sm">
              First Name
            </p>
            {edit ? (
              <input
                type="text"
                value={updateProfilInfo?.firstName}
                onChange={(e) =>
                  setUpdateProfileInfo((prev) => ({
                    ...prev,
                    firstName: e.target.value as string,
                  }))
                }
                className="px-2 py-1 rounded-sm outline-none"
              />
            ) : (
              <p className="text-[var(--dark-text)] font-medium ">
                {firstName}
              </p>
            )}
          </div>
          <div
            className={`flex flex-col w-full gap-1 ${
              loading ? "invisible" : ""
            }`}
          >
            <p className=" tracking-wide text-[var(--dark-secondary-text)] text-sm">
              Last Name
            </p>
            {edit ? (
              <input
                type="text"
                value={updateProfilInfo?.lastName}
                onChange={(e) =>
                  setUpdateProfileInfo((prev) => ({
                    ...prev,
                    lastName: e.target.value as string,
                  }))
                }
                className="px-2 py-1 rounded-sm outline-none"
              />
            ) : (
              <p className="text-[var(--dark-text)] font-medium ">{lastName}</p>
            )}
          </div>
        </div>
        <div
          className={`${
            loading ? " bg-slate-400 animate-pulse py-1.5 px-2 rounded" : ""
          } grid items-center grid-flow-col grid-cols-2 gap-7 `}
        >
          <div
            className={`flex flex-col w-full gap-1 ${
              loading ? "invisible" : ""
            }`}
          >
            <p className=" tracking-wide text-[var(--dark-secondary-text)] text-sm">
              Email
            </p>
            <p className="text-[var(--dark-text)] font-medium ">
              {props.email}
            </p>
          </div>
          <div
            className={`flex flex-col w-full gap-1 ${
              loading ? "invisible" : ""
            }`}
          >
            <p className=" tracking-wide text-[var(--dark-secondary-text)] text-sm">
              Phone Number
            </p>
            {edit ? (
              <input
                type="text"
                value={updateProfilInfo?.phoneNumber}
                onChange={(e) =>
                  setUpdateProfileInfo((prev) => ({
                    ...prev,
                    phoneNumber: e.target.value as string,
                  }))
                }
                className="px-2 py-1 rounded-sm outline-none"
              />
            ) : (
              <p className="text-[var(--dark-text)] font-medium ">
                {props.phoneNumber}
              </p>
            )}
          </div>
        </div>
        <div
          className={` ${
            loading ? " bg-slate-400 animate-pulse py-1.5 px-2 rounded" : ""
          } grid items-center grid-flow-col grid-cols-2 gap-7`}
        >
          <div
            className={`flex flex-col w-full gap-1 ${
              loading ? "invisible" : ""
            }`}
          >
            <p className=" tracking-wide text-[var(--dark-secondary-text)] text-sm">
              Role
            </p>
            <p className="text-[var(--dark-text)] font-medium ">
              {props?.role?.charAt(0).toUpperCase() + props?.role?.slice(1)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ChangePasswordComponent = () => {
  const [openChangePassword, setOpenChangePassword] = useState<boolean>(false);

  const [newPassword, setNewpassword] = useState<string>();
  const [newConfirmPassword, setConfirmNewpassword] = useState<string>();
  const [show, setShow] = useState<boolean>(false);
  const [passwordType, setPasswordType] = useState<"password" | "text">(
    "password"
  );
  const [confirmDeleteAccount, setConfirmDeleteAccount] =
    useState<boolean>(false);

  const [submitNewPassword, setSubmitNewPassword] = useState<boolean>(false);

  const [confirmToDisable, setConfirmToDisable] = useState<boolean>(false);

  const showPassword = () => {
    setShow((show) => !show);
    setPasswordType(passwordType === "text" ? "password" : "text");
  };

  const SubmitNewPassword = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (newPassword === "" && newConfirmPassword === "")
      return toast.error("Fields Are Required");
    try {
      setSubmitNewPassword(true);
    } catch (error) {
      console.log(error);
    }
  };
  const HandlePasswordChange = async () => {
    try {
      await updateUserPassword(newPassword as string).then(() => {
        toast.success("Your password Changed SuccessFully");
        setTimeout(() => {
          Store.dispatch(authLogout());
        }, 2000);
      });
    } catch (error) {
      throw new Error("Password Change Failed =>" + error);
    }
  };
  return (
    <div className=" relative max-w-[1200px] w-full grow flex-col gap-8 flex items-center justify-center px-5 py-7 text-[var(--dark-text)]">
      <div className="flex items-center justify-between w-full gap-5 px-3 py-5  border-b border-b-[var(--light-border)]">
        <p className="flex flex-col gap-1 font-semibold tracking-wide ">
          Change your password
          <span className="text-sm font-normal text-[var(--dark-secondary-text)]">
            Are you sure you want to change your password?
          </span>
        </p>
        <div
          onClick={() => setOpenChangePassword(!openChangePassword)}
          className="border-[var(--danger-text)] border  p-3 rounded text-[var(--danger-text)] hover:bg-[var(--danger-bg)] hover:text-[var(--light-text)] cursor-pointer hover:border-[var(--danger-text)] ease-in-out duration-200 transition-all"
        >
          <p className="w-full text-center">Change Password</p>
        </div>
      </div>
      <div
        onClick={() => setConfirmToDisable(!confirmToDisable)}
        className="flex items-center justify-between w-full gap-5 px-3 py-5  border-b border-b-[var(--light-border)]"
      >
        <p className="flex flex-col gap-1 font-semibold tracking-wide">
          Disable your account
          <span className="text-sm font-normal text-[var(--dark-secondary-text)]">
            This will temporarily disable your account.
          </span>
        </p>
        <div className="border-[var(--danger-text)] border p-3 rounded text-[var(--danger-text)] hover:bg-[var(--danger-bg)] hover:text-[var(--light-text)] cursor-pointer hover:border-[var(--danger-text)] ease-in-out duration-200 transition-all">
          <p className="w-full text-center">Disable Account</p>
        </div>
      </div>
      <div className="flex items-center justify-between w-full gap-5 px-3 py-5  border-b border-b-[var(--light-border)]">
        <p className="flex flex-col gap-1 font-semibold tracking-wide">
          Delete your account
          <span className="text-sm font-normal text-[var(--dark-secondary-text)]">
            This will delete all your data. You won't be able to login again.
            Are you sure you want to delete your account?
          </span>
        </p>
        <div
          onClick={() => setConfirmDeleteAccount(!confirmDeleteAccount)}
          className="border-[var(--danger-text)] border  p-3 rounded text-[var(--danger-text)] hover:bg-[var(--danger-bg)] hover:text-[var(--light-text)] cursor-pointer hover:border-[var(--danger-text)] ease-in-out duration-200 transition-all"
        >
          <p className="w-full text-center">Delete Account</p>
        </div>
      </div>
      {confirmToDisable && (
        <div
          className={`fixed ${
            confirmToDisable ? "visible" : "invisible"
          } flex items-center px-4 justify-center top-16 w-full z-50  bg-[#5f5b6667] bottom-0 left-0 right-0`}
        >
          <DisableAccount />
        </div>
      )}{" "}
      {confirmDeleteAccount && (
        <div
          className={`fixed ${
            confirmDeleteAccount ? "visible" : "invisible"
          } flex items-center px-4 z-50 justify-center top-16 w-full  bg-[#5f5b6667] bottom-0 left-0 right-0`}
        >
          <DeleteAccount />
        </div>
      )}
      {openChangePassword && (
        <div
          className={`fixed ${
            openChangePassword ? "visible" : "invisible"
          } flex items-center justify-center top-16 w-full z-50  bg-[#5f5b6667] bottom-0 left-0 right-0`}
        >
          {submitNewPassword ? (
            <ReAuth reAuthUsers={HandlePasswordChange} />
          ) : (
            <div
              className={`w-[100vw] h-[80vh] flex justify-center items-center px-5 z-30`}
            >
              <div className="flex items-center justify-center max-w-[800px] min-w-[400px] w-[600px] px-3 py-8">
                <div className="w-full h-full bg-[var(--light-foreground)] flex flex-col gap-8 rounded-lg shadow-sm relative">
                  <div className="w-full flex flex-col items-center gap-3 px-3 py-6  text-[30px] font-bold text-[var(--primary-color)] tracking-wide text-center">
                    <h1 className="md:hidden">Change Password</h1>
                    <h1 className="hidden md:block">Change Password</h1>
                  </div>
                  <div className="px-3 py-4">
                    <form
                      className="flex flex-col gap-4 p-2"
                      onSubmit={() =>
                        SubmitNewPassword(
                          event as unknown as FormEvent<HTMLFormElement>
                        )
                      }
                    >
                      <div className="relative flex flex-col gap-2">
                        <label htmlFor="logEmail" className="text-[15px]">
                          New Password
                        </label>
                        <input
                          type="text"
                          name="email"
                          autoComplete="off"
                          value={newPassword}
                          onChange={(e) => setNewpassword(e.target.value)}
                          required
                          className="border-[var(--light-border)] focus:border-transparent focus:bg-[var(--light-border)] border bg-transparent rounded h-[40px] outline-none px-5 py-3 text-md"
                        />
                      </div>
                      <div className="relative flex flex-col gap-2">
                        <label htmlFor="logPassword" className="text-[15px]">
                          Confirm New Password
                        </label>
                        <input
                          type={passwordType}
                          name="password"
                          autoComplete="off"
                          maxLength={25}
                          value={newConfirmPassword}
                          onChange={(e) =>
                            setConfirmNewpassword(e.target.value)
                          }
                          required
                          className="border-[var(--light-border)] focus:border-transparent focus:bg-[var(--light-border)] border bg-transparent rounded h-[40px] outline-none px-5 py-3 text-md"
                        />

                        {show ? (
                          <div
                            className="text-[var(--dark-secondary-text)] absolute top-[37px] right-[10px] cursor-pointer"
                            onClick={showPassword}
                          >
                            <Eye size={23} />
                          </div>
                        ) : (
                          <div
                            className="text-[var(--dark-secondary-text)] absolute top-[37px] right-[10px] cursor-pointer"
                            onClick={showPassword}
                          >
                            <EyeOff size={23} />
                          </div>
                        )}
                      </div>

                      <button
                        className="h-[40px] rounded bg-[var(--primary-color)] hover:bg-[var(--primary-light)] text-[var(--light-text)] text-xl font-bold tracking-wide transition-colors duration-500 ease-in-out mt-5 "
                        type="submit"
                      >
                        Submit
                      </button>
                    </form>
                  </div>
                  <div
                    onClick={() => setOpenChangePassword(!openChangePassword)}
                    className="absolute top-0 right-0 p-3  rounded-tr-md text-[var(--secondary-color)] cursor-pointer hover:bg-[var(--secondary-light)] hover:text-[var(--light-text)] transition-all ease-in-out duration-150 "
                  >
                    <X />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const EditProfileIcon: React.FC = () => {
  return (
    <div className="bg-[var(--light-foreground)] p-2 rounded-full flex justify-center items-center gap-2 cursor-pointer text-[var(--dark-text)] hover:bg-[var(--primary-color)] hover:text-[var(--light-text)] transition-all ease-in-out duration-250 border border-[var(--light-border)] ">
      <p className="text-xs">Edit</p>
      <EditIcon size={15} />
    </div>
  );
};
export const UpdateUser: React.FC = () => {
  return (
    <div className="bg-[var(--light-foreground)] p-2 rounded-full flex justify-center items-center gap-2 cursor-pointer text-[var(--dark-text)] hover:bg-[var(--primary-color)] hover:text-[var(--light-text)] transition-all ease-in-out duration-250 border border-[var(--light-border)] ">
      <p className="text-xs">Save</p>
      <EditIcon size={15} />
    </div>
  );
};
