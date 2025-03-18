import { useEffect, useRef, useState } from "react";
import Image from "@/assets/560px.png";
import { ProductSearch } from "@/features";
import { Icons } from "@/utils";
import { useAppSelector } from "@/hooks";
import { Modal } from "@/commons";
import {
  NavbarContainer,
  NotificationPage,
  LoginContainer,
} from "@/components";
import { useNavigate } from "react-router-dom";
import Logo from "@/assets/brand.png";
import { Image as ImageComponent } from "@/helpers";
import Avatar from "@/assets/logo/avatar.png";

export const Header = () => {
  return (
    <div
      className=" bg-green-400  h-[45vh] rounded-b-lg sm:h-[80vh] gap-10 sm:gap-40 flex flex-col items-center justify-start   bg-cover sm:bg-center  py-3 px-2 w-full "
      style={{
        backgroundImage: `url(${Image})`,
      }}
    >
      <DesktopNavbar />
      <MobileNav />
      <div className=" max-w-lg w-full">
        <ProductSearch action={(value) => console.log(value)} />
      </div>
    </div>
  );
};

const DesktopNavbar = () => {
  const [closeProfile, setCloseProfile] = useState<boolean>(true);
  const notifcationRef = useRef<HTMLDivElement | null>(null);
  const [showNotification, setShowNotification] = useState(false);

  const { auth } = useAppSelector();
  const profileRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function closeModal(event: MouseEvent) {
      if (
        notifcationRef.current &&
        !notifcationRef.current.contains(event.target as Node)
      ) {
        setShowNotification(false);
      }
    }
    if (showNotification) {
      document.addEventListener("mousedown", closeModal);
    }
    return () => {
      document.removeEventListener("mousedown", closeModal);
    };
  }, [showNotification]);

  return (
    <div
      ref={notifcationRef}
      className="w-full hidden relative px-20 lg:flex items-center justify-between"
    >
      <div className="w-full relative flex items-center px-10 py-5  justify-between  gap-5">
        <div className="flex items-center justify-start gap-3">
          <div
            onClick={() => {
              navigate("/");
            }}
            className="  cursor-pointer -top-7  size-12 border rounded-lg "
          >
            <ImageComponent
              className="w-full h-full object-cover"
              lowResSrc={Logo}
              highResSrc={Logo}
              alt=""
            />
          </div>
          <h1 className=" text-3xl font-bold text-white ">FoodX</h1>
        </div>
        <NavbarContainer />
      </div>
      <div className="flex lg:hid items-center justify-start gap-8">
        {auth?.success && (
          <button
            className="hidden md:flex"
            onClick={() => setShowNotification(!showNotification)}
          >
            <Icons.bell className=" size-6 sm:size-7 text-white " />
          </button>
        )}
        <button
          onClick={() =>
            auth?.success
              ? navigate("/favourite")
              : setShowNotification(!showNotification)
          }
          className=" flex items-center text-lg justify-center w-[180px] font-semibold border-[var(--light-border)] text-white gap-2 border  py-3 rounded-xl "
        >
          Get the Favorite <Icons.heart className="size-5" />
        </button>
        <div ref={profileRef} className="">
          {auth.userInfo?.avatar && (
            <div className="relative w-full">
              <div
                onClick={() => navigate(`profile`)}
                className=" hover:bg-[#8080807c] ring-1 ring-gray-300 size-9 overflow-hidden rounded-full cursor-pointer group/user"
              >
                <ImageComponent
                  className=" rounded-full object-cover size-full "
                  lowResSrc={Avatar}
                  highResSrc={
                    import.meta.env.VITE_URI + "assets/" + auth.userInfo.avatar
                  }
                  alt="avatar"
                />
              </div>
            </div>
          )}
          {!auth.userInfo?.fullName && (
            <button
              onClick={() => setCloseProfile(!closeProfile)}
              className="bg-black px-10 py-3 rounded-xl "
            >
              <h1 className=" text-lg font-semibold text-white ">Login</h1>
            </button>
          )}
          {!closeProfile && !auth.userInfo?.fullName && (
            <Modal
              close={closeProfile}
              closeModal={() => setCloseProfile(!closeProfile)}
            >
              <LoginContainer />
            </Modal>
          )}
        </div>
      </div>
      {!auth?.success ? (
        <Modal
          close={!showNotification}
          closeModal={() => setShowNotification(!showNotification)}
        >
          <LoginContainer />
        </Modal>
      ) : (
        <div
          className={`hidden md:flex  absolute duration-150 ${
            showNotification ? "scale-100" : "scale-0"
          } max-w-[400px] right-0 top-14 w-full `}
        >
          {showNotification && <NotificationPage isOpen={showNotification} />}
        </div>
      )}
    </div>
  );
};

const MobileNav = () => {
  const [closeProfile, setCloseProfile] = useState<boolean>(true);
  const { auth } = useAppSelector();
  const profileRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  return (
    <div className="w-full lg:hidden flex items-center justify-between  py-3">
      <div></div>
      <div ref={profileRef} className="">
        {auth.userInfo?.avatar && (
          <div className="relative w-full">
            <div
              onClick={() => navigate(`profile`)}
              className=" hover:bg-[#8080807c] ring-1 ring-gray-300 size-9 overflow-hidden rounded-full cursor-pointer group/user"
            >
              <ImageComponent
                className=" rounded-full object-cover size-full "
                lowResSrc={Avatar}
                highResSrc={
                  import.meta.env.VITE_URI + "assets/" + auth.userInfo.avatar
                }
                alt="avatar"
              />
            </div>
          </div>
        )}
        {!auth.userInfo?.fullName && (
          <button
            onClick={() => setCloseProfile(!closeProfile)}
            className="  rounded-xl "
          >
            <Icons.user className="size-8" />
          </button>
        )}
        {!closeProfile && !auth.userInfo?.fullName && (
          <Modal
            close={closeProfile}
            closeModal={() => setCloseProfile(!closeProfile)}
          >
            <LoginContainer />
          </Modal>
        )}
      </div>
    </div>
  );
};
