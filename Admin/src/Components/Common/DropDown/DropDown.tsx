import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import React from "react";

interface DropDownProp {
  options: any;
  children: React.ReactNode;
  style: React.CSSProperties;
  value?: string;
  onSelect?: (selectedOption: string, uid?: string) => void;
}

export const DropDown: React.FC<DropDownProp> = ({
  onSelect,
  options,
  children,
  style,
  value,
}) => {
  // const handleSelect = (selectOption: string) => {

  //   if (!onSelect) return;
  //   if (selectOption === "Delete") onSelect(value as string);
  //   else if (selectOption !== "Delete") onSelect(selectOption);
  // };

  return (
    <div className=" relative w-full">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger style={style} className="">
          {children}
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content className=" border w-full mt-1  p-0.5 rounded flex flex-col items-start justify-center gap-2">
            {options?.map((item: any, index: number): any => (
              <button className="w-full" key={index}>
                {item}
              </button>
            ))}
            {/* <div className="w-[10px] h-[10px] z-[-1] absolute right-20 top-[-5px]  rotate-45  bg-[var(--light-background)] "></div> */}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
};
