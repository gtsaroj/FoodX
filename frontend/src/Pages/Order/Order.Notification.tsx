import { socket } from "../../Utility/socket.utility";
import { ChevronDown } from "lucide-react";
import {
  GetOrderModal,
  Order,
  OrderStatus,
  UserOrder,
} from "../../models/order.model";
import { useEffect, useState } from "react";
import { aggregateUserOrder } from "./order";
import { getOrderByUser } from "../../Services/order.services";
import { RotatingLines } from "react-loader-spinner";

const OrderNotification = () => {
  const [initialData, setInitialData] = useState<UserOrder>();
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const recentOrder = async ({
    pageSize,
    filter,
    sort,
    currentLastDoc,
    currentFirstDoc,
    direction,
    status,
    userId,
  }: GetOrderModal) => {
    try {
      const response = await getOrderByUser({
        filter: filter,
        pageSize: pageSize,
        sort: sort,
        currentFirstDoc: currentFirstDoc,
        currentLastDoc: currentLastDoc,
        direction: direction,
        status: status,
        userId: userId,
      });
      const userOrder = response.data.orders as Order[];
      const aggregateOrder = aggregateUserOrder(userOrder);
      //   const currenOrderId = localStorage.getItem("cod");
      //   const currentOrder = aggregateOrder?.find(
      //     (order) => order.id === currenOrderId
      //   );
      setInitialData(aggregateOrder[0]);
    } catch (error) {
      throw new Error("Error while fetching recent order" + error);
    }
  };

  useEffect(() => {
    recentOrder({
      filter: "orderRequest",
      pageSize: 5,
      sort: "desc",
      currentFirstDoc: null,
      currentLastDoc: null,
      direction: "next",
    });
  }, []);

  //   useEffect(() => {
  //     const handleNotification = (order: Order) => {
  //       console.log(order);
  //       setInitialData(order);
  //     };

  //     socket.on("order_status", handleNotification);

  //     return () => {
  //       socket.off("order_status", handleNotification);
  //     };
  //   }, []);

  const orderStatus: OrderStatus["status"][] = [
    "pending",
    "prepared",
    "prepared",
    "completed",
    "cancelled",
  ];

  const statusSteps = {
    pending: 0,
    preparing: 1,
    prepared: 2,
    completed: 3,
    cancelled: 4,
  };

  return loading ? (
    <div className="w-full flex flex-col items-center pt-3 justify-center ">
      {/* <Skeleton height={70} count={5} /> */}
      <div className="flex items-center justify-center gap-3">
        <RotatingLines strokeColor="var(--dark-text)" width="27" />
        <span className="text-[17px] text-[var(--dark-text)] tracking-wider ">
          {" "}
          loading...
        </span>
      </div>
    </div>
  ) : (
    <div
      onClick={() => setOpen(!open)}
      className="w-full sm:pt-0 pt-10 cursor-pointer h-full flex flex-col items-start justify-start gap-2"
    >
      <div className="w-full flex items-start gap-3">
        {orderStatus?.map((order, index) => (
          <p
            className={` w-20 h-1 ${
              statusSteps[initialData?.status as keyof typeof statusSteps] === 4
                ? "bg-red-500"
                : index <=
                  statusSteps[initialData?.status as keyof typeof statusSteps]
                ? "bg-green-500 "
                : "bg-gray-400"
            } `}
          ></p>
        ))}
      </div>
      <div className="w-full flex  justify-between text-[var(--dark-text)] ">
        <div className="flex flex-col items-start gap-1">
          <h1 className=" text-xs flex  items-center justify-start gap-1 ">
            <p className="text-[12.5px] ">Current Order : </p>{" "}
            <span>{initialData?.id}</span>
          </h1>
          <p
            className={`flex flex-col items-start  duration-150 justify-center gap-1 ${
              open
                ? "visible opacity-100 h-9 "
                : " h-[0px] invisible opacity-0 "
            } `}
          >
            <span className="text-[var(--dark-secondary-text)] text-xs tracking-wide ">
              {initialData?.products?.map(
                (product) => ` ${product.name} × ${product.quantity} , `
              )}
            </span>
            <span className="text-[12.5px] tracking-wide ">
              Rs.{" "}
              {initialData?.products?.reduce(
                (productAcc, product) =>
                  productAcc + product.quantity * product.price,
                0
              )}{" "}
              /-
            </span>
          </p>
        </div>
        <button
          className={` ${open ? "rotate-180" : ""} duration-150 `}
          onClick={() => setOpen(!open)}
        >
          <ChevronDown className="size-6 " />
        </button>
      </div>
    </div>
  );
};

export default OrderNotification;
