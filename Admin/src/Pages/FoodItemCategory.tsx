import { ChevronRight, Search } from "lucide-react";
import React from "react";

const FoodItemCategory: React.FC = () => {
  return (
    <div className=" px-2 w-[230px] h-[100vh] rounded-l-md flex flex-col items-baseline justify-start gap-7 bg-[#8a849585] ">
      <div className="flex items-center py-2 justify-between px-2 gap-5 w-full">
        <h1 className="text-[19px]">Cotent</h1>
        <button>
          <Search className="size-4 hover:text-[white] duration-200 " />
        </button>
      </div> 
      <div className="flex w-full flex-col items-start justify-center gap-4 px-2">
        <div className="flex justify-start  w-full items-center gap-6">
          <h1 className="text-[15px] ">Collection Types</h1>
          <h2 className="text-[17px] ">2</h2>
        </div>
        <ul className="flex flex-col items-start container gap-2 ">
          <li className="w-full flex  text-[15px] hover:bg-[#8a8495ab] py-1 px-5 rounded-md duration-200 items-center justify-start  gap-3 cursor-pointer ">
             <ChevronRight size={15}/>
            Foods</li>
          <li className="w-full flex text-[15px] hover:bg-[#8a8495ab] py-1 px-5 rounded-md duration-200 items-center justify-start gap-3 cursor-pointer">
            <ChevronRight size={15} />
            Banners</li>
        </ul>
      </div>
    </div>
  );
};

export default FoodItemCategory;
