import { Frown } from "lucide-react";
import React from "react";

const NotFound = () => {
  return (
    <div>
      <div className="w-full flex flex-col gap-3 pt-10 items-center justify-center">
        <Frown className="size-20 text-[var(--secondary-color)] " />
        <h3 className=" text-2xl font-[600] tracking-wide text-[var(--dark-text)] ">
          No data to display
        </h3>
      </div>
    </div>
  );
};

export default NotFound;
