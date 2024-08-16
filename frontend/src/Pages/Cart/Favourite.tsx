import React from "react";
import { AppDispatch, RootState } from "../../Reducer/Store";
import { useDispatch, useSelector } from "react-redux";
import { SingleCard } from "./SingleCard";
import { ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../../Reducer/Reducer";
import toast from "react-hot-toast";
import { FavouriteCard } from "./FavouriteCard";

const Favourite: React.FC = () => {
  const selectedProducts = useSelector(
    (state: RootState) => state.root.favourite.favourite
  );

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div className="flex flex-col  h-[580px]   rounded-sm  pb-7 justify-between    bg-[var(--light-foreground)] w-[450px]    ">
      <div className="flex flex-col items-start ">
        <h3 className="w-full border-b  text-2xl px-3 py-5 font-semibold tracking-wide text-[var(--dark-text)]">
          My Favourite
        </h3>
      </div>
      <div className="flex h-full px-4 flex-col duration-500 items-center gap-6 w-full py-5 overflow-y-scroll">
        {selectedProducts.length > 0 ? (
          selectedProducts?.map((singleSelectedProduct) => (
            <FavouriteCard
              prop={singleSelectedProduct}
              key={singleSelectedProduct.id}
            />
          ))
        ) : (
          <div className="flex flex-col items-center py-16 justify-center gap-2">
            <ShoppingBag className=" cursor-pointer size-16" />

            <h1 className="text-[25px]">Your cart is empty</h1>
          </div>
        )}
      </div>

      <div className="flex flex-col  py-3 px-3  w-full gap-5">
        <div className="py-3 cursor-pointer rounded-md px-4 w-full flex justify-center items-center bg-[var(--primary-color)] text-center hover:bg-[var(--primary-dark)]  ">
          <button
            onClick={() => {
              selectedProducts?.forEach((product) => {
                dispatch(addToCart(product));
              });
              toast.success("Succesfully added!");
            }}
            className="text-[var(--light-text)] tracking-wider text-xl font-bold"
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Favourite;
