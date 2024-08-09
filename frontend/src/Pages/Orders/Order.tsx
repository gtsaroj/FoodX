import { useEffect, useState } from "react";
import { getOrderByUser } from "../../firebase/oder";
import { Order, Product } from "../../models/order.model";
import { nanoid } from "@reduxjs/toolkit";
import { ChevronsLeft, ChevronRight, ChevronsRight } from "lucide-react";
import { RootState, Store } from "../../Reducer/Store";
import {
  addToList,
  onNavigateNextPage,
  onNavigatePrevPage,
} from "../../Reducer/OrderReducer";
import { useSelector } from "react-redux";

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
  // const { order, currentpage, orderPerPage } = useSelector(
  //   (state: RootState) => state.root.Products.order
  // );
  // const [orders, setOrders] = useState<Order[]>([]);
  // const [lastVisibleOrder, setLastVisibleOrder] = useState<any>();
  // const [currentPage, setCurrentPage] = useState<number>(1);
  // const [nextDisabled, setNextDisabled] = useState<boolean>(false);
  // const user = useSelector((state: RootState) => state.root.auth.userInfo);
  // const fetchData = async (next?: boolean) => {
  //   try {
  //     if (!user) throw new Error("Please Login first.");
  //     const data = await getOrderByUser(user?.uid, lastVisibleOrder, next);
  //     console.log(data);
  //     const serializeData = data?.map((order: Order) => ({
  //       ...order,
  //       orderRequest: {
  //         seconds: order.orderRequest?.seconds,
  //         nanoseconds: order.orderRequest?.nanoseconds,
  //       },
  //       orderFullFilled: {
  //         seconds: order.orderFullFilled?.seconds,
  //         nanoseconds: order.orderFullFilled?.nanoseconds,
  //       },
  //     }));
  //     Store.dispatch(addToList([...serializeData]));

  //     if (data.length < 5) {
  //       setNextDisabled(true);
  //     } else {
  //       setNextDisabled(false);
  //     }

  //     if (next) {
  //       setOrders((prev) => [...prev, ...data]);
  //     } else {
  //       5;
  //       setOrders(data);
  //     }

  //     if (order.length > 0) {
  //       setLastVisibleOrder(data[data.length - 1].orderRequest);
  //     }
  //     setOrders(data);
  //   } catch (error) {
  //     console.error(error);
  //     throw new Error("Fetch data failed");
  //   } finally {
  //   }
  // };
  // const handleNextPage = () => {
  //   setCurrentPage((prev) => prev + 1);
  //   Store.dispatch(onNavigateNextPage());
  //   fetchData(true);
  // };

  // const handlePrevPage = () => {
  //   setCurrentPage((prev) => Math.max(prev - 1, 1));
  //   Store.dispatch(onNavigatePrevPage());
  //   fetchData(false);
  // };

  // const totalOrder = order.length - 1;

  // const totalOrderPerPage = currentPage * totalOrder;

  // // useEffect(() => {
  // //   fetchData();
  // // }, [currentPage]);

  // useEffect(() => {
  //   fetchData();
  // }, []);

  return (
    <div className="flex  flex-col items-start gap-10 py-5 justify-center w-full h-full ">
      <div className="w-full flex flex-col gap-3 bg-white px-5 py-4   rounded items-start justify-center">
        <h1 className="text-[23px] tracking-wider ">Recent Orders</h1>
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
          <h1 className="text-[23px] tracking-wider ">Recent Orders</h1>
          <div className="flex flex-col items-center w-full  gap-5  ">
            <div className="h-[60px] w-full bg-slate-200 "></div>
            <div className="h-[60px] w-full bg-slate-200 "></div>
            <div className="h-[60px] w-full bg-slate-200 "></div>
          </div>
        </div>
      </div>{" "}
      <div className="w-full flex flex-col gap-3 bg-white px-5 py-4   rounded items-start justify-center">
        <h1 className="text-[23px] tracking-wider ">Popular products</h1>
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
    </div>
  );
};

export const OrderCard = (props: { item: Order }) => {
  return (
    <div className="w-full">
      <div className="w-[300px] h-[200px] bg-slate-100 rounded-sm "></div>
    </div>
  );
};
