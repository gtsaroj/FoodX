import React from "react";
import { ArrowDownWideNarrow } from "lucide-react";

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
    <button  className="flex rounded py-3 bg-[var(--dark-foreground)] text-[var(--light-text)] items-center justify-center gap-2 px-5">
      <ArrowDownWideNarrow />
      <span>{label ? label : "Filter"}</span>
    </button>
  );
};
