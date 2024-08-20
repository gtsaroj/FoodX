import { useEffect, useRef, useState } from "react";
import CollegeLogo from "../../assets/logo/texas.png";
import { Heart, Phone, ShoppingBag, UserCircleIcon } from "lucide-react";
import { useSelector } from "react-redux";
import { UseFetch } from "../../UseFetch";
import { Link, useNavigate } from "react-router-dom";
import { RootState } from "../../Store";
import Favourite from "../../Pages/Cart/Favourite";
import Modal from "../Common/Popup/Popup";
import { LoginContainer } from "../Login/Login";
import Profile from "../AuthProfile/AuthProfile";
const navbarItems = [
  {
    name: "Home",
    url: "/",
  },
  {
    name: "Cart",
    url: "/cart",
  },
  {
    name: "Orders",
    url: "/orders",
  },
];

export const Navbar: React.FC = () => {
  const [activeNav, setActiveNav] = useState<number>(0);
  const [closeProfile, setCloseProfile] = useState<boolean>(true);
  const [openFavourite, setOpenFavourite] = useState<boolean>(true);

  const { data: specialProducts } = UseFetch("/products/specials");
  const authUser = useSelector((state: RootState) => state.root.auth.userInfo);

  const FilterRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement | null>(null);
  const favouriteReference = useRef<HTMLDivElement>();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        favouriteReference.current &&
        !favouriteReference.current.contains(event.target as any)
      ) {
        setOpenFavourite(true);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as any)
      ) {
        setCloseProfile(true);
      }
    };

    if (!closeProfile || !openFavourite) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeProfile, openFavourite]);
  const navigate = useNavigate();
  const isFavourite = useSelector((state: RootState) => state.root.favourite);

  return (
    <nav
      ref={FilterRef}
      className="w-full min-w-[100vw] z-[100] h-[100px] flex justify-between items-center px-5 gap-5 text-[var(--dark-secondary-text)] relative"
    >
      {/* Logo */}
      <div
        className="flex items-center cursor-pointer shrink-0 "
        onClick={() => navigate("/")}
      >
        <img
          src={CollegeLogo}
          alt="college logo"
          className="max-h-[80px]  w-[160px]  sm:w-full h-full p-2  "
        />
      </div>
      {/* Navbar  */}
      <div className="items-center justify-around hidden h-full md:flex">
        {navbarItems &&
          navbarItems.map((item, index) => (
            <Link
              to={item.url}
              key={index}
              onClick={() => setActiveNav(index)}
              className={
                "h-full px-5 py-4 hover:bg-[var(--primary-color)] hover:font-bold hover:text-[var(--secondary-color)] w-[100px] " +
                (activeNav === index
                  ? " font-bold text-[var(--secondary-color)] "
                  : " ")
              }
            >
              <p className="flex items-center justify-center h-full tracking-wider text-md">
                {item.name}
              </p>
            </Link>
          ))}
      </div>
      {/*  Product Search */}
      <div className="h-full gap-2  flex items-center text-[var(--dark-text)] px-3">
        <div className="flex items-center justify-center h-full space-x-3 place-items-center">
          {/* Cart */}
          <div
            onClick={() => navigate("/cart")}
            className="flex cursor-pointer items-center justify-center md:hidden"
          >
            <ShoppingBag />
          </div>
          <div className="relative" ref={favouriteReference as any}>
            {/* Favourite icon */}
            <div className="relative">
              <Heart
                onClick={() => setOpenFavourite(!openFavourite)}
                className="size-7 cursor-pointer "
              />
              <div
                className={`w-[10px] duration-150 ${
                  isFavourite.favourite.length > 0 ? "visible" : "invisible"
                } top-[2px] right-0 absolute h-[10px] rounded-full bg-[#a50c0c]`}
              ></div>
            </div>
            {/* Favourite container */}
            <div
              className={` left-[-23rem] top-12 duration-150 absolute ${
                !openFavourite && authUser.fullName
                  ? "visible z-10 translate-y-0 opacity-100 "
                  : "-translate-y-2 invisible opacity-0 z-[-100]"
              } `}
            >
              <Favourite />
            </div>
            {!openFavourite && !authUser.fullName && (
              <Modal
                close={openFavourite}
                closeModal={() => setOpenFavourite(!openFavourite)}
              >
                <LoginContainer />
              </Modal>
            )}
          </div>
          <div ref={profileRef} className="w-full">
            {authUser?.avatar && (
              <div className="w-full relative">
                <div
                  onClick={() => setCloseProfile(!closeProfile)}
                  className=" hover:bg-[#8080807c]  p-1 rounded-full cursor-pointer group/user"
                >
                  <img
                    className="rounded-full sm:size-9 size-8"
                    src={authUser.avatar}
                    alt=""
                  />
                </div>
                <div
                  className={` duration-150 ${
                    !closeProfile && authUser.fullName
                      ? "visible opacity-100 "
                      : "invisible opacity-0 "
                  } w-full absolute right-[19.3rem] top-[45px]  `}
                >
                  <Profile user={authUser} />
                </div>
              </div>
            )}
            {!authUser?.fullName && (
              <div onClick={() => setCloseProfile(!closeProfile)} className="">
                <UserCircleIcon
                  className="hidden transition-colors duration-500 ease-in-out md:flex hover:text-[var(--secondary-color)] cursor-pointer shrink-0"
                  size={30}
                />
              </div>
            )}
            {!closeProfile && !authUser?.fullName && (
              <Modal
                close={closeProfile}
                closeModal={() => setCloseProfile(!closeProfile)}
              >
                <LoginContainer />
              </Modal>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

//header
export const Header: React.FC = () => {
  const [nav, setNav] = useState<boolean>(false);
  const changeColor = () => {
    if (window.scrollY >= 10) {
      setNav(true);
    } else {
      setNav(false);
    }
  };

  window.addEventListener("scroll", changeColor);

  return (
    <header className="w-full min-w-[100vw] h-full relative ">
      <div className={"bg-[var(--primary-color)] "}>
        <div className="flex items-center px-5 py-2 space-x-3">
          <Phone className="text-[var(--secondary-color)]" size={25} />
          <p className="text-xs text-[var(--light-secondary-text)] ">
            01-4589134, 01-4588627,9801644462
          </p>
        </div>
        <div></div>
      </div>
      <div
        className={
          "fixed left-0 bg-[var(--light-background)] top-[41px] transition-transform ease-in-out duration-700 " +
          (nav ? " translate-y-[-41px]" : " translate-y-0")
        }
      >
        <Navbar />
      </div>
    </header>
  );
};
