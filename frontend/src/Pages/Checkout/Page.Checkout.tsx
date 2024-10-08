import { ChevronRight, ShoppingBag } from "lucide-react";
import React, { FormEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../Store";
import { Product } from "../../models/product.model";
import { Payment } from "../../Components/Payment/Payment.tsx";
import { SingleCard } from "../../Components/Card/Card.Product.Cart.tsx";
import { useNavigate } from "react-router-dom";
import { calculateDiscountedPrice } from "./discount.ts";
import { addToCart } from "../../Reducer/product.reducer.ts";
import toast from "react-hot-toast";

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
  // const [couponCode, setCouponCode] = useState<string>("");
  // const [discount, setDiscount] = useState<number>();

  const products = useSelector((state: RootState) => state.root.cart.products);

  const totalPrice = products?.reduce(
    (acc, product) => acc + product?.price * product.quantity,
    0
  );

  useEffect(() => {
    setInitialData(products);
  }, [products]);
  const dispatch = useDispatch<AppDispatch>();

  // const makeDiscount = async (event: FormEvent) => {
  //   const getDiscountFromSession = sessionStorage.getItem("discount");
  //   const getAmountFromSession = sessionStorage.getItem("products");
  //   if (getDiscountFromSession && getAmountFromSession)
  //     return toast.error("Already Applied");
  //   event.preventDefault();
  //   if (couponCode === "FOODX NEPAL") {
  //     const productsWithDiscount = calculateDiscountedPrice(products, 1);
  //     setDiscount(1);
  //     sessionStorage.setItem("discount", JSON.stringify(1));
  //     sessionStorage.setItem("products", JSON.stringify(productsWithDiscount));
  //   }
  // };

  return (
    <div className="w-full flex flex-col items-start justify-center gap-5 ">
      <h1 className="text-xl font-semibold tracking-wider text-[var(--dark-text)] ">
        Your Items
      </h1>
      <div className="w-full flex flex-col  gap-4 h-[400px] overflow-auto ">
        {initialData?.length > 0 ? (
          initialData?.map((data) => <SingleCard prop={data} key={data.id} />)
        ) : (
          <div className="flex flex-col h-full   py-16 items-center justify-center gap-9">
            <ShoppingBag className=" text-[var(--dark-text)] cursor-pointer size-20" />

            <h1 className="text-[25px] tracking-wider text-[var(--dark-text)] ">
              Your cart is empty
            </h1>
          </div>
        )}
      </div>
      {/* coupon */}
      <div className="flex flex-col w-full p-5  gap-2 rounded-lg bg-[var(--light-background)] ">
        {/* <div className="flex justify-between items-center text-[var(--dark-secondary-text)] ">
          <span className="text-[16px]">Cart Subtotal</span>
          <span className="text-[16px]">Rs. {totalPrice} </span>
        </div>
        <div className="flex justify-between items-center text-[var(--dark-secondary-text)] ">
          <span className="text-[16px]">Tax</span>
          <span className="text-[16px]">Rs. 0</span>
        </div> */}
        {/* <div className="flex justify-between items-center text-[var(--dark-secondary-text)] ">
          <span className="text-[16px]">Discount (Each Product)</span>
          <span className="text-[16px]">Rs. {discount || "0"} </span>
        </div> */}
        {/* <form
          onSubmit={(event: FormEvent) => makeDiscount(event)}
          className="w-full flex p-2 rounded-lg bg-[var(--light-foreground)] border-[1px] border-[var(--dark-border)] "
        >
          <input
            value={couponCode}
            onChange={(event) => setCouponCode(event.target.value)}
            type="text"
            className=" p-1 outline-none rounded-lg w-full px-2  placeholder:text-[15px] font-semibold text-[var(--dark-secondary-text)] bg-[var(--light-foreground)] "
            placeholder="Enter coupon code"
          />
          <button
            disabled={discount ? true : false}
            type="submit"
            className=" border-l-2 border-[var(--dark-border)] pl-5 text-[var(--dark-secondary-text)] text-[16px]  font-semibold tracking-wider "
          >
            {(discount && "Applied") || "Apply"}
          </button>
        </form> */}
        <div className=" text-[17px] font-semibold tracking-wider flex justify-between items-center ">
          <span className="text-[var(--dark-text)] ">Order Total</span>
          <span className="text-[var(--green-bg)] ">Rs. {totalPrice}</span>
        </div>
      </div>
    </div>
  );
};
