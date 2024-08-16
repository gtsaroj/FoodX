import { useEffect, useState } from "react";
import { Order, Product } from "../../models/order.model";
import { nanoid } from "@reduxjs/toolkit";
import { ArrowRight } from "lucide-react";
import { ProductType } from "../../models/productMode";
import { SpecialCards } from "../../Components/Card/SpecialCards";
import { UseFetch } from "../../UseFetch";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const product: Product = {
  id: nanoid(),
  image: "img.png",
  name: "Chicken Pizza",
  price: 120,
  quantity: 5,
  tag: "pizza",
};

const order1: Order = {
  orderId: nanoid(),
  uid: "X8LHXCdRffcKJMR9Rs1s87HJBm83",
  products: [product],
  orderRequest: {
    nanoseconds: 1,
    seconds: 2,
  },
  orderFullFilled: {
    nanoseconds: 3,
    seconds: 4,
  },
};

export const OrderComponent = () => {
  const [initialData, setInitialData] = useState<ProductType[]>();
  const { data } = UseFetch("/products/all");

  useEffect(() => {
    if (data && data?.length > 0) {
      setInitialData(data);
    }
  }, [data]);

  return (
    <div className="flex  flex-col items-start gap-10 py-5 justify-center w-full h-full ">
      <div className="w-full flex flex-col gap-3 bg-white px-5 py-4   rounded items-start justify-center">
        <h1 className="text-[30px] tracking-wider font-semibold ">
          Recent Orders
        </h1>
        <div className="flex items-center w-full  gap-5 overflow-x-auto ">
          <OrderCard />
          <OrderCard />
          <OrderCard />
          <OrderCard />
          <OrderCard />
          <OrderCard />
          <OrderCard />
          <OrderCard />
        </div>
      </div>
      <div className="w-full">
        <div className="w-full flex flex-col gap-3 bg-white px-5 py-4   rounded items-start justify-center">
          <h1 className="text-[30px] font-semibold tracking-wider ">
            Recent Orders
          </h1>
          <div className="flex flex-col items-center w-full  gap-5  ">
            <div className="h-[60px] w-full bg-slate-200 "></div>
            <div className="h-[60px] w-full bg-slate-200 "></div>
            <div className="h-[60px] w-full bg-slate-200 "></div>
          </div>
        </div>
      </div>{" "}
      <div className="w-full h-full px-3 py-2 rounded-t-lg flex flex-col gap-3 bg-white ">
        <h1 className="text-[23px] tracking-wider ">Popular products</h1>
        <div className="w-full flex flex-col gap-3 bg-white px-5 py-4  overflow-auto  rounded items-start justify-center">
          <div className=" overflow-hidden">
            <div className="w-full h-full flex items-center gap-4 justify-start  ">
              {initialData && initialData?.length > 0 ? (
                initialData?.map((singleObject) => (
                  <SpecialCards prop={singleObject} key={singleObject.id} />
                ))
              ) : (
                <Skeleton
                  height={100}
                  baseColor="var(--light-background)"
                  highlightColor="var(--light-foreground)"
                  count={1}
                />
              )}{" "}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const OrderCard = (props: { item: Order }) => {
  return (
    <div className="w-[550px] rounded-l-lg pr-5 h-full border-[1px] border-[var(--dark-border)] rounded-lg gap-5  flex items-center justify-center">
      <div className="w-[350px] rounded-l-lg h-[200px]">
        <img
          src="https://www.shutterstock.com/image-photo/burger-tomateoes-lettuce-pickles-on-600nw-2309539129.jpg"
          className=" rounded-l-lg w-full h-full bg-slate-100 rounded-sm "
        ></img>
      </div>
      <div className="flex flex-col w-full items-start gap-3 justify-between h-full">
        <p className="text-[16px] text-gray-400 ">#fldksjslfj</p>
        <div className="w-full flex items-center justify-between">
          <p className="text-[var(--dark-secondary-text)] tracking-wider font-semibold gap-4 text-[16px] ">
            22-04-01
          </p>
          <p className="text-[var(--dark-secondary-text)] tracking-wider font-semibold gap-4 text-[16px] ">
            04:15 AM
          </p>
        </div>
        <div className="flex pb-5 text-[14px] font-semibold w-full text-gray-500 border-b-[2px] border-[var(--dark-border)] items-center justify-start">
          Chicken Burger *3, Chicken Momo *2
        </div>
        <div className="flex  items-center justify-between w-full">
          <span className=" font-semibold text-[var(--dark-text)] text-[17px] tracking-wider ">
            Rs 2,000
          </span>
          <button className=" font-semibold duration-150 gap-2 flex items-center justify-start text-[var(--primary-color)] hover:text-[var(--primary-light)] ">
            Order Again <ArrowRight className="size-5" />{" "}
          </button>
        </div>
      </div>
    </div>
  );
};
