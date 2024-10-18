import React, { useCallback, useEffect, useRef, useState } from "react";
import CollegeLogo from "../../assets/logo/texas.png";
import {
  Bell,
  BringToFront,
  Heart,
  Menu,
  Phone,
  Search,
  Settings,
  ShoppingBag,
  UserCircleIcon,
  X,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../../Store";
import Favourite from "../../Pages/Cart/Favourite";
import Modal from "../Common/Popup/Popup";
import { LoginContainer } from "../Login/Login";
import Profile from "../AuthProfile/AuthProfile";
import { Product } from "../../models/product.model";
import { debounce } from "../../Utility/Debounce";
import {
  getNormalProducts,
  getSpecialProducts,
} from "../../Services/product.services";
import { addToCart, resetCart } from "../../Reducer/product.reducer";
import toast from "react-hot-toast";
import { RotatingLines } from "react-loader-spinner";
import { NotificationPage } from "../Notification/Notification";
import { FaHouseUser } from "react-icons/fa";
import { makeRequest } from "../../makeRequest";
import { signOutUser } from "../../firebase/Authentication";
import { authLogout } from "../../Reducer/user.reducer";
import Cookies from "js-cookie";
import Avatar from "../../assets/logo/avatar.png";

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

export const NavbarContainer = () => {
  const location = useLocation();

  return (
    <div className="flex flex-col items-start justify-start w-full h-full text-start md:flex-row md:items-center md:justify-center">
      {navbarItems &&
        navbarItems.map((item, index) => (
          <Link
            to={item.url}
            key={index}
            className={
              "h-full px-5 py-4 text-[var(--dark-text)] hover:bg-[var(--primary-color)] hover:font-bold hover:text-[var(--secondary-color)]  text-start w-full md:w-[100px] " +
              (location.pathname === item.url
                ? " font-bold text-[var(--secondary-color)] "
                : " ")
            }
          >
            <p className="flex items-center justify-start w-full h-full tracking-wider md:justify-center text-md">
              {item.name}
            </p>
          </Link>
        ))}
    </div>
  );
};

export const Navbar: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const menuReference = useRef<HTMLDivElement | null>();
  const [openSearch, setOpenSearch] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");
  const [searchData, setSearchData] = useState<Product[]>();
  const [closeProfile, setCloseProfile] = useState<boolean>(true);
  const [openFavourite, setOpenFavourite] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [openNotification, setOpenNotification] = useState<boolean>(false);

  const authUser = useSelector((state: RootState) => state.root.auth.userInfo);

  const FilterRef = useRef<HTMLDivElement | null>(null);
  const profileRef = useRef<HTMLDivElement | null>(null);
  const favouriteReference = useRef<HTMLDivElement | null>(null);
  const notificationReference = useRef<HTMLDivElement | null>(null);

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
      if (
        menuReference.current &&
        !menuReference.current.contains(event.target as any)
      ) {
        setOpen(false);
      }
      if (
        notificationReference.current &&
        !notificationReference.current.contains(event.target as any)
      ) {
        setOpenNotification(false);
      }
    };

    if (!closeProfile || !openFavourite || !open || openNotification) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeProfile, openFavourite]);
  const navigate = useNavigate();
  const isFavourite = useSelector((state: RootState) => state.root.favourite);

  const handleSearch = async (value: string) => {
    if (value.length <= 0) return;
    setLoading(true);
    try {
      const filter = await searchProducts(value);
      setSearchData(filter);
    } catch (error) {
      throw new Error("Error while search product" + error);
    }
    setLoading(false);
  };

  const searchProducts = async (value: string) => {
    const [specialProducts, normalProducts] = [
      await getSpecialProducts(),
      await getNormalProducts(),
    ];
    const allProducts = [
      ...specialProducts?.data,
      ...normalProducts?.data,
    ] as Product[];
    const filterProducts = allProducts?.filter((product) =>
      product.name.toLowerCase().includes(value.toLowerCase())
    );
    return filterProducts;
  };

  const debounceSearch = useCallback(debounce(handleSearch, 200), []);

  return (
    <nav
      ref={FilterRef}
      className="w-full  backdrop-blur bg-[var(--body-bg)]  min-w-[100vw] z-[100] h-[100px] flex justify-between items-center px-5 gap-5 text-[var(--dark-secondary-text)] relative"
    >
      <div className="flex items-center justify-start gap-4">
        <div ref={menuReference as any} className="flex w-full md:hidden ">
          <button className="" onClick={() => setOpen(!open)}>
            {open ? (
              <X className="md:size-10 cursor-pointer size-8" />
            ) : (
              <Menu className="md:size-10 cursor-pointer size-8 " />
            )}
          </button>
          <div
            className={`w-full backdrop-blur-lg z-[100]  duration-150 ${
              open
                ? "top-0 left-0 opacity-100 "
                : " opacity-0 bg-transparent left-[-1000px] "
            }  flex justify-start items-center absolute   `}
          >
            <MobileSlider open={open} action={() => setOpen(!open)} />
          </div>
        </div>
        {/* Logo */}
        <div
          className="items-center hidden cursor-pointer sm:flex shrink-0 "
          onClick={() => navigate("/")}
        >
          <img
            src={CollegeLogo}
            alt="college logo"
            className="max-h-[80px]  w-[160px]  md:w-full h-full p-2  "
          />
        </div>
      </div>
      {/* Navbar  */}
      <div className="hidden h-full md:flex">
        <NavbarContainer />
      </div>
      {/*  Product Search */}
      <div className="h-full flex items-center text-[var(--dark-text)] px-3">
        <div className="flex items-center justify-center h-full gap-3 place-items-center">
          <div>
            <button
              className={`py-2.5 rounded-r-lg duration-150`}
              onClick={() => setOpenSearch(!openSearch)}
            >
              {openSearch ? <X className="" /> : <Search className="size-7 " />}
            </button>
            <div
              className={`absolute md:right-3 bg-[var(--light-foreground)] mx-3 px-3 md:px-0 flex border-[var(--dark-border)] border-[1px] rounded-lg  items-center justify-start ${
                openSearch
                  ? "visible md:w-[500px] translate-y-0 opacity-100 "
                  : "w-0 invisible opacity-0  -translate-y-10 "
              } duration-150 top-[103px] right-0 md:left-auto left-0 `}
            >
              <input
                value={searchValue}
                onChange={(event) => {
                  debounceSearch(event.target.value);
                  setSearchValue(event.target.value);
                }}
                type="text"
                className={` w-full  duration-150  outline-none   bg-[var(--light-foreground)]   rounded-l-lg  py-2.5 px-5`}
              />
              <button
                className="  py-2.5 px-2 rounded-r-lg bg-[var(--light-foreground)] "
                onClick={() => setOpenSearch(false)}
              >
                <X className="hover:text-[var(--danger-bg)] size-5 md:size-6 " />
              </button>
            </div>
            <div
              className={` duration-150 ${
                openSearch && searchValue.length > 0
                  ? "visible opacity-100 translate-y-0 "
                  : "invisible opacity-0 -translate-y-10 "
              } w-full h-full top-[10rem]  flex justify-end right-0 px-3 absolute`}
            >
              <div className="w-full md:w-[500px] border-[var(--dark-border)] rounded-lg border-[1px] shadow  px-4 py-3 scrollbar-custom  overflow-y-auto bg-[var(--light-foreground)] h-[60vh] ">
                {loading ? (
                  <div className="flex items-center justify-center w-full h-full">
                    <p className="text-[20px]  flex items-center justify-center gap-3 text-[var(--light-secondary-text)] font-semibold ">
                      <RotatingLines
                        strokeColor="var(--dark-secondary-text)"
                        width="27"
                      />{" "}
                      <span> Loading...Please wait!</span>
                    </p>
                  </div>
                ) : (
                  searchData?.map((data) => (
                    <SearchProductCard
                      id={data.id}
                      image={data.image}
                      name={data.name}
                      price={data.price}
                      quantity={data.quantity}
                      key={data.id}
                      tag={data.tag}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
          <div className="relative " ref={favouriteReference as any}>
            {/* Favourite icon */}
            <div className="relative">
              <Heart
                onClick={() => setOpenFavourite(!openFavourite)}
                className="cursor-pointer size-7 "
              />
              <div
                className={`w-[10px] duration-150 ${
                  isFavourite.favourite.length > 0 && authUser.role
                    ? "visible"
                    : "hidden"
                } top-[2px] right-0 absolute h-[10px] rounded-full bg-[#a50c0c]`}
              ></div>
            </div>
            {/* Favourite container */}
            <div
              className={` sm:left-[-23rem] right-[-160px] sm:w-[450px] w-[400px] top-12 duration-150  absolute ${
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
          {authUser.fullName && (
            <div ref={notificationReference as any} className="relative">
              <Bell
                onClick={() => setOpenNotification(!openNotification)}
                className="cursor-pointer size-7 "
              />
              <div
                className={`absolute  w-[300px] z-30 duration-150 ${
                  openNotification
                    ? "visible opacity-100 -translate-y-0 "
                    : "invisible opacity-0 translate-y-10"
                }   sm:right-[4.7rem] right-[-40px]  top-8`}
              >
                <NotificationPage isOpen={openNotification} />
              </div>
            </div>
          )}
          <div ref={profileRef} className="">
            {authUser?.avatar && (
              <div className="relative w-full">
                <div
                  onClick={() => setCloseProfile(!closeProfile)}
                  className=" hover:bg-[#8080807c]  p-1 rounded-full cursor-pointer group/user"
                >
                  <img
                    className="w-10 rounded-full h-9 sm:w-11 sm:h-10"
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
                  <Profile
                    closeModal={() => setCloseProfile(!closeProfile)}
                    user={authUser}
                  />
                </div>
              </div>
            )}
            {!authUser?.fullName && (
              <div onClick={() => setCloseProfile(!closeProfile)} className="">
                <UserCircleIcon
                  className=" transition-colors duration-500 ease-in-out md:flex hover:text-[var(--secondary-color)] cursor-pointer shrink-0"
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

interface MobileSliderProp {
  action: () => void;
  open: boolean;
}

export const MobileSlider: React.FC<MobileSliderProp> = ({ action, open }) => {
  const user = useSelector((state: RootState) => state.root.auth.userInfo);

  const dispatch = useDispatch<AppDispatch>();

  const reference = useRef<HTMLDivElement | null>(null);

  const handleLogout = async () => {
    const toastLoader = toast.loading("Logging out, please wait...");

    try {
      const response = await makeRequest.post("/users/logout");

      if (response.status === 200) {
        await signOutUser();
        dispatch(authLogout());
        dispatch(resetCart());
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        toast.dismiss(toastLoader);
        toast.success("Logged out successfully!");
      } else {
        console.log(` Error : authProfile`);
      }
    } catch (error) {
      toast.dismiss(toastLoader);
      toast.error("Error logging out. Please try again.");
      // throw new Error("Error logging out." + error);
    }
  };

  useEffect(() => {
    const handleScroll = (event: MouseEvent) => {
      if (
        reference.current &&
        !reference.current.contains(event.target as Node)
      ) {
        action();
      }
    };
    if (open) {
      window.addEventListener("mousedown", handleScroll);
    }

    return () => {
      window.removeEventListener("mousedown", handleScroll);
    };
  });

  const navigate = useNavigate();
  return (
    <div
      ref={reference}
      className="w-[300px]  gap-10 px-3 py-7 h-screen  bg-[var(--light-foreground)] flex flex-col items-center justify-between rounded"
    >
      <div className="w-full flex justify-end">
        <button onClick={() => action()} className="">
          <X className="size-7 hover:text-red-600 duration-150" />
        </button>
      </div>
      <div className="w-full pl-3 flex items-center justify-start gap-5">
        <div className="w-[60px] h-[60px] ">
          <img
            className="w-full h-full rounded-lg"
            src={user?.avatar || Avatar}
            alt=""
          />
        </div>
        {
          <div className="flex flex-col items-start justify-center ">
            <p className=" text-lg tracking-wider ">
              {user?.fullName || "Guest"}
            </p>
            <span className=" text-gray-300 text-xs ">
              {user?.email || "guest@gmail.com"}
            </span>
          </div>
        }
      </div>
      <div className="flex w-full items-start justify-start flex-grow h-full overflow-auto">
        <ul className="flex flex-col text-[var(--dark-text)] items-start justify-center w-full gap-7">
          <li
            onClick={() => navigate("/")}
            className="flex items-center justify-start gap-5  cursor-pointer hover:bg-[#e8e8e8] dark:hover:bg-[#121b28]    w-full p-3 rounded duration-150"
          >
            <FaHouseUser className="size-5" />
            <span>Home</span>
          </li>
          <li
            onClick={() => navigate("cart")}
            className="flex items-center justify-start gap-5  cursor-pointer hover:bg-[#e8e8e8] dark:hover:bg-[#121b28]    w-full p-3 rounded duration-150"
          >
            <ShoppingBag className="size-5" />
            <span>Cart</span>
          </li>
          <li
            onClick={() => navigate("orders")}
            className="flex items-center justify-start gap-5  cursor-pointer hover:bg-[#e8e8e8] dark:hover:bg-[#121b28]    w-full p-3 rounded duration-150"
          >
            <BringToFront className="size-5" />
            <span>Order</span>
          </li>
          <li
            onClick={() => navigate("profile")}
            className="flex items-center justify-start gap-5  cursor-pointer hover:bg-[#e8e8e8] dark:hover:bg-[#121b28]    w-full p-3 rounded duration-150"
          >
            <Settings className="size-5" />
            <span>Setting</span>
          </li>
        </ul>
      </div>
      <button
        onClick={() => handleLogout()}
        className="flex items-center justify-start gap-5  cursor-pointer hover:bg-[#e8e8e8] dark:hover:bg-[#121b28]  mb-7  w-full p-3 rounded duration-150"
      >
        Logout
      </button>
    </div>
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
        <div className="flex items-center px-5 py-2">
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

export const SearchProductCard: React.FC<Product> = (data) => {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div
      key={data.id}
      className="w-full flex items-center gap-5 p-3 mb-4 bg-[var(--light-background)] border border-[var(--dark-border)] rounded-lg shadow-sm hover:shadow-md duration-150"
    >
      <img
        src={data.image}
        className="w-[60px] h-[60px] rounded-lg object-cover"
        alt={data.name}
      />
      <div className="flex-1">
        <h1 className="text-[15px] font-medium tracking-wide text-[var(--dark-text)]">
          {data.name}
        </h1>
        <p className="text-[14px] text-[var(--dark-secondary-text)]">
          Rs.{data.price} &bull; {data.quantity} left
        </p>
        {data.tag && (
          <span className="text-[12px] text-[var(--primary-color)]">
            {data.tag}
          </span>
        )}
      </div>
      <button
        className="bg-[var(--primary-color)] text-white py-1 px-3 rounded-md hover:bg-[var(--primary-dark)] duration-150 text-[14px]"
        onClick={() => {
          dispatch(
            addToCart({
              id: data.id,
              name: data.name,
              price: data.price,
              quantity: 1,
              image: data.image,
            })
          );
          toast.success("Product Added!");
        }}
      >
        Add to Cart
      </button>
    </div>
  );
};
