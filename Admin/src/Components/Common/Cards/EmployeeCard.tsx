import { Mail, Phone } from "lucide-react";
import React from "react";

export const EmployeeCard: React.FC = () => {
  return (
    <div className="flex flex-col w-[340px] min-w-[300px] sm:w-[310px]  bg-[var(--light-background)] p-4 rounded-xl items-c justify-center gap-3 ">
      <div className="flex flex-col  items-center p-3 justify-center gap-3">
        <div className="w-[80px] h-[80px] rounded-full">
          <img
            className="w-full h-full rounded-full "
            src="https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg"
            alt=""
          />
        </div>
        <div className="flex flex-col items-start justify-center gap-0.5">
          <h1 className="text-[15px] font-[600] contrast-100 ">Rohit Sharma</h1>
          <p className=" text-[13px] contrast-100  brightness-100 text-[var(--dark-secondary-text)] ">
            Project Manager
          </p>
        </div>
      </div>

      <div className="w-full gap-2 flex items-center justify-evenly">
        <button
          className="flex duration-200  hover:bg-[var(--primary-dark)] text-[var(--light-text)] contrast-150 py-2 rounded bg-[var(--primary-color)] w-1/2
                   items-center justify-center gap-1 text-sm"
        >
          <a href={`tel:9825506216`}>
            <Phone className="contrast-[0.6] " />
          </a>
        </button>
        <button
          className="flex  duration-200 hover:bg-[var(--secondary-dark)] text-[var(--light-text)] contrast-150 w-1/2 py-2 rounded bg-[var(--secondary-color)]
                   items-center justify-center gap-1 text-sm "
        >
          <a href={`mailto:sarojgt326@gmail.com `}>
            <Mail className="contrast-[0.6] " />
          </a>
        </button>
      </div>
    </div>
  );
};
