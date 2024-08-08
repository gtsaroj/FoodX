import React, { useState } from "react";

interface ButtonProp {
  parentStyle?: React.CSSProperties;
  bodyStyle?: React.CSSProperties;
  parent: React.ReactNode;
  children: React.ReactNode[] | string[];
  onSelect?: (value: string) => void;
}

export const Button: React.FC<ButtonProp> = ({
  children,
  onSelect,
  parent,
  bodyStyle,
}) => {
  const [show, setShow] = useState<boolean>(false);
  const [index, setIndex] = useState<number>();
  return (
    <div className="relative  w-full">
      <div
        className=" cursor-pointer flex justify-end"
        onClick={() => setShow(!show)}
      >
        {parent}
      </div>
      <div
        style={bodyStyle}
        className={`flex  p-1  z-[100]  duration-100 absolute ${
          show
            ? "visible translate-y-0 opacity-100 "
            : "invisible -translate-y-2 opacity-0 "
        } flex-col shadow-sm w-full  shadow-[#0000002c] items-start justify-center gap-1 bg-[var(--light-foreground)]  rounded `}
      >
        {children?.map((child, key) =>
          typeof child === "string" ? (
            <button
              className={`w-full 150 hover:bg-gray-100 rounded tracking-wider text-[16px] hover:text-black  duration-150 text-[var(--dark-text)] `}
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
            w-full rounded duration-150 hover:bg-gray-100 tracking-wider text-[16px] hover:text-black   text-[var(--dark-text)]
                                 `}
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
