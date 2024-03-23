import { ChangeEvent, useEffect, useState } from "react";
import CollegeLogo from "../../logo/texas.png";
import {
  MenuIcon,
  Phone,
  Search,
  ShoppingCart,
  UserCircleIcon,
  X,
} from "lucide-react";
import { signOutUser } from "../../firebase/Authentication";
import { useDispatch, useSelector } from "react-redux";
import { authLogout } from "../../Reducer/authReducer";
import { makeRequest } from "../../makeRequest";
import Cookies from "js-cookie";
import { UseFetch } from "../../UseFetch";
import { ProductType } from "../../models/productMode";
import { useNavigate } from "react-router-dom";
import { Root } from "postcss";
import { RootState } from "../../Reducer/Store";
import ProductSearch from "./ProductSearch";
const navbarItems = [
  {
    name: "Home",
    url: "#",
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
  const [search, setSearch] = useState<boolean>(false);
  const [mobileMenu, setMobileMenu] = useState<boolean>(false);
  const [filteredData, setFilteredData] = useState<string>("");
  const [storeFilteredData, setStoreFilteredData] = useState<
    ProductType[] | undefined
  >();

  const dispatch = useDispatch();

  const handleLogout = async () => {
    const response = await makeRequest.post("/users/logout");
    console.log(response.data);
    await signOutUser();
    dispatch(authLogout());
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
  };
  const { data, loading, error } = UseFetch("/products/all");
  const userImage = useSelector((state: RootState) => state.root.auth.userInfo);

  useEffect(() => {
    const filteringData: any = data?.filter((singleProduct) =>
      singleProduct.name.toLowerCase().includes(filteredData?.toLowerCase())
    );
    setStoreFilteredData(filteringData);
  }, [filteredData]);
  console.log(filteredData);
  return (
    <nav className="w-full min-w-[100vw] h-[100px] flex justify-between items-center px-5 gap-5 text-[var(--dark-secondary-text)] relative">
      {/* Logo */}
      <div className="flex items-center h-full overflow-hidden shrink-0 ">
        <img
          src={CollegeLogo}
          alt="college logo"
          className="max-h-[80px] h-full p-2  "
        />
      </div>
      {/*  */}
      <div className="items-center justify-around hidden h-full md:flex">
        {navbarItems &&
          navbarItems.map((item, index) => (
            <a
              href={item.url}
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
            </a>
          ))}
      </div>
      {/*  */}
      <div className="h-full  flex items-center text-[var(--dark-text)] px-3">
        <div className="flex items-center justify-center h-full space-x-3 place-items-center">
          <button
            onClick={handleLogout}
            className="text-[15px] px-7 py-2 rounded-sm font-semibold bg-[var(--primary-color)] text-white hover:bg-[var(--secondary-color)]"
          >
            logout
          </button>
          <div className="flex items-center justify-center shrink-0">
            <Search
              onClick={() => setSearch((search) => !search)}
              size={30}
              className=" cursor-pointer hover:text-[var(--secondary-color)] transition-colors duration-500 ease-in-out lg:hidden "
            />
          </div>
          <div className="hidden lg:flex">
            <DesktopSearch />
          </div>
          {/* <div className="flex items-center justify-center">
            <ShoppingCart size={30} />
          </div> */}
          {userImage?.avatar ? (
            <div className=" cursor-pointer relative group/user size-10">
              <img
                className="size-full rounded-full"
                src={userImage.avatar}
                alt=""
              />
              <p className="  text-sm absolute w-full transition-all opacity-[0] group-hover/user:opacity-[1] group-hover/user:visible invisible">
                {userImage?.fullName}
              </p>
            </div>
          ) : (
            <div className="">
              <UserCircleIcon
                className="hidden transition-colors duration-500 ease-in-out md:flex hover:text-[var(--secondary-color)] cursor-pointer shrink-0"
                size={30}
              />
            </div>
          )}
        </div>
        <div>
          {!mobileMenu ? (
            <MenuIcon
              onClick={() => setMobileMenu((mobileMenu) => !mobileMenu)}
              size={30}
              className={
                "hover:text-[var(--secondary-color)] cursor-pointer transition-colors ease-in-out duration-500 md:hidden"
              }
            />
          ) : (
            <X
              onClick={() => setMobileMenu((mobileMenu) => !mobileMenu)}
              size={30}
              className={
                "text-[var(--secondary-color)] cursor-pointer transition-colors ease-in-out duration-500 md:hidden"
              }
            />
          )}
        </div>
      </div>
      {search && (
        <form className="absolute w-full bottom-[-60px] right-0 px-5 text-[var(--dark-text)] lg:hidden">
          <input
            value={filteredData}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              setFilteredData(event.target.value)
            }
            className="p-3 text-md w-full rounded-md focus:outline focus:outline-[var(--primary-color)] placeholder:text-[var(--dark-secondary-text)]"
            placeholder="Search..."
            autoCorrect="off"
          />
        </form>
      )}
      <div
        className={`absolute w-full lg:hidden  ${
          search ? "flex flex-col" : "hidden"
        }  justify-center items-center px-5 top-44 left-0 `}
      >
        <div className="  overflow-y-auto gap-3 rounded-md flex flex-col  px-4 items-baseline py-3 bg-[var(--light-foreground)] h-[500px] w-full ">
          {storeFilteredData?.map((filterData) => (
            <ProductSearch prop={filterData} key={filterData.id} />
          ))}
        </div>
      </div>
      {mobileMenu && <MobileMenu />}
    </nav>
  );
};

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

