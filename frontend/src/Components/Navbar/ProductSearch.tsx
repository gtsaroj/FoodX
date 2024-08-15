import { ProductType } from "../../models/productMode";
import React from "react";
import { ShoppingCart } from "lucide-react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../Reducer/Reducer";
import toast from "react-hot-toast";

interface PropType {
  prop: ProductType;
}

const ProductSearch: React.FC<PropType> = ({ prop }: PropType) => {
  const dispatch = useDispatch();
  return (
    <div
      key={prop.id} 
      className=" hover:bg-[#8a849571]  p-1 rounded-md w-full flex justify-between  items-center gap-9 text-[16px] cursor-pointer transition-all hover:text-[var(--primary-color)]"
    >
      <img className="size-14 rounded-md" src={prop.image} alt="" />
      <h1 className="flex justify-start tracking-wider w-full text-[15px]">
        {prop.name}
      </h1>
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
        className=" w-[50px]  h-[40px] border-[var(--dark-border)] flex justify-center items-center p-2 text-[var(--light-text)] text-sm rounded-full bg-[var(--primary-color)]"
      >
        <ShoppingCart className="size-6" />
      </button>
    </div>
  );
};

export default ProductSearch;
