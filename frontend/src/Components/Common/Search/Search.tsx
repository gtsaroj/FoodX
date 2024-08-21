import { SearchX, X } from "lucide-react";
import { useState } from "react";

export const Search = () => {
  
  return (
    <div className="  relative">
      <button
        className={`py-2.5 rounded-r-lg duration-150  px-3`}
        onClick={() => setOpen(!open)}
      >
        {open ? <X /> : <SearchX />}
      </button>
      <input
        type="text"
        className={`absolute outline-none   ${
          open
            ? "sm:w-[500px] w-full visible bg-[var(--light-foreground)] opacity-100 "
            : "w-0 invisible opacity-0 "
        } duration-150 top-[72px] left-[-371px] sm:left-[-450px] rounded-lg  py-2.5 px-2`}
      />
      <div className="top-[72px] left-[-450px] w-[500px] absolute "></div>
    </div>
  );
};