export const MobileMenu: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col w-full h-auto top-[120px] fixed z-5 bg-[var(--light-foreground)] left-0 items-center justify-center">
      {navbarItems &&
        navbarItems.map((item, index) => (
          <div
            key={index}
            className=" cursor-pointer border-b border-b-[var(--light-border)] w-full px-5 py-4 hover:bg-[var(--light-border)]"
            onClick={() => navigate(item.url)}
          >
            <p>{item.name}</p>
          </div>
        ))}
      <a
        href="/profile"
        className="w-full px-5 py-4 hover:bg-[var(--light-border)]"
      >
        Profile
      </a>
    </div>
  );
};

export const DesktopSearch = () => {
  const [search, setSearch] = useState<boolean>();
  const [filteredData, setFilteredData] = useState<string>("");
  const [storeFilteredData, setStoreFilteredData] = useState<
    ProductType[] | undefined
  >();
  const { data, loading, error } = UseFetch("/products/all");

  useEffect(() => {
    const filteringData: any = data?.filter((singleProduct) =>
      singleProduct.name.toLowerCase().includes(filteredData?.toLowerCase())
    );
    setStoreFilteredData(filteringData);
  }, [filteredData]);

  return (
    <div
      className={
        "flex relative items-center w-full h-full gap-5 text-sm rounded-lg px-2 transition-all duration-300 py-1 ease-linear  " +
        (search ? " bg-[var(--light-foreground)]" : " ")
      }
    >
      <div
        className={"order-2 cursor-pointer  " + (search ? " order" : " ")}
        onClick={() => setSearch((search) => !search)}
      >
        <Search size={30} />
      </div>
      <form
        className={"items-center  " + (search ? " flex order-2" : " hidden")}
      >
        <input
          value={filteredData}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setFilteredData(event.target.value)
          }
          type="text"
          placeholder="Search..."
          className="px-3 py-2 focus:outline-none rounded-lg max-w-[250px] w-full bg-transparent  "
        />
        <X
          size={20}
          className="cursor-pointer text-[var(--secondary-color)] "
          onClick={() => setSearch((search) => !search)}
        />
      </form>
      <div
        className={`absolute w-full ${
          search ? "flex flex-col" : "hidden"
        }  justify-center items-center top-14 left-0 `}
      >
        <div className="  overflow-y-auto gap-3 rounded-md flex flex-col  px-4 items-baseline py-3 bg-[var(--light-foreground)] h-[500px] w-full ">
          {storeFilteredData?.map((filterData) => (
            <ProductSearch prop={filterData} key={filterData.id} />
          ))}
        </div>
      </div>
    </div>
  );
};
