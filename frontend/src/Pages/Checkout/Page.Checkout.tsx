import { ChevronRight } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../Store";
import { Product } from "../../models/product.model";
import { Payment } from "../../Components/Payment/Payment.tsx";
import { SingleCard } from "../../Components/Card/Card.Product.Cart.tsx";
import { useNavigate } from "react-router-dom";

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full flex flex-col gap-8 py-6 px-8   ">
      <div className="flex items-center justify-start gap-1 text-[var(--dark-text)] ">
        <span
          onClick={() => navigate("/cart")}
          className=" font-semibold tracking-wider cursor-pointer "
        >
          Cart
        </span>
        <ChevronRight className="size-5  " />
        <span className="text-[var(--secondary-color)] cursor-pointer font-semibold tracking-wider ">
          Checkout
        </span>
      </div>
      <div className="w-full flex md:flex-row flex-col items-start justify-center gap-10 ">
        <Items />
        <Payment />
      </div>
    </div>
  );
};

export const Items = () => {
  const [initialData, setInitialData] = useState<Product[]>([]);

  const products = useSelector((state: RootState) => state.root.cart.products);

  const totalPrice = products?.reduce(
    (acc, product) => acc + product?.price * product.quantity,
    0
  );

  useEffect(() => {
    setInitialData(products);
  }, [products]);

  return (
    <div className="w-full flex flex-col items-start justify-center gap-5 ">
      <h1 className="text-xl font-semibold tracking-wider text-[var(--dark-text)] ">
        Your Items
      </h1>
      <div className="w-full flex flex-col  gap-4 h-[400px] overflow-auto ">
        {initialData?.map((data) => (
          <SingleCard prop={data} key={data.id} />
        ))}
      </div>
      {/* coupon */}
      <div className="flex flex-col w-full p-5  gap-2 rounded-lg bg-[var(--light-background)] ">
        <div className="flex justify-between items-center text-[var(--dark-secondary-text)] ">
          <span className="text-[16px]">Cart Subtotal</span>
          <span className="text-[16px]">Rs. {totalPrice} </span>
        </div>
        <div className="flex justify-between items-center text-[var(--dark-secondary-text)] ">
          <span className="text-[16px]">Tax</span>
          <span className="text-[16px]">Rs. 0</span>
        </div>
        <div className="flex justify-between items-center text-[var(--dark-secondary-text)] ">
          <span className="text-[16px]">Discount</span>
          <span className="text-[16px]">Rs. 0</span>
        </div>
        <div className="w-full flex p-2 rounded-lg bg-[var(--light-foreground)] border-[1px] border-[var(--dark-border)] ">
          <input
            type="text"
            className=" p-1 outline-none rounded-lg w-full px-2  placeholder:text-[15px] font-semibold text-[var(--dark-secondary-text)] bg-[var(--light-foreground)] "
            placeholder="Enter coupon code"
          />
          <button className=" border-l-2 border-[var(--dark-border)] pl-5 text-[var(--dark-secondary-text)] text-[16px]  font-semibold tracking-wider ">
            Apply
          </button>
        </div>
        <div className=" pt-3 text-[17px] font-semibold tracking-wider flex justify-between items-center ">
          <span className="text-[var(--dark-text)] ">Order Total</span>
          <span className="text-[var(--green-bg)] ">Rs. {totalPrice}</span>
        </div>
      </div>
    </div>
  );
};
