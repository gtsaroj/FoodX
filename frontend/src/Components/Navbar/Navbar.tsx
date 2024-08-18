import { useCallback, useEffect, useRef, useState } from "react";
import CollegeLogo from "../../assets/logo/texas.png";
import {
  Heart,
  Phone,
  ShoppingBag,
  UserCircleIcon,
} from "lucide-react";
import { useSelector } from "react-redux";
import { UseFetch } from "../../UseFetch";
import { ProductType } from "../../models/product.model";
import { Link, useNavigate } from "react-router-dom";
import { RootState } from "../../Store";
import Favourite from "../../Pages/Cart/Favourite";
import { debounce } from "../../Utility/Debounce";
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
  const [initialData, setInitialData] = useState<ProductType[]>([]);
  const [openProfile, setOpenProfile] = useState<boolean>(false);
  const [openFavourite, setOpenFavourite] = useState<boolean>(false);

  const { data, loading, error } = UseFetch("/products/all");
  const { data: specialProducts } = UseFetch("/products/specials");
  const authUser = useSelector((state: RootState) => state.root.auth.userInfo);

  const FilterRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement | null>(null);
  const favouriteReference = useRef<HTMLDivElement>();

  const searchModel = (value: string) => {
    if (value.length > 0) {
      setLoader(true);
    }
    if (!value) throw new Error("input value not found" + error);

    const filteringData = initialData?.filter((singleProduct) =>
      singleProduct.name.toLowerCase().includes(value.toLowerCase())
    );
    setStoreFilteredData(filteringData as ProductType[]);
  };
  const debouncedDataModel = useCallback(debounce(searchModel, 500), []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (FilterRef.current?.contains(event.target as Node)) {
        setCloseFilter(false);
      } else if (!FilterRef.current?.contains(event.target as Node)) {
        setCloseFilter(true);
      }
    };
    const closeModal = (event: MouseEvent) => {
      if (
        favouriteReference.current &&
        !favouriteReference.current.contains(event.target as any)
      ) {
        setOpenFavourite(false);
      }
    };

    const closeProfile = (event: MouseEvent) => {
      if (!profileRef?.current?.contains(event.target as Node)) {
        setOpenProfile(false);
      }
    };

    document.addEventListener("mousedown", closeProfile);
    document.addEventListener("mousedown", handleClickOutside);
    if (openFavourite) {
      document.addEventListener("mousedown", closeModal);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openProfile, debouncedDataModel, data, specialProducts]);
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
            className="flex items-center justify-center md:hidden"
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
                openFavourite
                  ? "visible z-10 translate-y-0 opacity-100 "
                  : "-translate-y-2 invisible opacity-0 z-[-100]"
              } `}
            >
              <Favourite />
            </div>
          </div>
          {authUser?.avatar ? (
            <div
              ref={profileRef}
              onClick={() => setOpenProfile(!openProfile)}
              className=" hover:bg-[#8080807c] p-1 rounded-full cursor-pointer group/user"
            >
              <img
                className="rounded-full sm:size-9 size-8"
                src={authUser.avatar}
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
      </div>
      {/* {mobileMenu && <MobileMenu />} */}
      <div
        ref={profileRef}
        className={`absolute right-5 top-20 flex w-full justify-end items-center ${
          openProfile ? "flex" : "hidden"
        }`}
      ></div>
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
