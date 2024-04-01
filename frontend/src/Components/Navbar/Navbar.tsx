import { ChangeEvent, useEffect, useRef, useState } from "react";
import CollegeLogo from "../../logo/texas.png";
import {
  ChevronDown,
  MenuIcon,
  Phone,
  Search,
  UserCircleIcon,
  X,
} from "lucide-react";
import { useSelector } from "react-redux";
import { UseFetch } from "../../UseFetch";
import { ProductType } from "../../models/productMode";
import { Link, useNavigate } from "react-router-dom";
import { RootState } from "../../Reducer/Store";
import ProductSearch from "./ProductSearch";
import { Frown, Smile } from "lucide-react";
import Profile from "../AuthProfile/Profile";
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
  const [search, setSearch] = useState<boolean>(false);
  const [mobileMenu, setMobileMenu] = useState<boolean>(false);
  const [filteredData, setFilteredData] = useState<string>("");
  const [storeFilteredData, setStoreFilteredData] = useState<ProductType[]>([]);
  const [closeFilter, setCloseFilter] = useState(false);
  const [openProfile, setOpenProfile] = useState<boolean>(false);

  const { data, loading, error } = UseFetch("/products/all");
  const userImage = useSelector((state: RootState) => state.root.auth.userInfo);

  const FilterRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const filteringData: any = data?.filter((singleProduct) =>
      singleProduct.name.toLowerCase().includes(filteredData?.toLowerCase())
    );
    setStoreFilteredData(filteringData);

    const handleClickOutside = (event: MouseEvent) => {
      if (FilterRef.current?.contains(event.target as Node)) {
        setCloseFilter(false);
      } else if (!FilterRef.current?.contains(event.target as Node)) {
        setCloseFilter(true);
      }
    };
    

    const closeProfile = (event: MouseEvent) => {
      if (!profileRef?.current?.contains(event.target as Node)) {
        setOpenProfile(false);
      }
    };

    document.addEventListener("mousedown", closeProfile);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (closeFilter) {
        document.removeEventListener("mousedown", closeProfile);
      }
    };
  }, [filteredData, closeFilter, openProfile]);
  const navigate = useNavigate()

  return (
    <nav
      ref={FilterRef}
      className="w-full min-w-[100vw] h-[100px] flex justify-between items-center px-5 gap-5 text-[var(--dark-secondary-text)] relative"
    >
      {/* Logo */}
      <div className="flex cursor-pointer items-center shrink-0 " onClick={()=>navigate("/")}>
        <img
          src={CollegeLogo}
          alt="college logo"
          className="max-h-[80px]  w-[160px]  sm:w-full h-full p-2  "
        />
      </div>
      {/*  */}
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
      {/*  */}
      <div className="h-full gap-2  flex items-center text-[var(--dark-text)] px-3">
        <div className="flex items-center justify-center h-full space-x-3 place-items-center">
          <div className="flex items-center justify-center shrink-0">
            <Search
              onClick={() => setSearch((search) => !search)}
              size={30}
              className=" cursor-pointer hover:text-[var(--secondary-color)] transition-colors duration-500 ease-in-out lg:hidden "
            />
          </div>
          <div className="hidden lg:flex" ref={FilterRef}>
            <DesktopSearch />
          </div>
          {userImage?.avatar ? (
            <div
              onClick={() => setOpenProfile(!openProfile)}
              className=" hover:bg-[#8080807c] p-2 rounded-full cursor-pointer group/user"
            >
              <img
                className=" size-7 rounded-full"
                src={userImage.avatar}
                alt=""
              />
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
        <form className="absolute flex  w-full bottom-[-60px] right-0 px-5 text-[var(--dark-text)] lg:hidden">
          <input
            value={filteredData}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              setFilteredData(event.target.value)
            }
            className="p-3 text-md w-full rounded-md focus:outline focus:outline-[var(--primary-color)] placeholder:text-[var(--dark-secondary-text)]"
            placeholder="Search..."
            autoCorrect="off"
          />
           <X
          size={20}
          className=" top-4 right-10 absolute cursor-pointer text-[var(--secondary-color)] "
          onClick={() => setSearch((search) => !search)}
        />
        </form>
      )}
      <div
        className={`absolute w-full lg:hidden  ${
          search ? "flex flex-col" : "hidden"
        }  ${
          closeFilter ? "hidden" : "flex"
        } justify-center items-center px-5 top-44 left-0 `}
      >
        <div className="  overflow-y-auto gap-3 rounded-md flex flex-col  px-4 items-baseline py-3 bg-[var(--light-foreground)] h-[500px] w-full ">
          {filteredData.length <= 0 ? (
            <div className="flex gap-3 w-full py-20 flex-col-reverse justify-center items-center">
              Find Your Products
              <Smile className="size-16 text-[var(--primary-color)]" />
            </div>
          ) : storeFilteredData?.length <= 0 ? (
            <div className="flex gap-3 w-full py-20 flex-col-reverse justify-center items-center">
              Your Product Not Found
              <Frown className="size-16 text-[var(--primary-color)]" />
            </div>
          ) : (
            storeFilteredData?.map((filterData) => (
              <ProductSearch prop={filterData} key={filterData.id} />
            ))
          )}
        </div>
      </div>
      {mobileMenu && <MobileMenu />}
      <div
        ref={profileRef}
        className={`absolute right-5 top-20 flex w-full justify-end items-center ${
          openProfile ? "flex" : "hidden"
        }`}
      >
        {userImage && <Profile user={userImage} />}
      </div>
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
  const [storeFilteredData, setStoreFilteredData] = useState<ProductType[]>([]);
  const { data, loading, error } = UseFetch("/products/all");
  const { data: specials } = UseFetch("/products/specials");
  const [closeFilter, setCloseFilter] = useState<boolean>(false);

  const TotalData = [...(data || []), ...(specials || [])];

  const FilterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const filteringData: any = data?.filter((singleProduct) =>
      singleProduct.name.toLowerCase().includes(filteredData?.toLowerCase())
    );
    setStoreFilteredData(filteringData);

    const handleClickOutside = (event: MouseEvent) => {
      if (FilterRef.current?.contains(event.target as Node)) {
        setCloseFilter(false);
      } else if (!FilterRef.current?.contains(event.target as Node)) {
        setCloseFilter(true);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [filteredData, closeFilter]);

  return (
    <div
      ref={FilterRef}
      className={
        " flex relative items-center w-full h-full gap-5 text-sm rounded-lg px-2 transition-all duration-300 py-1 ease-linear  " +
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
        className={
          `absolute w-full ${
            search ? "flex flex-col" : "hidden"
          }  justify-center items-center top-14 left-0 ` +
          (closeFilter ? "hidden" : "flex")
        }
      >
        <div className="  overflow-y-auto gap-3 rounded-md flex flex-col  px-4 items-baseline py-3 bg-[var(--light-foreground)] h-[500px] w-full ">
          {filteredData.length <= 0 ? (
            <div className="flex gap-3 w-full py-20 flex-col-reverse justify-center items-center">
              Find Your Products
              <Smile className="size-16 text-[var(--primary-color)]" />
            </div>
          ) : storeFilteredData?.length <= 0 ? (
            <div className="flex gap-3 w-full py-20 flex-col-reverse justify-center items-center">
              Your Product Not Found
              <Frown className="size-16 text-[var(--primary-color)]" />
            </div>
          ) : (
            storeFilteredData?.map((filterData) => (
              <ProductSearch prop={filterData} key={filterData.id} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};
