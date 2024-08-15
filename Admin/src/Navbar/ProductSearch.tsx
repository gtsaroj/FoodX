
import React from "react";
import { ShoppingCart } from "lucide-react";
import { useDispatch } from "react-redux";

import toast from "react-hot-toast";
import { ProductType } from "../models/productMode";
import { addToCart } from "../Reducer/Reducer";

interface PropType {
  prop: ProductType;
}

const ProductSearch: React.FC<PropType> = ({ prop }: PropType) => {
  const dispatch = useDispatch();
  return (
    <div
      key={prop.id}
      className=" hover:bg-[#8a849571] p-1 rounded-md w-full flex justify-between  items-center gap-9 text-[16px] cursor-pointer transition-all hover:text-[var(--primary-color)]"
    >
      <img className="size-11 rounded-md" src={prop.image} alt="" />
      <h1 className="flex justify-start w-full text-[14px]">{prop.name}</h1>
      <button
        onClick={() => {
          const Cartadd: any = dispatch(
            addToCart({
              id: prop.id,
              name: prop.name,
              image: prop.image,
              price: prop.price,
              quantity: 1,
            })
          );

          if (!Cartadd) {
            return toast.error("Your product not added.");
          }
          toast.success("Your product is added.");
        }}
        className=" w-[50px] h-[50px] flex justify-center rounded-full items-center px-4 py-1 text-[var(--light-text)] text-sm bg-[var(--primary-color)]"
      >
        <ShoppingCart className="size-5" />
      </button>
    </div>
  );
};

export default ProductSearch;
