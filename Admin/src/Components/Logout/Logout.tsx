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
        className="w-full flex items-center justify-start gap-5 py-1 px-3 text-[var(--dark-text)] rounded-md hover:bg-[#8a849577]"
      >
        <LogOut className="size-5" />
        <span className="text-[15px]">Logout</span>
      </button>
    </React.Fragment>
  );
};

export default Logout;
