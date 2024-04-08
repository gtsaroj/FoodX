import React from "react";
import { SingleCard } from "./SingleCard";
import { useSelector } from "react-redux";
import { RootState } from "../../Reducer/Store";
import { ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Cart: React.FC = () => {
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
    // Desktop
    <div className="flex flex-col w-full h-[580px] gap-3   sm:px-1 px-[30px]">
      <div className="flex flex-col items-start ">
        <h3 className="w-full text-3xl font-semibold tracking-wide text-[var(--dark-text)]">
          My Cart
        </h3>
      </div>
      <div className="flex flex-col items-center gap-2 w-full py-5 overflow-y-scroll">
        {selectedProducts.length > 0 ? (
          selectedProducts?.map((singleSelectedProduct) => (
            <SingleCard
              prop={singleSelectedProduct}
              key={singleSelectedProduct.id}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center gap-2">
            <ShoppingBag className=" cursor-pointer size-16" />

            <h1 className="text-[25px]">Your cart is empty</h1>
          </div>
        )}
      </div>
      <div className="flex flex-col w-full gap-5">
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

export default Cart;
