import React, { useState } from "react";

interface ButtonProp {
  parent: React.ReactNode;
  children: React.ReactNode[] | string[];
  onSelect: (value: string) => void;
}

export const Button: React.FC<ButtonProp> = ({
  children,
  onSelect,
  parent,
}) => {
  const [show, setShow] = useState<boolean>(false);
  const [index, setIndex] = useState<number>();
  return (
    <div className="relative  w-full">
      <div
        className="w-[150px] flex justify-end"
        onClick={() => setShow(!show)}
      >
        {parent}
      </div>
      <div
        className={`flex  top-12 z-[100]  duration-100 absolute ${
          show ? "visible translate-x-0 " : "invisible -translate-y-2"
        } flex-col shadow-sm w-full p-2 shadow-[#00000067] items-start justify-center gap-1 bg-[var(--light-foreground)]  rounded-lg  `}
      >
        {children?.map((child, key) =>
          typeof child === "string" ? (
            <button
              className={`w-full rounded tracking-wider text-[16px] hover:text-black  duration-150 text-[var(--dark-text)] p-1.5 ${
                index === key ? "bg-slate-300 " : "bg-[#00000000]"
              } `}
              onClick={() => {
                setIndex(key as number);
                if (!onSelect) return;
                onSelect(child);
              }}
            >
              {child}
            </button>
          ) : React.isValidElement(child) ? (
            <button
              onClick={() => {
                setIndex(key);
              }}
              className={`
            w-full rounded tracking-wider text-[16px] hover:text-black  duration-150 text-[var(--dark-text)]
                                p-1.5 ${
                                  index === key
                                    ? "bg-slate-300 "
                                    : "bg-[#00000000]"
                                } `}
            >
              {child}{" "}
            </button>
          ) : (
            ""
          )
        )}
      </div>
    </div>
  );
};
