import {  ChevronLeft, Plus, Search, SlidersHorizontal } from "lucide-react";
import React from "react";
import FoodTable from "./FoodTable";

const FoodPage : React.FC = () => {
  return (
    <div className="w-full flex flex-col gap-10 px-4 items-start justify-center py-5 ">
      <button className="flex items-center justify-start hover:gap-2 duration-200 gap-1">
        <ChevronLeft size={18} />
        <h1 className=" text-[18px]">Back</h1>
      </button>
      <div className="flex items-center justify-between w-full">
        <div className="flex flex-col items-start justify-center gap-1">
          <h1>Foods</h1>
          <h2>6 entries found</h2>
        </div>
        <button className="flex items-center gap-2 justify-center bg-[var(--primary-color)] text-[var(--light-foreground)] py-2 border-[1px] border-[var(--primary-color)] px-5 rounded-sm ">
          <Plus className="size-5" />
          <h1 className="text-[15px]">Create New Entries</h1>
        </button>
      </div>
      <div className="flex items-start justify-center gap-5 ">
        <button className=" border-[1px] h-[35px] border-[var(--dark-foreground)] p-1 rounded-sm  ">
          <Search className="size-5 " />
        </button>
        <button className="border-[1px] h-[35px] border-[var(--dark-foreground)]  p-1 rounded-sm flex items-center gap-2 justify-center ">
          <SlidersHorizontal className="size-4" />
          <h1 className="text-[17px] ">Filter</h1>
        </button>
      </div>
      <FoodTable/>
    </div>
  );
};

export default FoodPage;
