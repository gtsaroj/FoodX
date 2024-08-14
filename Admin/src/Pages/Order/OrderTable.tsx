import React, { useEffect, useRef, useState } from "react";
import { OrderModal } from "../../models/order.model";
import Table from "../../Components/Common/Table/Table";
import { ColumnProps } from "../../models/table.model";
import { ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import { updateOrderStatus } from "../../Services";

interface orderTableProp {
  totalData: number;
  orders: OrderModal[];
  loading?: boolean;
  pagination: { currentPage: number; perPage: number };
  onPageChange: (page: number) => void;
}

export const OrderTable: React.FC<orderTableProp> = ({
  totalData,
  orders,
  loading,
  onPageChange,
  pagination,
}) => {
  const [selectedProducts, setSelectedProducts] = useState<string[] | string>(
    []
  );
  const [id, setId] = useState<string>();
  const [selectedId, setSelectedId] = useState<string>();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isChangeStatus, setIsChangeStatus] = useState<boolean>(false);

  const statusChangeFn = async (newStatus: string) => {
    if (!newStatus && !id) return toast.error("Order doesn't exist");
    const toastLoader = toast.loading("Updating status...");
    try {
      const response = await updateOrderStatus({
        id: id as string,
        status: newStatus,
      });
      console.log(response);
      toast.dismiss(toastLoader);
      toast.success("Succussfully updated");
    } catch (error) {
      toast.dismiss(toastLoader);
      toast.error("Error while updating status");
      throw new Error("Error while updating status" + error);
    }
    setIsChangeStatus(false);
  };

  const Columns: ColumnProps[] = [
    {
      fieldName: "Id",
      colStyle: { width: "100px", textAlign: "start" },
      render: (item: OrderModal) => (
        <div className=" !p-0 w-[100px]   relative cursor-pointer group/id text-center ">
          #{item.id?.substring(0, 8)}
          <div
            className=" top-[-27px]  text-[15px] -left-2 group-hover/id:visible opacity-0 group-hover/id:opacity-[100] duration-150 invisible   absolute bg-[var(--light-foreground)] p-0.5
           rounded shadow "
          >
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
          <p>
            {item.id == selectedId && isCollapsed
              ? item.products
              : selectedProducts}
          </p>
          <span
            onClick={() => {
              setSelectedId(item.id);
              setIsCollapsed(!isCollapsed);
            }}
          >
            <ChevronRight
              className={`size-5 ${
                selectedId === item.id && isCollapsed ? "rotate-90" : ""
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
        <div className=" w-[140px]  gap-2 flex  items-center justify-start  text-[var(--dark-text)]  ">
          <div
            className={`w-2 h-2 rounded-full ${
              item.status === "Received"
                ? "bg-[var(--primary-color)] "
                : item.status === "Delivered"
                ? "bg-[var(--green-bg)] "
                : item.status === "Pending"
                ? "bg-[var(--primary-light)] "
                : item.status === "Canceled"
                ? "bg-[var(--danger-bg)]"
                : item.status === "Preparing"
                ? "bg-[var(--orange-bg)] "
                : ""
            } `}
          ></div>
          <button
            onClick={() => {
              setIsChangeStatus(true);
              setId(item.id);
            }}
          >
            {item.status}
          </button>
          <div className="absolute lg:left-[45rem] md:left-[30rem] left-[15rem] sm:left-[30rem] z-[1000]">
            {" "}
            {isChangeStatus && id === item.id && (
              <StatusChanger
                isChangeStatus={() => setIsChangeStatus(false)}
                status={item.status}
                statusFn={(status) => statusChangeFn(status)}
              />
            )}
          </div>
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
        totalData={totalData}
        data={orders as any}
        columns={Columns}
        actionIconColor="red"
        disableActions={false}
        loading={loading}
        bodyHeight={400}
        pagination={{
          currentPage: pagination.currentPage,
          perPage: pagination.perPage,
        }}
        onPageChange={(pageNumber: number) => onPageChange(pageNumber)}
        disableNoData={false}
        headStyle={{ width: "100%" }}
      />
    </div>
  );
};

interface StatusChangerProp {
  status: "Received" | "Preparing" | "Delivered" | "Canceled" | "Pending";
  statusFn: (status: string, id?: string) => void;
  isChangeStatus: () => void;
}

export const StatusChanger: React.FC<StatusChangerProp> = ({
  status,
  statusFn,
  isChangeStatus,
}) => {
  console.log(status);
  const [showModal, setShowModal] = useState(true);

  const reference = useRef<HTMLDivElement>();
  const Status = ["Preparing", "Received", "Delivered", "Canceled"];
  const updateStatus = Status.filter((sts) => sts !== status);

  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (
        reference.current &&
        !reference.current?.contains(event.target as any)
      ) {
        setShowModal(false);
        isChangeStatus();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [status, isChangeStatus]);

  return (
    <div
      ref={reference as any}
      className={`w-full flex p-1 duration-200 flex-col bg-[var(--light-foreground)] border shadow rounded-lg items-center ${
        showModal ? "visible" : "invisible"
      } `}
    >
      {updateStatus.map((status, index) => (
        <button
          className={`w-[150px] flex items-center tracking-wider gap-3 justify-start py-1.5 px-5 duration-150 hover:bg-slate-200 rounded-lg `}
          onClick={() => statusFn(status)}
          key={index}
        >
          <span
            className={` w-2 rounded-full h-2 ${
              status === "Received"
                ? "bg-[var(--primary-color)] "
                : status === "Delivered"
                ? "bg-[var(--green-bg)] "
                : status === "Pending"
                ? "bg-[var(--primary-light)] "
                : status === "Canceled"
                ? "bg-[var(--danger-bg)]"
                : status === "Preparing"
                ? "bg-[var(--orange-bg)] "
                : ""
            }`}
          ></span>
          <span> {status}</span>
        </button>
      ))}
    </div>
  );
};
