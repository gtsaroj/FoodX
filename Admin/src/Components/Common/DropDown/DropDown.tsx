import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import React, { ReactNode, useState } from "react";
import { Button } from "../components/ui/button";

interface DropDownProp {
  options: string[] | ReactNode;
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
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleSelect = (selectOption: string) => {
    setSelectedOption(selectOption);
    if (selectOption === "Delete") onSelect(value);
    else if (selectOption !== "Delete") onSelect(selectOption);
  };

  return (
    <div className="w-full flex justify-end">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger style={style} className="">
          {children}
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content className="relative bg-[var(--light-background)] w-full  py-3 my-1 px-1 rounded flex flex-col items-start justify-center gap-2">
            {options?.map((item: any, index): any => (
              <button
                key={index}
                onClick={() => handleSelect(item)}
                className="w-full text-[15px] duration-150 px-9 py-2 hover:bg-[var(--light-foreground)] "
              >
                {item}
              </button>
            ))}
            <div className="w-[10px] h-[10px] z-[-1] absolute right-20 top-[-5px]  rotate-45  bg-[var(--light-background)] "></div>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
};
