import { ChevronDown } from "lucide-react";
import React, { useState } from "react";
import { categoriesTagOption } from "../../Category/MenuType";

interface SelectorPop {
  action: (value: string) => void;
  children?: categoriesTagOption[];
}

export const Selector: React.FC<SelectorPop> = ({ action, children }) => {
  const [show, setShow] = useState<boolean>(false);
  const [showField, setShowField] = useState<string>("Burger");
  return (
    <div className="w-[350px] rounded-t-xl relative group/selector py-1 gap-2 border-[1px] rounded px-2 bg-[var(--light-foreground)]">
      <div
        onClick={() => setShow(!show)}
        className="flex items-center  justify-between"
      >
        <input
          type="text"
          className="w-full bg-[var(--light-foreground)] py-2.5 tracking-wider  outline-none cursor-pointer "
          readOnly
          value={showField}
          placeholder="Select option"
        />
        <ChevronDown className="text-[var(--dark-text)] cursor-pointer " />
      </div>
      <div
        className={` bg-[var(--light-foreground)] rounded-t-sm p-1 overflow-auto left-0 top-[57px] z-[1000] shadow shadow-[#0000003a] rounded-b-lg absolute flex flex-col  gap-1 w-full transition-all duration-300  ${
          show
            ? "max-h-64 z-[100] opacity-100"
            : "max-h-0 opacity-0 z-0 transform -translate-y-2"
        }`}
      >
        {children?.map((option) => (
          <div
            onClick={() => {
              action(option?.name);
              setShowField(option?.name);
              setShow(false);
            }}
            key={option.id}
            className="flex cursor-pointer items-center hover:bg-slate-100 py-1.5 px-1.5 rounded-lg justify-start gap-3"
          >
            <img
              className="w-[40px] rounded-full h-[40px]"
              src={option.image}
              alt=""
            />
            <p className="text-[var(--dark-text)] text-start text-[16px] tracking-wider w-full rounded">
              {option.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
