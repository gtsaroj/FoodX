import { toast } from "react-hot-toast";
import { Order, OrderStatus } from "../../models/order.model";
import { User } from "../../models/user.model";
import dayjs from "dayjs";


// const getStatusColor = (status: OrderStatus["status"]) => {
//   switch (status) {
//     case "completed":
//       return "bg-green-100 text-green-800 border-green-600";
//     case "cancelled":
//       return "bg-red-100 text-red-800 border-red-600";
//     case "preparing":
//       return "bg-yellow-100 text-yellow-800 border-yellow-600";
//     default:
//       return "bg-gray-100 text-gray-800 border-gray-600";
//   }
// };

const customToast = (
  id: string,
  order: Order,
  orderStatus: OrderStatus["status"],
  user: User
) => {
  // const { uid, products, orderFullfilled } = order;

  const messages: { [key: string]: string } = {
    preparing:
      "Your order is being prepared. It won't be long until it's ready to enjoy.",
    prepared:
      "Your order is prepared. Thank you for waiting patiently. Please visit us to receive your order.",
    completed:
      "Your order has been completed. Thank you for ordering. Enjoy your meal!",
    cancelled: "Your order has been cancelled. Please visit us to support us.",
  };

  toast.custom(
    (t) => (
      <div
        className={` ${
          t.visible
            ? "visible opacity-100"
            : "invisible opacity-0 translate-x-48"
        } w-[380px] flex flex-col  translate-x-0 duration-150 items-start bg-white  justify-between gap-5 p-2 rounded-lg`}
      >
        <div className="w-full flex items-center justify-between">
          <div className="flex flex-col items-start justify-center">
            <h1 className=" text-[16px] tracking-wide ">
              Your order is {order.status} !!
            </h1>
            <p className="text-xs flex items-center gap-1 tracking-wide text-gray-400 ">
              Order ID:{" "}
              <span className="text-[10.4px] text-gray-500 ">{id}</span>
            </p>
          </div>
          <div className="text-xs flex flex-col items-start justify-center gap-1 text-gray-500 ">
            <p>
              {order.status === "completed"
                ? dayjs(order.orderFullfilled).format("YYYY-MM-DD")
                : dayjs(order.orderRequest).format("YYYY-MM-DD")}
            </p>
            <p>
              {order.status === "completed"
                ? dayjs(order.orderFullfilled).format("h:mm A")
                : dayjs(order.orderRequest).format("h:mm A")}
            </p>
          </div>
        </div>
        <p className="text-[14px] text-gray-500 ">
          {messages[order?.status as keyof typeof messages] ||
            "Status unknown."}
        </p>
      </div>
    ),
    {
      position: "top-right",
      duration: 5000, // Auto-dismiss after 5 seconds
    }
  );
};

export default customToast;
