import { LogOut } from "lucide-react";
import React from "react";

interface LogoutProp {
  logout: () => void;
}

const Logout: React.FC<LogoutProp> = ({ logout }) => {
  return (
    <React.Fragment>
      <button
        onClick={() => logout()}
        className="w-full flex items-center justify-start gap-5 py-3 px-3 hover:dark:text-[var(--light-text)] text-[var(--dark-text)] rounded dark:hover:bg-[#9ca3af]  hover:bg-[#e8e8e8]"
      >
        <LogOut className="size-5" />
        <span className="text-[15px]">Logout</span>
      </button>
    </React.Fragment>
  );
};

export default Logout;
