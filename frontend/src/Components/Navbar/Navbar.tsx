import { useState } from "react";
import CollegeLogo from "/logo/texas.png";
import { MenuIcon, Phone, Search, UserCircleIcon, X } from "lucide-react";
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

  return (
    <nav className="w-full min-w-[100vw] h-[100px] flex justify-between items-center px-5  text-[var(--dark-secondary-text)] relative">
      {/* Logo */}
      <div className="flex items-center h-full overflow-hidden shrink-0">
        <img
          src={CollegeLogo}
          alt="college logo"
          className="max-h-[80px] h-full p-2 "
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
      <div className="h-full flex items-center space-x-4 text-[var(--dark-text)] px-3">
        <div className="flex items-center justify-center h-full space-x-5">
          <Search
            onClick={() => setSearch((search) => !search)}
            size={50}
            className="p-2 cursor-pointer hover:text-[var(--secondary-color)] transition-colors duration-500 ease-in-out "
          />
          <UserCircleIcon
            className="hidden p-2 transition-colors duration-500 ease-in-out md:flex hover:text-[var(--secondary-color)] cursor-pointer"
            size={50}
          />
        </div>
        <div>
          {!mobileMenu ? (
            <MenuIcon
              onClick={() => setMobileMenu((mobileMenu) => !mobileMenu)}
              size={40}
              className={
                "hover:text-[var(--secondary-color)] cursor-pointer transition-colors ease-in-out duration-500 md:hidden"
              }
            />
          ) : (
            <X
              onClick={() => setMobileMenu((mobileMenu) => !mobileMenu)}
              size={40}
              className={
                "hover:text-[var(--secondary-color)] cursor-pointer transition-colors ease-in-out duration-500 md:hidden"
              }
            />
          )}
        </div>
      </div>
      {search && (
        <form className="absolute bottom-[-60px] right-5 text-[var(--dark-text)]">
          <input
            className="p-3 text-md rounded-md focus:outline focus:outline-[var(--primary-color)] placeholder:text-[var(--dark-secondary-text)]"
            placeholder="Search..."
            autoCorrect="off"
          />
        </form>
      )}
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
  return (
    <div className="flex flex-col w-full h-auto top-[120px] fixed z-5 bg-[var(--light-foreground)] left-0 items-center justify-center">
      {navbarItems &&
        navbarItems.map((item, index) => (
          <a
            href={item.url}
            key={index}
            className="border-b border-b-[var(--light-border)] w-full px-5 py-4 hover:bg-[var(--light-border)]"
          >
            <p>{item.name}</p>
          </a>
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
