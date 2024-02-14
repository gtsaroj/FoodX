import React from "react";
import { Star, MapPin, ShoppingCart } from "lucide-react";

const Card = () => {
  return (
    <div className="flex flex-col bg-[white] w-[226px]  rounded-xl gap-[6px] p-[8px]">
      <div className="">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/9/91/Pizza-3007395.jpg"
          alt=""
          className="w-[226px] h-[155px] rounded-xl"
        />
      </div>
      <div className="flex justify-between items-center cursor-pointer relative group/cart group/cart:transition-all group/cart:duration-[1s] group/cart:ease-in-out px-[5px]">
        <div className="flex justify-between  items-center gap-[5px]  py-[2px]">
          <h3 className="text-2xl font-bold font-Poppins">Pizza</h3>
          <h3 className="w-[7px] h-[7px] rounded-full bg-[green]"></h3>
        </div>
        <div className="flex  justify-baseline items-center gap-[30px] ">
          <h3 className=" text-lg  font-Poppins font-semibold ">Rs 450</h3>
        </div>
        <div className="absolute top-0  left-[0px] right-[0px] w-full invisible opacity-0 group-hover/cart:visible group-hover/cart:opacity-100 translate-y-[20px] group-hover/cart:translate-y-0 transition-all duration-150 ease-in-out">
          <button className=" flex items-center font-Poppins font-[14px]  gap-[10px] text-[white] justify-center  -bg--primary-color py-[3px] left-[0px] px-[7px] w-full rounded-sm">
            add to cart
            <ShoppingCart className="w-[16px] " />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
