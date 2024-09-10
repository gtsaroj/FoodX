import React, { FormEvent, useEffect, useState } from "react";
import { Frown, Minus, Plus, ShoppingBag, ShoppingCart } from "lucide-react";
import { SingleCard } from "../Card/Card.Product.Cart";
import { useNavigate } from "react-router-dom";
import { order } from "../../Services/order.services";
import { Product } from "../../models/product.model";
import toast from "react-hot-toast";
import Cart from "../../Pages/Cart/Cart";
import { SpecialCards } from "../Card/Card.Product";
import { UseFetch } from "../../UseFetch";
import { addToCart } from "../../Reducer/product.reducer";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { getSpecialProducts } from "../../Services/product.services";
import { RecentProduct } from "../Card/Card.Recent.Product";
import { RootState } from "../../Store";
import { useSelector } from "react-redux";
import { addRevenue } from "../../Services/revenue.services";
import dayjs from "dayjs";

interface CartProp {
  prop: Product;
}

export const Payment: React.FC = () => {
  const selectedProduct = useSelector(
    (state: RootState) => state.root.cart.products
  );

  const navigate = useNavigate();
  const Total = () => {
    let total = 0;
    selectedProduct?.forEach(
      (singleProduct) => (total += singleProduct.price * singleProduct.quantity)
    );
    return total;
  };

  // fetch products
  const products = useSelector((state: RootState) => state.root.cart.products);
  const userId = useSelector(
    (state: RootState) => state.root.auth.userInfo.uid
  );

  const handleOrder = async (event: FormEvent) => {
    event.preventDefault();
    const toasLoader = toast.loading("Processing your order...");
    const today = new Date();
    try {
      await order({
        products: products,
        uid: userId as string,
        orderRequest: today,
        orderFullFilled: "",
        status: "Pending",
        note: "Ordered",
      });
      await addRevenue({
        id: dayjs().format("YYYY-MM-DD"),
        orders: products,
      });
      toast.dismiss(toasLoader);
      toast.success("Order sent successfully! ");
    } catch (error) {
      toast.dismiss(toasLoader);
      toast.error("Order failed. Please try again.");
      throw new Error("Error while ordering food " + error);
    }
  };

  return (
    <div className=" flex flex-col items-baseline justify-between py-6 w-full gap-20 sm:px-[30px] px-[5px]">
      {/* <MobileCart/> */}
      <div className="flex gap-[20px] flex-col md:flex-row items-stretch justify-center w-full md:px-[50px] sm:px-[40px] px-[0px] ">
        {/* my cart */}
        <div className="py-[19px] px-[10px] w-full rounded-lg   h-[500px]   flex flex-col items-start border-[1px] border-[var(--dark-border)] justify-between gap-5">
          <h3 className="sm:text-[30px]  text-xl px-2 font-semibold">
            My Cart
          </h3>

          <div className="flex w-full overflow-y-auto flex-col items-center gap-5">
            {selectedProduct.length <= 0 ? (
              <div className="flex flex-col  py-16 items-center justify-center gap-2">
                <ShoppingBag className=" cursor-pointer size-16" />

                <h1 className="text-[25px]">Your cart is empty</h1>
              </div>
            ) : (
              selectedProduct?.map((singlProduct) => (
                <div className="w-full flex justify-center items-center  pl-1 rounded-md shadow-sm">
                  <SingleCard prop={singlProduct} key={singlProduct.id} />
                </div>
              ))
            )}
          </div>
          <div className="flex  border-t w-full pt-5 items-center justify-between   sm:px-[10px] px-[20px]">
            <h3>Total : </h3>
            <h3>RS. {Total()}</h3>
          </div>
        </div>
        {/* My cart */}
        <div className="flex flex-col w-full items-center gap-[30px] px-[10px] py-[20px] bg-[var(--light-foreground)] rounded-lg ">
          <h3 className="sm:text-[30px]  border-b  w-full text-center pb-7 text-xl font-semibold">
            Payment Method
          </h3>
          <div className="flex flex-col  w-full justify-between  items-center gap-[30px]">
            <div className="w-full">
              {/* payment */}
              <form
                onSubmit={(event: FormEvent) => handleOrder(event)}
                action=""
                className="flex px-7  w-full flex-col  gap-6  items-center "
              >
                <div className="flex w-full text-[18px] tracking-wide flex-col gap-[1px] ">
                  <label htmlFor="">Full name</label>
                  <input
                    type="text"
                    className="w-full  px-[20px] py-2.5 text-[16px] focus:bg-[var(--light-background)] border-[1px] border-[var(--light-border)] rounded-md outline-none"
                  />
                </div>
                <div className="flex w-full text-[18px] tracking-wide flex-col gap-[1px] ">
                  <label htmlFor="">Contact No.</label>
                  <input
                    type="text"
                    className="w-full  px-[20px] py-2.5 text-[16px] focus:bg-[var(--light-background)] border-[1px] border-[var(--light-border)] rounded-md outline-none"
                  />
                </div>
                <div className="flex w-full text-[18px] tracking-wide flex-col gap-[1px] ">
                  <label htmlFor="">Gmail</label>
                  <input
                    type="text"
                    className="w-full  px-[20px] py-2.5 text-[16px] focus:bg-[var(--light-background)] border-[1px] border-[var(--light-border)] rounded-md outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="flex mt-8  py-3 bg-[var(--primary-color)] hover:bg-[var(--primary-dark)] transition-all duration-150 text-[var(--light-foreground)] cursor-pointer justify-center w-full rounded-md border-[1px]  px-5"
                >
                  Pay now
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

//recent products
