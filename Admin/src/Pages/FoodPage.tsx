import {
  ArrowDownWideNarrow,
  ChevronLeft,
  Plus,
  Search,
} from "lucide-react";
import React, { useState } from "react";
import FoodTable from "./FoodTable";
import UploadFood from "./UploadFood";

const FoodPage: React.FC = () => {
  const [createNewEntries, setCreateNewEntries] = useState<boolean>(false);
  return (
    <div className="w-full relative py-4 flex flex-col gap-10 px-4 items-start justify-center ">
      <button className="flex items-center justify-start hover:gap-2 duration-200 gap-1">
        <ChevronLeft size={18} />
        <h1 className=" text-[18px]">Back</h1>
      </button>
      <div className="flex items-center justify-between w-full">
        <div className="flex flex-col items-start justify-center gap-1">
          <h1 className="text-lg">Foods</h1>
          <h2 className="text-[14px] text-[var(--dark-secondary-text)] ">
            6 entries found
          </h2>
        </div>
        <button
          onClick={() => setCreateNewEntries(!createNewEntries)}
          className="flex shadow-inner items-center gap-2 justify-center bg-[var(--primary-color)] text-[var(--light-foreground)] py-2 border-[1px] border-[var(--primary-color)] px-5 rounded-sm "
        >
          <Plus className="size-5" />
          <h1 className="text-[15px]">Create New Entries</h1>
        </button>
      </div>
      <div className="flex items-start justify-between w-full gap-5 ">
        <form action="" className="relative">
          <Search className="absolute top-4 size-5 left-2" />
          <input
            type="search"
            className=" pl-9 placeholder:text-sm outline-none w-[350px] rounded-md py-4 px-8 border-[var(--dark-border)] "
            placeholder="Search for orderID, customer, orderstatus or something"
          />
        </form>
        <button className="flex gap-1 text-[var(--light-text)] bg-[var(--dark-text)] px-5 py-1.5 rounded-md items-center justify-center">
          <ArrowDownWideNarrow className="size-4" />
          <span className="text-[14px] ">Filter</span>
        </button>
      </div>
      <FoodTable />
      <div className="absolute ">
      {
        createNewEntries && <UploadFood/>
      }
   </div>
    </div>
  );
};

export default FoodPage;
