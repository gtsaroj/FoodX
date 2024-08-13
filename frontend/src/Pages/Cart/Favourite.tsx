import React from "react";
import { RootState } from "../../Reducer/Store";
import { useSelector } from "react-redux";
import { SingleCard } from "./SingleCard";
import { ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Favourite = () => {
  const selectedProducts = useSelector(
    (state: RootState) => state.root.Products.cart.products
  );

  const navigate = useNavigate();
  const Total = () => {
    let total = 0;
    selectedProducts?.forEach(
      (singleProduct) => (total += singleProduct.price * singleProduct.quantity)
    );
    return total;
  };

  return (
    <div className="flex flex-col  h-[580px] rounded-sm   bg-[var(--light-foreground)] w-[450px]    ">
      <div className="flex flex-col items-start ">
        <h3 className="w-full border-b  text-2xl px-3 py-5 font-semibold tracking-wide text-[var(--dark-text)]">
          My Favourite
        </h3>
      </div>
      <div className="flex px-4 flex-col items-center gap-6 w-full py-5 overflow-y-scroll">
        {selectedProducts.length > 0 ? (
          selectedProducts?.map((singleSelectedProduct) => (
            <SingleCard
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
      <div className="flex flex-col py-3 px-3 border-t w-full gap-5">
        <div className="flex justify-between p-2  text-[var(--dark-text)]">
          <p className="text-lg font-bold tracking-wide">Total Amount:</p>
          <p className="text-lg">
            Rs <span>{Total()}</span>
          </p>
        </div>
        <div
          onClick={() => navigate("/cart/checkout")}
          className="py-3 cursor-pointer rounded-md px-4 w-full flex justify-center items-center bg-[var(--primary-color)] text-center hover:bg-[var(--primary-dark)]  "
        >
          <button className="text-[var(--light-text)] tracking-wider text-xl font-bold">
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Favourite;
