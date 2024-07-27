import React, { useCallback, useEffect, useState } from "react";
import { SearchOrder } from "../../Utility/Search";
import { debounce } from "../../Utility/Debounce";
import Table from "../../Components/Common/Table/Table";
import { ColumnProps } from "../../models/table.model";
import { OrderModal, Product } from "../../models/order.model";
import { getOrders } from "../../Services";
import { convertIsoToReadableDateTime } from "../../Utility/DateUtils";
import { getFullName } from "../../Utility/Utils";
import toast, { Toaster } from "react-hot-toast";
import Delete from "../../Components/Common/Delete/Delete";
import Modal from "../../Components/Common/Popup/Popup";
import UpdateOrder from "../../Components/Upload/UpdateOrder";

const Columns: ColumnProps[] = [
  {
    fieldName: (
      <div className=" w-[50px] text-start">
        <input className="w-4 h-4 cursor-pointer" type="checkbox" />
      </div>
    ),
    render: () => (
      <div className="w-[50px]  ">
        <input className="w-4 h-4 cursor-pointer" type="checkbox" />
      </div>
    ),
  },
  {
    fieldName: "Id",
    colStyle: { width: "100px", textAlign: "start" },
    render: (item: OrderModal) => (
      <div className=" !p-0 w-[100px]  relative cursor-pointer group/id text-center ">
        #{item.id?.substring(0, 8)}
        <div className=" top-[-27px] group-hover/id:visible opacity-0 group-hover/id:opacity-[100] duration-150 invisible left-[-30px]  absolute bg-[var(--light-foreground)] p-1 rounded shadow ">
          {item.id}
        </div>
      </div>
    ),
  },
  {
    fieldName: "Name",
    colStyle: { width: "120px", justifyContent: "start", textAlign: "start" },
    render: (value: OrderModal) => (
      <div className="w-[120px]  text-[var(--dark-text)] flex items-center justify-start gap-3 ">
        <span> {value.name}</span>
      </div>
    ),
  },
  {
    fieldName: "Items",
    colStyle: { width: "150px", justifyContent: "start", textAlign: "start" },
    render: (item: OrderModal) => (
      <div className=" w-[150px]  text-[var(--dark-text)]">
        {item.products?.map((data) => (
          <p>{data}</p>
        ))}
      </div>
    ),
  },
  {
    fieldName: "Order at",
    colStyle: { width: "135px", justifyContent: "start", textAlign: "start" },
    render: (item: OrderModal) => (
      <div className=" w-[135px] flex flex-col items-start justify-center text-[var(--dark-text)] ">
        <span>{item.orderRequest.fulldate + ", "}</span>
        <span>{item.orderRequest.time}</span>
      </div>
    ),
  },
  {
    fieldName: "Delivered ",
    colStyle: { width: "135px", justifyContent: "start", textAlign: "start" },
    render: (item: OrderModal) => (
      <div className=" w-[135px] flex flex-col items-start justify-center text-[var(--dark-text)] ">
        <span>{item.orderRequest.fulldate + ", "}</span>
        <span>{item.orderRequest.time}</span>
      </div>
    ),
  },
  {
    fieldName: "Status",
    colStyle: { width: "140px", justifyContent: "start", textAlign: "start" },
    render: (item: OrderModal) => (
      <div className=" w-[140px] gap-2 flex  items-center justify-start  text-[var(--dark-text)]  ">
        <div
          className={`w-2 h-2 rounded-full ${
            item.status === "Received"
              ? "bg-[var(--green-bg)] "
              : item?.status === "Canceled"
              ? "bg-[var(--danger-bg)] "
              : item.status === "Preparing"
              ? "bg-[var(--orange-bg)] "
              : ""
          } `}
        ></div>
        <p>{item.status}</p>
      </div>
    ),
  },
  {
    fieldName: "Rank",
    colStyle: { width: "100px", justifyContent: "start", textAlign: "start" },
    render: (item: OrderModal) => (
      <div className=" w-[135px] flex flex-col items-start justify-center text-[var(--dark-text)] ">
        <span>{item.rank}</span>
      </div>
    ),
  },
];

export const OrderTable = () => {
  const [initialOrders, setInitialOrders] = useState<OrderModal[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(true);
  const [status, setStatus] = useState<string>();
  const [id, setId] = useState<string>();

  const getAllOrders = async () => {
    setLoading(true);
    try {
      //  get total orders data from  server
      const orders = (await getOrders()) as Order[];
      const aggregateData = orders?.map(async (item) => {
        let getUserName = await getFullName(item?.uid);
        const getDate = convertIsoToReadableDateTime(
          item.orderRequest as string
        );
        if (!getUserName) getUserName = "Student";
        const productNames = item.products?.map(
          (product: Product) =>
            (product.name as string) + " × " + product.quantity + ", "
        );
        return {
          id: item.orderId as string,
          name: getUserName,
          products: productNames,
          rank: 3,
          orderRequest: {
            fulldate: getDate.date.substring(5, getDate.date.length),
            time: getDate.time,
          },

          delivered: item.orderFullFilled,
          status: item.status,
        };
      });

      const getaggregateDataPromises = await Promise.all(aggregateData);

      setInitialOrders(getaggregateDataPromises);
    } catch (error) {
      setLoading(false);

      throw new Error("Unable to display orders data" + error);
    }
    setLoading(false);
  };
  const handleDelete = async (orderId: string) => {
    if (!orderId) throw new Error("orderId not found");
    try {
      const toastLoading = toast.loading("Order deleting...");
      await deleteOrderFromDatabase(orderId as string);
      await getAllOrders();
      toast.dismiss(toastLoading);
      toast.success("Order deleted!");
      setIsDelete(false);
    } catch (error) {
      throw new Error("Unable to delete order" + error);
    }
  };


  useEffect(() => {
    (async () => {
      getAllOrders();
    })();
  }, []);
  return (
    <>

    </>
  );
};
