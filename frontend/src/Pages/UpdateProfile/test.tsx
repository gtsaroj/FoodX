import { EditIcon } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../../Reducer/Store";
import { useEffect, useState } from "react";
import { getUserData } from "../../firebase/db";
import { DbUser } from "../../models/UserModels";

export const UserProfile = () => {
  const authUser = useSelector((state: RootState) => state.root.auth.userInfo);
  const [userData, setUserData] = useState<DbUser>();

  useEffect(() => {
    const fetchData = async () => {
      const data = await getUserData("customers", authUser?.uid);
      console.log(data);
      setUserData(data);
      return data;
    };
    fetchData();
  }, []);

  return (
    <div className="flex items-center justify-center w-full h-full px-3 py-5 ">
      <div className="max-w-[1800px] flex justify-center items-center  p-2 flex-grow flex-col gap-12">
        <div className="flex flex-col items-center justify-center flex-grow w-full p-3">
          <p className="flex items-start w-full text-start max-w-[1200px] text-xl font-semibold tracking-wide py-5 text-[var(--dark-text)]">
            My Profile
          </p>
          <ProfileCard
            fullName={userData?.fullName}
            avatar={userData?.avatar}
            role={userData?.role}
            email={userData?.email}
          />
        </div>
        <div className="flex flex-col items-center justify-center max-w-[1200px] w-full gap-2 lg:p-0  p-3 rounded ">
          <div className="flex justify-between w-full pt-3 pb-4 ">
            <p className="text-xl font-semibold tracking-wide  text-[var(--dark-text)]">
              Personal Information
            </p>
            <div className="px-5 max-w-[1200px]">
              <EditProfileIcon />
            </div>
          </div>
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

const ProfileCard = (props: any) => {
  return (
    <div className="flex items-center justify-between w-full h-full gap-5 p-5 max-w-[1200px] border border-[var(--light-border)] rounded ">
      <div className="flex gap-5">
        <div className="max-w-[80px] max-h-[80px] overflow-hidden rounded-full">
          <img
            src={props.avatar}
            alt="user profile"
            className="w-[80px] h-[80px]"
          />
        </div>
        <div className="flex flex-col items-start justify-center gap-1">
          <p className="font-semibold tracking-wider text-[var(--dark-text)]">
            {props.fullName}
          </p>
          <p className="text-xs tracking-wider text-[var(--dark-secondary-text)]">
            {props?.role?.charAt(0).toUpperCase() + props?.role?.slice(1)}
          </p>
          <p className="text-xs tracking-wider text-[var(--dark-secondary-text)]">
            {props.email}
          </p>
        </div>
      </div>
      <EditProfileIcon />
    </div>
  );
};

const PersonlInformation = (props: any) => {
  const firstName = props?.fullName?.split(" ")[0];
  const lastName = props?.fullName?.split(" ")[1];
  return (
    <div
      className="max-w-[1200px] w-full grid grid-rows-3 gap-8 px-5 py-7 border border-[var(--light-border)] rounded
    "
    >
      <div className="grid items-center grid-cols-2 grid-flow-cols gap-7 ">
        <div className="flex flex-col w-full gap-1">
          <p className=" tracking-wide text-[var(--dark-secondary-text)] text-sm">
            First Name
          </p>
          <p className="text-[var(--dark-text)] font-medium ">{firstName}</p>
        </div>
        <div className="flex flex-col w-full gap-1 ">
          <p className=" tracking-wide text-[var(--dark-secondary-text)] text-sm">
            Last Name
          </p>
          <p className="text-[var(--dark-text)] font-medium ">{lastName}</p>
        </div>
      </div>
      <div className="grid items-center grid-flow-col grid-cols-2 gap-7 ">
        <div className="flex flex-col w-full gap-1 ">
          <p className=" tracking-wide text-[var(--dark-secondary-text)] text-sm">
            Email
          </p>
          <p className="text-[var(--dark-text)] font-medium ">{props.email}</p>
        </div>
        <div className="flex flex-col w-full gap-1 ">
          <p className=" tracking-wide text-[var(--dark-secondary-text)] text-sm">
            Phone Number
          </p>
          <p className="text-[var(--dark-text)] font-medium ">
            +977-{props.phoneNumber}
          </p>
        </div>
      </div>
      <div className="grid items-center grid-flow-col grid-cols-2 gap-7 ">
        <div className="flex flex-col w-full gap-1 ">
          <p className=" tracking-wide text-[var(--dark-secondary-text)] text-sm">
            Role
          </p>
          <p className="text-[var(--dark-text)] font-medium ">
            {props?.role?.charAt(0).toUpperCase() + props?.role?.slice(1)}
          </p>
        </div>
      </div>
    </div>
  );
};

const ChangePasswordComponent = () => {
  return (
    <div className="max-w-[1200px] w-full grow flex-col gap-8 flex items-center justify-center px-5 py-7 text-[var(--dark-text)]">
      <div className="flex items-center justify-between w-full gap-5 px-3 py-5  border-b border-b-[var(--light-border)]">
        <p className="flex flex-col gap-1 font-semibold tracking-wide ">
          Change your password
          <span className="text-sm font-normal text-[var(--dark-secondary-text)]">
            Are you sure you want to change your password?
          </span>
        </p>
        <div className="border-[var(--danger-text)] border bg-[var(--light-background)] p-3 rounded-md text-[var(--danger-text)] hover:bg-[var(--danger-bg)] hover:text-[var(--light-text)] cursor-pointer hover:border-[var(--danger-text)] ease-in-out duration-200 transition-all">
          <p className="w-full text-center">Change Password</p>
        </div>
      </div>
      <div className="flex items-center justify-between w-full gap-5 px-3 py-5  border-b border-b-[var(--light-border)]">
        <p className="flex flex-col gap-1 font-semibold tracking-wide">
          Disable your account
          <span className="text-sm font-normal text-[var(--dark-secondary-text)]">
            This will temporarily disable your account.
          </span>
        </p>
        <div className="border-[var(--danger-text)] border bg-[var(--light-background)] p-3 rounded-md text-[var(--danger-text)] hover:bg-[var(--danger-bg)] hover:text-[var(--light-text)] cursor-pointer hover:border-[var(--danger-text)] ease-in-out duration-200 transition-all">
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
        <div className="border-[var(--danger-text)] border bg-[var(--light-background)] p-3 rounded-md text-[var(--danger-text)] hover:bg-[var(--danger-bg)] hover:text-[var(--light-text)] cursor-pointer hover:border-[var(--danger-text)] ease-in-out duration-200 transition-all">
          <p className="w-full text-center">Delete Account</p>
        </div>
      </div>
    </div>
  );
};

export const EditProfileIcon = () => {
  return (
    <div className="bg-[var(--light-foreground)] p-2 rounded-full flex justify-center items-center gap-2 cursor-pointer text-[var(--dark-text)] hover:bg-[var(--primary-color)] hover:text-[var(--light-text)] transition-all ease-in-out duration-250 border border-[var(--light-border)] ">
      <p className="text-xs">Edit</p>
      <EditIcon size={15} />
    </div>
  );
};
