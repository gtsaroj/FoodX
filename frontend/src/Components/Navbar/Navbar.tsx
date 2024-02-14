import { useState } from "react";
import CollegeLogo from "/logo/texas.png";
import { MenuIcon, Phone, UserCircleIcon } from "lucide-react";
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

  return (
    <div className="w-full min-w-[100vw] h-[120px] flex justify-between items-center px-5  text-[var(--dark-secondary-text)]">
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
                "h-full px-5 py-4 hover:bg-[var(--primary-color)] hover:text-[var(--secondary-color)] hover:font-bold w-[100px] " +
                (activeNav === index
                  ? " font-bold text-[var(--secondary-color)] "
                  : " ")
              }
            >
              <p className="flex items-center justify-center h-full text-lg tracking-wider">
                {item.name}
              </p>
            </a>
          ))}
      </div>
      {/*  */}
      <div className="h-full flex items-center space-x-8 text-[var(--dark-text)] px-3">
        <div>
          <MenuIcon
            size={40}
            className="hover:text-[var(--secondary-color)] cursor-pointer transition-colors ease-in-out duration-500 md:hidden"
          />
        </div>
        <div className="items-center justify-center hidden h-full md:flex">
          <UserCircleIcon className="" size={50} />
        </div>
        <div className="items-center hidden h-full space-x-3 lg:flex">
          <Phone className="text-[var(--secondary-color)]" size={25} />
          <p className="text-xs text-[var(--dark-secondary-text)] ">
            01-4589134, 01-4588627,9801644462
          </p>
        </div>
      </div>
    </div>
  );
};


export const MenuBar: React.FC = () => {
  return (
    <div>
      <div></div>
    </div>
  )
}