import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { getOrderByUser } from "../../services/order.services";
import { useNavigate } from "react-router-dom";
import { addToCart, removeCart } from "../../reducer/product.reducer";
import { Invoice } from "../invoice/invoice";
import dayjs from "dayjs";
import React from "react";
import {
  addProductToCart,
  removeProductFromCart,
} from "../../services/cart.services";
import { pdf } from "@react-pdf/renderer";
import { Table } from "../../common";
import { useAppSelector, useAppDispatch } from "../../hooks/useActions";
import { useHooks } from "../../hooks/useHooks";
import { useAggregateUserOrder } from "../../hooks/useOrders";

export const OrderHistory = () => {
  const navigate = useNavigate();
  const {
    data,
    setData,
    loading,
    setLoading,
    pagination,
    setPagination,
    selectedId,
    setIsCollapsed,
    isCollapsed,
    setSelectedId,
    setTotalData,
    totalData,
  } = useHooks<Model.UserOrder[], "orderHistory">("orderHistory");

  const [currentDoc, setCurrentDoc] = useState<{
    currentFirstDoc: string;
    currentLastDoc: string;
  }>();

  const store = useAppSelector();
  const dispatch = useAppDispatch();

  const Columns: Common.ColumnProps<Model.UserOrder>[] = React.useMemo(
    () => [
      {
        fieldName: "Id",
        colStyle: { width: "100px", textAlign: "start" },
        render: (item: Model.UserOrder) => (
          <div className=" !p-0 w-[100px]  text-xs sm:text-[14px]  relative cursor-pointer group/id text-center ">
            #{item.id?.substring(0, 8)}
            <div
              className=" top-[-27px] mx-2  text-[15px] text-xs sm:text-sm -left-2 group-hover/id:visible opacity-0 group-hover/id:opacity-[100] duration-150 invisible   absolute bg-[var(--light-foreground)] p-0.5
             rounded shadow "
            >
              #{item.id}
            </div>
          </div>
        ),
      },
      {
        fieldName: "Items",
        colStyle: {
          width: "200px ",
          justifyContent: "start",
          textAlign: "start",
        },
        render: (item: Model.UserOrder) => (
          <div className=" w-[200px] sm:text-[14px] text-xs  flex items-center justify-start gap-1 text-[var(--dark-text)]">
            <p>
              {item.id == selectedId && isCollapsed
                ? item.products.map(
                    (product) => `${product.name}* ${product.quantity} ,`
                  )
                : item.products[0].name + " * " + item.products[0].quantity}
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
        colStyle: {
          width: "200px",
          justifyContent: "start",
          textAlign: "start",
        },
        render: (item: Model.UserOrder) => (
          <div className=" w-[200px] sm:text-[14px] text-xs flex flex-col items-start justify-center text-[var(--dark-text)] ">
            <span>{item.time}</span>
          </div>
        ),
      },
      {
        fieldName: "Status",
        colStyle: {
          width: "180px",
          justifyContent: "start",
          textAlign: "start",
        },
        render: (item: Model.UserOrder) => (
          <div
            className=" w-[180px] sm:text-[14px] text-xs  mb-2.5
            text-[var(--dark-text)]  "
          >
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
            <span>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </span>
          </div>
        ),
      },
      {
        fieldName: "Amount",
        colStyle: {
          width: "140px",
          justifyContent: "start",
          textAlign: "start",
        },
        render: (item: Model.UserOrder) => (
          <div className=" w-[140px] sm:text-[14px] text-xs  flex flex-col items-start justify-center text-[var(--dark-text)] ">
            <span>Rs. {item.amount}</span>
          </div>
        ),
      },
    ],
    [isCollapsed, selectedId]
  );

  const getUserOrders = async ({
    pageSize,
    currentFirstDoc,
    currentLastDoc,
    direction,
    sort,
  }: Common.FetchPaginate<keyof Model.Order>) => {
    setLoading(true);
    try {
      const response = await getOrderByUser({
        sort: sort,
        pageSize: pageSize,
        direction: direction,
        currentFirstDoc: currentFirstDoc || null,
        currentLastDoc: currentLastDoc || null,
      });
      const userOrder = response as {
        data: {
          length: number;
          orders: Model.Order[];
          currentFirstDoc: string;
          currentLastDoc: string;
        };
      };
      setCurrentDoc({
        currentFirstDoc: userOrder.data.currentFirstDoc,
        currentLastDoc: userOrder.data.currentLastDoc,
      });
      setTotalData(userOrder.data.length);
      const orderHistory = useAggregateUserOrder(userOrder.data.orders);
      setData((prevOrders) => {
        if (!prevOrders || prevOrders.length === 0) {
          return orderHistory; // Set the initial order if none exists
        }

        // Combine existing orders with new ones, ensuring no duplicate IDs
        const updatedOrders = [
          ...prevOrders,
          ...orderHistory.filter(
            (data) => !prevOrders.some((orderData) => orderData.id === data.id)
          ),
        ];

        return updatedOrders;
      });
    } catch (error) {
      // throw new Error("Error while fetching user-order");
    }
    setLoading(false);
  };

  useEffect(() => {
    getUserOrders({
      pageSize: pagination.perPage,
      filter: "orderId",
      sort: "desc",
      currentFirstDoc: null,
      currentLastDoc: null,
      direction: "next",
    });
  }, []);

  useEffect(() => {
    if (pagination.currentPage > 1 && pagination.direction) {
      getUserOrders({
        sort: "desc",
        pageSize: pagination.perPage,
        currentFirstDoc: currentDoc?.currentFirstDoc,
        currentLastDoc: currentDoc?.currentLastDoc,
        direction: pagination.direction,
      });
    }
  }, [pagination.currentPage, pagination.direction]);

  const downloadPdf = async (selectedOrder: Model.UserOrder) => {
    const doc = (
      <Invoice
        orders={[
          {
            orderDetails: {
              products: selectedOrder?.products as Ui.Product[],
              status: selectedOrder?.status as Model.OrderStatus,
            },
            invoiceData: {
              invoiceDate: dayjs(selectedOrder?.time).format(
                "	MMM D, YYYY h:mm A"
              ),
              invoiceNumber: selectedOrder!.id,
            },
            customerDetails: {
              name: store?.auth?.userInfo?.fullName as string,
              phoneNumber: parseInt(
                store?.auth?.userInfo?.phoneNumber as string
              ),
              userId: store?.auth?.userInfo?.uid as string,
            },
          },
        ]}
      ></Invoice>
    );
    const asBlob = await pdf(doc).toBlob();
    const url = URL.createObjectURL(asBlob);

    // Create a temporary anchor element
    const link = document.createElement("a");
    link.href = url;
    link.download = "invoice.pdf";
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="w-full h-full text-[var(--dark-text)] flex flex-col gap-6 bg-[var(--light-foreground)] px-5 py-4   rounded items-start justify-center">
      <h1 className="sm:text-[25px] text-[21px] font-semibold tracking-wider ">
        Order History
      </h1>

      <Table
        handlePageDirection={(direction) =>
          setPagination((prev) => ({ ...prev, direction: direction }))
        }
        actions={{
          orderFn: async (id: string) => {
            const findProduct = data?.find((order) => order.id === id);
            store?.cart?.products?.forEach(async (product: Ui.Product) => {
              await removeProductFromCart(
                store?.auth?.userInfo?.uid as string,
                product.id
              );
              dispatch(removeCart(product.id));
            });

            findProduct?.products.forEach(async (product) => {
              await addProductToCart(
                store?.auth?.userInfo?.uid as string,
                product.id
              );
              dispatch(addToCart({ ...product }));
            });
            navigate("/cart/checkout");
          },
          downloadFn: (id: string) => {
            const findOrder = data?.find((order) => order.id === id);
            downloadPdf(findOrder as Model.UserOrder);
          },
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
        data={data as Model.UserOrder[]}
        totalData={(totalData as number) || 1}
        loading={loading}
      />
    </div>
  );
};
