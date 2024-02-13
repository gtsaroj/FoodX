import React from "react";
import { SingleCard } from "./SingleCard";
import { useSelector } from "react-redux";
import { RootState } from "../../Reducer/Store";

const Cart: React.FC = () => {
  return (
    <div className="flex flex-col w-full h-full gap-3">
      <div className="flex flex-col items-start ">
        <h3 className="w-full text-3xl font-semibold tracking-wide text-[var(--dark-text)]">
          My Order
        </h3>
      </div>
      <div className="flex-grow w-full bg-[red]">
        <CartContainer />
      </div>
      <div className="flex flex-col w-full gap-5">
        <div className="flex justify-between p-2  text-[var(--dark-text)]">
          <p className="text-lg font-bold tracking-wide">Total Amount:</p>
          <p className="text-lg">
            Rs <span>450</span>
          </p>
        </div>
        <div className="py-3 cursor-pointer rounded-md px-4 w-full flex justify-center items-center bg-[var(--primary-color)] text-center hover:bg-[var(--primary-dark)]  ">
          <button className="text-[var(--light-text)] tracking-wider text-xl font-bold">Checkout</button>
        </div>
      </div>
    </div>
  );
};

export default Cart;

export const CartContainer: React.FC = () => {
  const product = useSelector((state: RootState) => state.cart.products);
  console.log(product);
  return (
    <div>
      {product?.map((item) => (
        <SingleCard prop={item} key={item.id} />
      ))}
    </div>
  );
};
