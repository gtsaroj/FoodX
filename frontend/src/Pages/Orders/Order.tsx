import { useEffect, useState } from "react";
import { Order, Product } from "../../models/order.model";
import { nanoid } from "@reduxjs/toolkit";
import { ArrowRight, ChevronRight } from "lucide-react";
import { ProductType } from "../../models/productMode";
import { SpecialCards } from "../../Components/Card/SpecialCards";
import { UseFetch } from "../../UseFetch";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { LoadingContent } from "../../Components/Loader/Loader";
import { ColumnProps, OrderModal } from "../../models/table.model";
import Table from "../../Components/Common/Table/Table";
import { orderHistory as orderData } from "../../data.json";

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
  const [initialData, setInitialData] = useState<ProductType[]>([]);
  const { data, loading: loader } = UseFetch("/products/all");
  const [loading, setLoading] = useState<boolean>(loader);
  console.log(loader);

  useEffect(() => {
    setInitialData(data as ProductType[]);
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
      <div className="w-full h-full">
        <div className="w-full h-full flex flex-col gap-3 bg-white px-5 py-4   rounded items-start justify-center">
          <h1 className="text-[30px] py-2 pb-5 font-semibold tracking-wider ">
            Recent Orders
          </h1>
          <OrderHistory />
        </div>
      </div>{" "}
      <div className="w-full h-full px-3 py-2 rounded-t-lg flex flex-col gap-3 bg-white ">
        <h1 className="text-[23px] tracking-wider ">Popular products</h1>
        <div className="w-full flex flex-col gap-3 bg-white px-5 py-4  overflow-auto  rounded items-start justify-center">
          <div className=" overflow-hidden">
            <div className="w-full h-full flex items-center gap-4 justify-start  ">
              {initialData?.map((singleObject) => (
                <SpecialCards prop={singleObject} key={singleObject.id} />
              ))}
            </div>
          </div>
          {loading && (
            <LoadingContent
              isLoading={loading}
              loadingFn={() => setLoading(false)}
            />
          )}
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

export const OrderHistory = () => {
  const [selectedProducts, setSelectedProducts] = useState<string[] | string>(
    []
  );
  const [selectedId, setSelectedId] = useState<string>();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [pagination, setPagination] = useState<{
    currentPage?: number;
    perPage?: number;
  }>({ currentPage: 1, perPage: 5 });

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
              ? item.product
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
      fieldName: "Date",
      colStyle: { width: "135px", justifyContent: "start", textAlign: "start" },
      render: (item: OrderModal) => (
        <div className=" w-[135px] flex flex-col items-start justify-center text-[var(--dark-text)] ">
          <span>{item.orderDate}</span>
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
              item.deliveryStatus === "Received"
                ? "bg-[var(--primary-color)] "
                : item.deliveryStatus === "Delivered"
                ? "bg-[var(--green-bg)] "
                : item.deliveryStatus === "Pending"
                ? "bg-[var(--primary-light)] "
                : item.deliveryStatus === "Canceled"
                ? "bg-[var(--danger-bg)]"
                : item.deliveryStatus === "Preparing"
                ? "bg-[var(--orange-bg)] "
                : ""
            } `}
          ></div>
          <span>{item.deliveryStatus}</span>
        </div>
      ),
    },
    {
      fieldName: "Amount",
      colStyle: { width: "100px", justifyContent: "start", textAlign: "start" },
      render: (item: OrderModal) => (
        <div className=" w-[100px]  flex flex-col items-start justify-center text-[var(--dark-text)] ">
          <span>{item.totalAmount}</span>
        </div>
      ),
    },
    {
      fieldName: "Payment",
      colStyle: { width: "170px", justifyContent: "start", textAlign: "start" },
      render: (item: OrderModal) => (
        <div className=" w-[170px]  flex flex-col items-start justify-center text-[var(--dark-text)] ">
          <span>{item.paymentMethod}</span>
        </div>
      ),
    },
  ];

  useEffect(() => {
    orderData?.forEach((order) => {
      if (!order.product) return "Not available";
      console.log(order.product[0]);
      setSelectedProducts(order.product[0]);
    });
  }, [orderData]);

  return (
    <Table
      actions={{
        orderFn: (id: string) => console.log(id),
        downloadFn: (id: string) => console.log(id),
      }}
      pagination={{
        currentPage: pagination?.currentPage,
        perPage: pagination?.perPage,
      }}
      onPageChange={(page: number) =>
        setPagination((prev) => ({ ...prev, currentPage: page }))
      }
      headStyle={{ width: "100%" }}
      bodyHeight={400}
      columns={Columns}
      data={orderData}
      totalData={orderData.length}
      loading={false}
    />
  );
};
