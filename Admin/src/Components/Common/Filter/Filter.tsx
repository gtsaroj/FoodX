import React from "react";
import { Filter } from "lucide-react";

interface FilterButtonProp {
  label?: string;
  isActive: string;
  onClick?: (label: string) => void;
}

export const FilterButton: React.FC<FilterButtonProp> = ({
  isActive,
  label,
  onClick,
}) => {
  return (
    <button className="flex  text-[15px] rounded py-2 bg-[var(--dark-foreground)] text-red-50 items-center justify-center gap-2 px-4">
      <Filter className="size-4" />
      <span>{label ? label : "Filter"}</span>
    </button>
  );
};
