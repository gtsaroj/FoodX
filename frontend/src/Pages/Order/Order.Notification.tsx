import { socket } from "../../Utility/socket.utility";
import { ChevronDown } from "lucide-react";
import { Order, OrderStatus } from "../../models/order.model";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../Store";
import { removeOrder, updateOrder } from "../../Reducer/order.reducer";

const OrderNotification = () => {
  const [initialData, setInitialData] = useState<Order[]>();
  const [orderId, setOrderId] = useState<string>("");

  const [open, setOpen] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();

  const currentOrders = useSelector(
    (state: RootState) => state.root.order.order
  );

  useEffect(() => {
    setInitialData(currentOrders);
  }, [currentOrders]);

  useEffect(() => {
    const handleNotification = (order: Order) => {
      dispatch(updateOrder({ ...order }));
      // const updateOrder = initialData?.map((data): Order => {
      //   if (data.orderId === order.orderId) {
      //     return { ...data, status: order.status as OrderStatus["status"] };
      //   }
      //   return data;
      // });
      // setInitialData(updateOrder);
    };

    socket.on("order_status", handleNotification);

    return () => {
      socket.off("order_status", handleNotification);
    };
  }, []);

  const orderStatus: OrderStatus["status"][] = [
    "pending",
    "prepared",
    "prepared",
    "completed",
  ];

  const statusSteps = {
    pending: 0,
    preparing: 1,
    prepared: 2,
    completed: 3,
  };

  useEffect(() => {
    const completedOrders = initialData?.filter(
      (order) => order.status === "completed"
    );

    completedOrders?.forEach((order) => {
      setTimeout(() => {
        dispatch(removeOrder(order.orderId));
      }, 15000); // Removes the order after 15 seconds
    });
  }, [initialData, dispatch]);

  return (
    <div className="sm:max-w-[400px]  w-full flex flex-col items-start justify-center gap-2.5">
      {initialData?.map((order) => (
        <div className="w-full  text-[var(--dark-text)] flex items-start gap-3 justify-start">
          <div
            onClick={() => {
              setOpen(!open);
              setOrderId(order.orderId);
            }}
            className="w-full   cursor-pointer h-full flex flex-col items-start justify-start gap-2"
          >
            <div className="w-full flex items-start gap-1.5">
              {orderStatus?.map((_, index) => (
                <p
                  key={index} 
                  className={`w-20 h-1 ${
                    order.status === "cancelled"
                      ? "bg-red-500"
                      : index <=
                        statusSteps[order?.status as keyof typeof statusSteps] // Full green
                      ? "bg-[#2dd12d]"
                      : index ===
                        statusSteps[order?.status as keyof typeof statusSteps] +
                          1 // Partial green
                      ? "bg-green-200"
                      : "bg-gray-400" // Default gray
                  } `}
                />
              ))}
            </div>
            <div className="w-full flex  justify-between text-[var(--dark-text)] ">
              <div className="flex flex-col items-start gap-1">
                <h1 className=" text-xs flex  py-0.5 items-center justify-start gap-1 ">
                  <p className="text-[14px] text-[var(--dark-text)] ">
                    Current Order :{" "}
                  </p>{" "}
                  <p className=" text-[var(--dark-secondary-text)] flex items-start gap-1 text-[10px]">
                    {" "}
                    <span>order Id:</span> <span>{order?.orderId}</span>
                  </p>
                </h1>
                <p
                  className={`flex flex-col items-start  duration-150 justify-center gap-1 ${
                    order.orderId == orderId && open
                      ? "visible opacity-100 h-9 "
                      : " h-[0px] invisible opacity-0 "
                  } `}
                >
                  <span className="text-[var(--dark-secondary-text)] text-[10px] tracking-wide ">
                    {order?.products?.map(
                      (product) => ` ${product.name} × ${product.quantity} , `
                    )}
                  </span>
                  <span className="text-[10px] tracking-wide ">
                    Rs.{" "}
                    {order?.products?.reduce(
                      (productAcc, product) =>
                        productAcc + product.quantity * product.price,
                      0
                    )}{" "}
                    /-
                  </span>
                </p>
              </div>
            </div>
          </div>
          <button
            className={` ${
              orderId === order.orderId && open ? "rotate-180" : ""
            } duration-150 `}
            onClick={() => {
              setOrderId(order.orderId);
              setOpen(!open);
            }}
          >
            <ChevronDown className="size-6 " />
          </button>
        </div>
      ))}
    </div>
  );
};

export default OrderNotification;
