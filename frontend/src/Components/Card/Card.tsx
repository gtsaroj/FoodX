import { ShoppingCart } from "lucide-react";

const Card: React.FC = () => {
  return (
    <div className="flex flex-col bg-[white] w-[225px] rounded-xl gap-2 p-2 shadow-sm">
      <div className="">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/9/91/Pizza-3007395.jpg"
          alt=""
          className="w-[226px] h-[155px] rounded-lg"
        />
      </div>
      <div className="flex justify-between items-center cursor-pointer relative group/cart group/cart:transition-all group/cart:duration-[1s] group/cart:ease-in-out px-2 pt-2">
        <div className="flex justify-between items-center space-x-3  py-[2px]">
          <p className="text-2xl font-bold tracking-wider font-Poppins">
            Pizza
          </p>
          <p className="w-[7px] h-[7px] rounded-full bg-[#1fd71f]"></p>
        </div>
        <div className="flex  justify-baseline items-center gap-[30px] ">
          <p className="text-md text-[var(--dark-secondary-text)] font-Poppins tracking-wide">
            Rs 450
          </p>
        </div>
        <div className="absolute top-0  left-[0px] right-[0px] w-full invisible opacity-0 group-hover/cart:visible group-hover/cart:opacity-100 translate-y-[20px] group-hover/cart:translate-y-0 transition-all duration-150 ease-in-out ">
          <button className=" flex items-center font-Poppins font-[14px]  gap-[10px] text-[white] justify-center   -bg--primary-color py-2 left-[0px] px-[7px] w-full rounded-md">
            Add to cart
            <ShoppingCart className="w-[16px] " />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
