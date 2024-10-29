import React, { useState } from "react";
import { RecentOrder, status } from "../../../models/order.model";
import dayjs from "dayjs";
import { StatusChanger } from "../../../Pages/Order/Order.table.page";
import toast from "react-hot-toast";
import { updateOrderStatus } from "../../../Services/order.services";
import { addNotification } from "../../../Services/notification.services";
import Avatar from "../../../assets/logo/avatar.png";

// interface OrderCardProps {
//   orderId: string;
//   items: [name: string, quantity: number];
//   price: number;
//   status: string;
//   date: Date;
// }

export const OrderCard: React.FC<RecentOrder> = ({
  orderId,
  image,
  products,
  price,
  status,
  orderRequest,
  uid,
}) => {
  console.log(products);
  const [isChangeStatus, setIsChangeStatus] = useState<boolean>(false);
  const [id, setId] = useState<string>();
  const [isNewStatus, setIsNewStatus] = useState<status["status"]>(status);

  const ogDate = dayjs(orderRequest).format("h:mm:ss A");

  const statusChangeFn = async (newStatus: status["status"]) => {
    if (!newStatus && !id) return toast.error("Order doesn't exist");
    const toastLoader = toast.loading("Updating status...");

    try {
      await updateOrderStatus({
        id: id as string,
        status: newStatus!,
        price: id === orderId ? price : 0,
        userId: uid as string,
      });
      if (newStatus === "completed") {
        await addNotification({
          message: "Your order has been successfully completed.",
          title: "Order Completed",
          userId: uid as string,
        });
      }
      setIsNewStatus(newStatus!);
      toast.dismiss(toastLoader);
      toast.success("Succussfully updated");
    } catch (error) {
      toast.dismiss(toastLoader);
      toast.error("Error while updating status");
      throw new Error("Error while updating status" + error);
    }
    setIsChangeStatus(false);
  };

  return (
    <div className="flex items-center justify-between flex-shrink-0 w-full h-full gap-5 p-3 border border-[var(--dark-border)] rounded-md min-w-[500px]">
      <div className="flex w-full items-center justify-start gap-3">
        <div className="w-[40px] h-[40px] ">
          <img
            src={image || Avatar}
            loading="lazy"
            className="w-full rounded-full  h-full"
            alt="order"
          />
        </div>
        <div className="flex flex-col items-start justify-center ">
          <p className="text-xs text-[var(--dark-secondary-text)] pb-1">
            {orderId}
          </p>

          <p className="text-sm text-[var(--dark-secondary-text)] pb-3">
            {products?.map(
              (product) => `${product.name} × ${product?.quantity}, `
            )}
          </p>
          <p className="text-lg text-[var(--dark-text)] font-semibold tracking-wide">
            Rs <span>{price}</span>
          </p>
        </div>
      </div>
      <div className="flex relative flex-col w-[80px] items-start justify-between gap-3 text-xs">
        <p
          onClick={() => {
            setIsChangeStatus(!isChangeStatus);
            setId(orderId);
          }}
          className="p-2 w-full  text-[var(--dark-text)] tracking-wide rounded cursor-pointer bg-[var(--green-bg)]"
        >
          {isNewStatus &&
            isNewStatus?.charAt(0).toUpperCase() + isNewStatus?.slice(1)}
        </p>
        <div className="absolute text-[var(--dark-text)] text-[16px] left-[-5rem] top-[-0.8rem]  z-[1000]">
          {" "}
          {isChangeStatus && id === orderId && (
            <StatusChanger
              isChangeStatus={() => setIsChangeStatus(false)}
              status={status!}
              statusFn={(newStatus: status["status"]) =>
                statusChangeFn(newStatus)
              }
            />
          )}
        </div>
        <div className="text-xs  text-[var(--dark-secondary-text)] pb-1 flex flex-col items-start justify-center">
          <p>{ogDate}</p>
        </div>
      </div>
    </div>
  );
};
