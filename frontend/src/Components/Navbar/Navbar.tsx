import React, { useCallback, useEffect, useRef, useState } from "react";
import CollegeLogo from "../../assets/logo/texas.png";
import {
  Bell,
  BringToFront,
  Heart,
  LogOut,
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
import Cart from "../../Pages/Cart/Cart";
import { MdOutlineShoppingBag } from "react-icons/md";
import { MdOutlineShoppingCartCheckout } from "react-icons/md";
import { useAllProducts } from "../../Hooks/useAllProducts";
import { DarkMode } from "../Button/DarkMode.button";
import { useLogout } from "../AuthProfile/useLogout";

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
  const [openCart, setOpenCart] = useState<boolean>(false);

  const {
    data: allProducts,

    isFetched,
  } = useAllProducts();

  const authUser = useSelector((state: RootState) => state.root.auth.userInfo);

  const FilterRef = useRef<HTMLDivElement | null>(null);
  const profileRef = useRef<HTMLDivElement | null>(null);
  const favouriteReference = useRef<HTMLDivElement | null>(null);
  const notificationReference = useRef<HTMLDivElement | null>(null);
  const cartReference = useRef<HTMLDivElement | null>(null);
  const searchReference = useRef<HTMLDivElement | null>(null);

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
        cartReference.current &&
        !cartReference.current.contains(event.target as any)
      ) {
        setOpenCart(false);
      }
      if (
        notificationReference.current &&
        !notificationReference.current.contains(event.target as any)
      ) {
        setOpenNotification(false);
      }
      // if (
      //   topOrderReference.current &&
      //   !topOrderReference.current.contains(event.target as any)
      // ) {
      //   setOpenOrder(false);
      // }
      if (
        searchReference.current &&
        !searchReference.current.contains(event.target as any)
      ) {
        setOpenSearch(false);
      }
    };

    if (
      !closeProfile ||
      !openFavourite ||
      openNotification ||
      open ||
      openCart ||
      openSearch
    ) {
      document.body.style.overflowY = "hidden";
    } else {
      document.body.style.overflowY = "auto";
    }

    if (
      !closeProfile ||
      !openFavourite ||
      !open ||
      openNotification ||
      !openCart ||
      !openSearch
    ) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflowY = "auto";
    };
  }, [
    closeProfile,
    openFavourite,
    open,
    openNotification,
    openCart,
    openSearch,
  ]);
  const navigate = useNavigate();
  const store = useSelector((state: RootState) => state.root);

  const handleSearch = async (value: string) => {
    if (value.length <= 0) return;
    if (!isFetched) return setLoading(isFetched);

    try {
      setLoading(isFetched);
      const filter = await searchProducts(value);
      setSearchData(filter);
    } catch (error) {
      throw new Error("Error while search product" + error);
    }
    setLoading(false);
  };

  const searchProducts = async (value: string) => {
    if (isFetched) {
      const filterProducts = allProducts?.filter((product) =>
        product.name.toLowerCase().includes(value.toLowerCase())
      );
      return filterProducts;
    }
  };

  const debounceSearch = useCallback(debounce(handleSearch, 200), [
    searchValue,
  ]);

  return (
    <div className=" h-full flex flex-col items-start">
      <nav
        ref={FilterRef}
        className="w-full   bg-[var(--body-bg)]  min-w-[100vw] z-[100] h-[70px] sm:h-[100px] flex justify-between items-center px-5 gap-5 text-[var(--dark-secondary-text)] relative"
      >
        <div className="flex items-center justify-start gap-4">
          <div ref={menuReference as any} className="flex w-full md:hidden ">
            <button className="" onClick={() => setOpen(!open)}>
              {open ? (
                <X className="cursor-pointer md:size-10 size-[30px] sm:size-8" />
              ) : (
                <Menu className="cursor-pointer md:size-10 size-[30px] sm:size-8 " />
              )}
            </button>
            <div
              className={`w-full  backdrop-blur-lg z-[100]  duration-150 ${
                open
                  ? "top-0  left-0 opacity-100 "
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
        <div className="h-full flex items-center text-[var(--dark-text)]">
          <div className="flex items-center justify-center h-full gap-3 place-items-center">
            <div ref={searchReference}>
              <button
                className={`py-2.5 sm:flex hidden rounded-r-lg duration-150`}
                onClick={() => setOpenSearch(!openSearch)}
              >
                {openSearch ? (
                  <X className=" size-[30px] sm:size-7 " />
                ) : (
                  <Search className="size-[30px] sm:size-7" />
                )}
              </button>

              <div
                className={`absolute md:right-3 bg-[var(--light-foreground)] mx-3 px-3 md:px-0 hidden sm:flex border-[var(--dark-border)] border-[1px] rounded-lg  items-center justify-start ${
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
                  className={` w-full sm:flex  duration-150  outline-none   bg-[var(--light-foreground)]   rounded-l-lg  py-2.5 px-5`}
                />
                <button
                  className="  py-2.5 px-2 rounded-r-lg bg-[var(--light-foreground)] "
                  onClick={() => setOpenSearch(false)}
                >
                  <X className="hover:text-[var(--danger-bg)] size-5 md:size-6 " />
                </button>
              </div>
              {/* mobile search */}
              <div
                className={` duration-150 ${
                  searchValue?.length > 0 && openSearch
                    ? "visible opacity-100 translate-y-0 "
                    : "invisible opacity-0 -translate-y-10 "
                } w-full h-full top-[8rem] sm:top-[10rem]   flex justify-end right-0 px-3 absolute`}
              >
                <div className="border-[1px] w-full rounded-lg md:w-auto  px-4 py-3 gap-3 flex flex-col bg-[var(--light-foreground)] border-[var(--dark-border)] overflow-auto h-[60vh]  ">
                  <span
                    className={`text-xs    w-full text-[var(--dark-secondary-text)]`}
                  >
                    {searchData && searchData?.length > 0
                      ? `${searchData?.length} products available`
                      : `No products available`}
                  </span>
                  <div className="w-full md:w-[500px] pr-4 rounded-lg  shadow   scrollbar-custom  overflow-y-auto h-[60vh]  ">
                    {loading ? (
                      <div className="flex items-center justify-center w-full  h-full">
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
            </div>

            {/*cart */}
            <div ref={cartReference} className="relative md:hidden visible ">
              <MdOutlineShoppingBag
                onClick={() => setOpenCart(!openCart)}
                className="cursor-pointer sm:size-7 size-[30px] "
              />
              <div
                className={`sm:w-[10px] size-1.5 duration-150 ${
                  store?.cart?.products.length > 0 && authUser.role
                    ? "visible"
                    : "hidden"
                } top-[6px] sm:top-[2px] right-[4px] sm:right-[2px] absolute sm:h-[10px] rounded-full bg-[#a50c0c]`}
              ></div>
              <div
                className={`absolute ${
                  openCart
                    ? "visible opacity-100 translate-y-0"
                    : "invisible translate-y-10 opacity-0"
                } duration-150 top-10  bg-[var(--light-foreground)] rounded-lg p-2 ${
                  store?.auth?.success
                    ? "right-[-154px] sm:right-[-139px] "
                    : "sm:right-[-85px]  right-[-95px] "
                } w-[342px] sm:w-[450px] h-[524px] sm:h-[585px] `}
              >
                <Cart action={() => setOpenCart(!openCart)} />
              </div>
            </div>
            {/* top products */}
            {/* <div ref={topOrderReference} className="relative">
            <button
              onClick={() => setOpenOrder(!openOrder)}
              className="scale-[1.4]"
            >
              🔥
            </button>
            <div
              className={`absolute ${
                openOrder
                  ? "visible opacity-100 translate-y-0"
                  : "invisible translate-y-10 opacity-0"
              } duration-150 top-10 rounded-lg p-2 right-[-165px] sm:right-[-40px] w-[342px] sm:w-[450px] h-[550px]`}
            >
              <TopProduct />
            </div>
          </div> */}

            <div className="relative " ref={favouriteReference as any}>
              <div className="relative">
                <Heart
                  onClick={() => setOpenFavourite(!openFavourite)}
                  className="cursor-pointer size-[30px] sm:size-7 "
                />
                <div
                  className={`sm:w-[10px] size-1.5 duration-150 ${
                    store?.favourite?.favourite.length > 0 && authUser.role
                      ? "visible"
                      : "hidden"
                  } sm:top-[2px] top-[4px] right-0 absolute sm:h-[10px] rounded-full bg-[#a50c0c]`}
                ></div>
              </div>
              {/* Favourite container */}
              <div
                className={` sm:left-[-23rem] right-[-148px] sm:w-[450px] w-[387px] top-12 duration-150  absolute ${
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

            {/* profile */}
            {authUser.fullName && (
              <div ref={notificationReference as any} className="relative">
                <Bell
                  onClick={() => setOpenNotification(!openNotification)}
                  className="cursor-pointer size-[30px] sm:size-7 "
                />

                <div
                  className={`absolute  w-[350px] z-30 duration-150 ${
                    openNotification
                      ? "visible opacity-100 -translate-y-0 "
                      : "invisible opacity-0 translate-y-10"
                  }   sm:right-[2.7rem] right-[-70px]  top-9`}
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
                      className="size-9 rounded-full  sm:w-11 sm:h-10"
                      src={authUser.avatar}
                      alt=""
                    />
                  </div>
                  <div
                    className={` duration-150 ${
                      !closeProfile && authUser.fullName
                        ? "visible opacity-100 "
                        : "invisible opacity-0 "
                    } w-full absolute right-[256px] sm:right-[19.3rem] top-[46px] sm:top-[53px]  `}
                  >
                    <Profile
                      closeModal={() => setCloseProfile(!closeProfile)}
                      user={authUser}
                    />
                  </div>
                </div>
              )}
              {!authUser?.fullName && (
                <div
                  onClick={() => setCloseProfile(!closeProfile)}
                  className=""
                >
                  <UserCircleIcon className=" sm:size-7 size-[30px] transition-colors duration-500 ease-in-out md:flex hover:text-[var(--secondary-color)] cursor-pointer shrink-0" />
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
      <div
        className={` sm:hidden w-[280px]  bg-[var(--light-background)] text-[var(--dark-text)]  ml-[22px] px-1  flex border-[var(--dark-border)] border-[1px] rounded-lg  items-center justify-start  duration-150 `}
      >
        <button
          className="  py-1.5 px-1 text-[var(--dark-secondary-text)] rounded-r-lg bg-[var(--light-background)] "
          onClick={() => setOpenSearch(false)}
        >
          <Search className="hover:text-[var(--danger-bg)] size-[17px] sm:size-6 " />
        </button>
        <input
          onFocus={() => setOpenSearch(true)}
          value={searchValue}
          onChange={(event) => {
            debounceSearch(event.target.value);
            setSearchValue(event.target.value);
          }}
          placeholder="Search...."
          type="text"
          className={` w-full placeholder:text-[14px]  duration-150  outline-none   bg-[var(--light-background)]   rounded-l-lg  py-1 px-1`}
        />
      </div>
    </div>
  );
};

interface MobileSliderProp {
  action: () => void;
  open: boolean;
}

export const MobileSlider: React.FC<MobileSliderProp> = ({ action, open }) => {
  const user = useSelector((state: RootState) => state.root.auth.userInfo);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const reference = useRef<HTMLDivElement | null>(null);

  const { loading, logout } = useLogout();

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

  return (
    <div
      ref={reference}
      className="w-[250px] relative  gap-5 px-3 py-10 h-screen  bg-[var(--light-foreground)] flex flex-col items-center justify-between rounded"
    >
      <div className="flex justify-between py-3  items-start w-full">
        <div
          onClick={() => navigate("/")}
          className=" w-[150px] cursor-pointer h-[50px] "
        >
          <img className="w-full h-full" src={CollegeLogo} alt="" />
        </div>
        <button onClick={() => action()} className="">
          <X className="duration-150 size-[30px] sm:size-7 hover:text-red-600" />
        </button>
      </div>
      <div className="flex items-center justify-start w-full gap-5 pl-3">
        <div className="w-[50px] h-[50px] ">
          <img
            className="w-full h-full rounded-lg"
            src={user?.avatar || Avatar}
            alt=""
          />
        </div>
        {
          <div className="flex flex-col items-start justify-center ">
            <p className="text-[15px] tracking-wider ">
              {(user.fullName &&
                user?.fullName.charAt(0).toUpperCase() +
                  user?.fullName?.slice(1)) ||
                "Guest"}
            </p>
            <span className="text-xs text-gray-300 ">
              {user?.email || "guest@gmail.com"}
            </span>
          </div>
        }
      </div>
      <div className="flex  pt-5 scrollbar-custom items-start justify-start flex-grow w-full h-full overflow-auto">
        <ul className="flex flex-col text-[var(--dark-text)] items-start justify-center w-full gap-4 sm:gap-10">
          <li
            onClick={() => {
              navigate("/");
              action();
            }}
            className="flex items-center justify-start gap-5  cursor-pointer hover:bg-[#e8e8e8] dark:hover:bg-[#121b28] text-[15px]   w-full p-3 rounded duration-150"
          >
            <FaHouseUser className="size-5" />
            <span>Home</span>
          </li>
          <li
            onClick={() => {
              navigate("cart");
              action();
            }}
            className="flex items-center justify-start gap-5  cursor-pointer hover:bg-[#e8e8e8] dark:hover:bg-[#121b28]  text-[15px]  w-full p-3 rounded duration-150"
          >
            <ShoppingBag className="size-5" />
            <span>Cart</span>
          </li>
          <li
            onClick={() => {
              navigate("orders");
              action();
            }}
            className="flex items-center justify-start gap-5  cursor-pointer hover:bg-[#e8e8e8] dark:hover:bg-[#121b28]  text-[15px]  w-full p-3 rounded duration-150"
          >
            <BringToFront className="size-5" />
            <span>Order</span>
          </li>
          <li
            onClick={() => {
              navigate("profile");
              action();
            }}
            className="flex items-center justify-start gap-5  cursor-pointer hover:bg-[#e8e8e8] dark:hover:bg-[#121b28] text-[15px]   w-full p-3 rounded duration-150"
          >
            <Settings className="size-5" />
            <span>Setting</span>
          </li>
          <DarkMode />
        </ul>
      </div>
      <button
        disabled={loading}
        onClick={() => {
          logout();
          action();
        }}
        className="flex top-[85vh] left-2 right-2 absolute items-center justify-start gap-5  cursor-pointer hover:bg-[#e8e8e8] dark:hover:bg-[#121b28]     p-3 rounded duration-150"
      >
        <LogOut className="size-5" />
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

  useEffect(() => {
    window.addEventListener("scroll", changeColor);

    return () => {
      window.removeEventListener("scroll", changeColor);
    };
  }, []);

  return (
    <header className="w-full min-w-[100vw] h-full relative ">
      <div className={"bg-[var(--primary-color)] sm:flex hidden "}>
        <div className="flex items-center gap-2 px-5 py-2">
          <Phone className="text-[var(--secondary-color)] sm:size-6 size-5 " />
          <p className="text-xs text-[var(--light-secondary-text)] ">
            01-4589134, 01-4588627,9801644462
          </p>
        </div>
        <div></div>
      </div>
      <div
        className={
          "fixed left-0 bg-[var(--body-bg)] pb-1 top-0 sm:top-[41px] transition-transform ease-in-out duration-700 " +
          (nav ? " sm:translate-y-[-41px]" : " sm:translate-y-0")
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
        <h1 className="sm:text-[15px] text-[12px] font-medium tracking-wide text-[var(--dark-text)]">
          {data.name}
        </h1>
        <p
          className={`sm:text-[14px] text-xs text-[var(--dark-secondary-text)] ${
            data?.quantity < 20
              ? "text-orange-400"
              : data.quantity <= 0
              ? "text-red-500"
              : ""
          } `}
        >
          Rs.{data.price}{" "}
          {data.quantity <= 20 ? ` • ${data.quantity}  left` : ""}
        </p>
        {data.tag && (
          <span className="text-[12px] text-[var(--primary-color)]">
            {data.tag}
          </span>
        )}
      </div>
      <button
        className="bg-[var(--primary-color)] text-white py-2 px-2 sm:px-3 rounded-md hover:bg-[var(--primary-dark)] duration-150 sm:text-[14px]"
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
        <MdOutlineShoppingCartCheckout className="sm:size-6 size-5 text-[var(--dark-text)] " />
      </button>
    </div>
  );
};
