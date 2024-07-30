import React, { useEffect, useState } from "react";
import { OrderModal } from "../../models/order.model";
import Table from "../../Components/Common/Table/Table";
import { ColumnProps } from "../../models/table.model";
import { ChevronRight } from "lucide-react";

interface orderTableProp {
  orders: OrderModal[];
  loading?: boolean;
}

export const OrderTable: React.FC<orderTableProp> = ({ orders, loading }) => {
  const [selectedProducts, setSelectedProducts] = useState<string[] | string>(
    []
  );
  const [status, setStatus] = useState<string>();
  const [id, setId] = useState<string>();
  const [selectedId, setSelectedId] = useState<string>();
  const [isChangeStatus, setIsChangeStatus] = useState<boolean>(true);

  const Columns: ColumnProps[] = [
    {
      fieldName: "Id",
      colStyle: { width: "100px", textAlign: "start" },
      render: (item: OrderModal) => (
        <div className=" !p-0 w-[100px]   relative cursor-pointer group/id text-center ">
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
      colStyle: {
        width: "180px ",
        justifyContent: "start",
        textAlign: "start",
      },
      render: (item: OrderModal) => (
        <div className=" w-[180px]  flex items-center justify-start gap-1 text-[var(--dark-text)]">
          <p>{item.id == selectedId ? item.products : selectedProducts}</p>
          <span onClick={() => setSelectedId(item.id)}>
            <ChevronRight
              className={`size-5 ${
                selectedId === item.id ? "rotate-90" : ""
              }  duration-200 cursor-pointer `}
            />
            {}{" "}
          </span>
        </div>
      ),
    },
    {
      fieldName: "Recieved",
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
        <div
          onClick={() => [setIsChangeStatus(true)]}
          className=" w-[140px] gap-2 flex  items-center justify-start  text-[var(--dark-text)]  "
        >
          <div
            className={`w-2 h-2 rounded-full ${
              item.status === "Received"
                ? "bg-[var(--green-bg)] "
                : item?.status === "Canceled"
                ? "bg-[var(--danger-bg)] "
                : item.status === "Preparing"
                ? "bg-[var(--orange-bg)] "
                : item.status === "Delivered"
                ? "bg-[var(--primary-color)] "
                : item.status === "Pending"
                ? "bg-[var(--primary-light)] "
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

  useEffect(() => {
    orders?.forEach((order) => {
      if (!order.products) return "Not available";
      setSelectedProducts(order.products[0]);
    });
  }, [orders]);
  return (
    <div className="w-full overflow-auto rounded-t-md">
      <Table
        data={orders}
        columns={Columns}
        actionIconColor="red"
        disableActions={false}
        loading={loading}
        bodyHeight={400}
        pagination={{ currentPage: 1, perPage: 5 }}
        onPageChange={(pageNumber: number) => console.log(pageNumber)}
        disableNoData={false}
        headStyle={{ width: "100%" }}
      />
    </div>
  );
};
