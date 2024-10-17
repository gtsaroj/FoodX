import { Download, Filter, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { getOrders } from "../../Services/order.services";
import {
  GetOrderModal,
  Order,
  OrderModal,
  status,
} from "../../models/order.model";
import { debounce } from "../../Utility/debounce";

import { OrderTable } from "./Order.table.page";
import { Button } from "../../Components/Common/Button/Button";
import dayjs from "dayjs";
import { getFullName, getUserInfo } from "../../Utility/user.utils";
import toast from "react-hot-toast";
import { Invoice, InvoiceDocumentProp } from "../../Invoice/Invoice";
import { Product } from "../../models/product.model";
import Modal from "../../Components/Common/Popup/Popup";
import { socket } from "../../Utility/socket.util";

const OrderList = () => {
  const [initialOrders, setInitialOrders] = useState<OrderModal[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalData, setTotalData] = useState<number>();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [pagination, setPagination] = useState<{
    currentPage: number;
    perPage: number;
    pageDirecton?: "prev" | "next";
  }>({ currentPage: 1, perPage: 5 });
  const [currentDoc, setCurrentDoc] = useState<{
    currentFirstDoc: string;
    currentLastDoc: string;
  }>();
  const [filter, setFilter] = useState<{
    // dateFilter?: any;
    sortFilter?: { id?: string; sort?: string };
  }>();
  const [isExport, setIsExport] = useState<boolean>(true);
  const [exportSelectedOrder, setExportSelectedOrder] = useState<string[]>([]);
  const [haveUserId, setHaveUserId] = useState<string>();

  const getAllOrders = async (data: GetOrderModal) => {
    setLoading(true);
    try {
      const orders = await getOrders({
        pageSize: data.pageSize,
        currentFirstDoc: data.currentFirstDoc || null,
        currentLastDoc: data.currentLastDoc || null,
        filter: data.filter,
        sort: data.sort,
        userId: data.userId,
      });

      const allOrder = (await orders.data) as {
        currentFirstDoc: string;
        currentLastDoc: string;
        orders: Order[];
        length: number;
      };
      setTotalData(allOrder.length);
      setCurrentDoc({
        currentFirstDoc: allOrder.currentFirstDoc,
        currentLastDoc: allOrder.currentLastDoc,
      });
      const aggregateData = allOrder?.orders.map(async (item, index) => {
        const getUserName = await getFullName(item.uid as string);
        return {
          uid: item.uid,
          id: item.orderId as string,
          name: getUserName || "User",
          products: item.products,
          rank: (pagination.currentPage - 1) * pagination.perPage + (index + 1),
          orderRequest: dayjs(item.orderRequest).format("YYYY-MM-DD"),
          orderFullfilled: dayjs(item.orderFullfilled).format("YYYY-MM-DD"),
          status: item.status,
        };
      });

      const getaggregateDataPromises = await Promise.all(aggregateData);
      setInitialOrders(getaggregateDataPromises as OrderModal[]);
    } catch (error) {
      setLoading(false);
      setInitialOrders([])
    }
    setLoading(false);
  };

  const handleChange = (value: string) => {
    setHaveUserId(value);
  };

  const debouncedHandleChange = useCallback(debounce(handleChange, 400), [
    initialOrders,
  ]);

  const exportAllOrder = (isCheckedAll: boolean) => {
    if (!isCheckedAll) {
      return setExportSelectedOrder([]);
    }
    const selectedOrder_Ids = initialOrders?.map((order) => order.id);
    setExportSelectedOrder(selectedOrder_Ids as string[]);
  };

  const exportSelectedOrderFn = (id: string, isChecked: boolean) => {
    if (id && !isChecked) {
      return setExportSelectedOrder((prev) =>
        prev.filter((value) => value !== id)
      );
    }
    const selectedOrders = initialOrders?.filter((order) => order.id === id);
    const order_Ids = selectedOrders?.map((order) => order.id);
    if (selectedOrders.length === 0) return toast.error("Order not found");
    setExportSelectedOrder((prev) => [...prev, ...(order_Ids as string[])]);
  };

  useEffect(() => {
    getAllOrders({
      pageSize: pagination.perPage,
      currentFirstDoc: null,
      currentLastDoc: null,
      filter: (filter?.sortFilter?.sort as keyof Order) || "uid",
      sort: sortOrder || "asc",
      userId: haveUserId || undefined,
    });
  }, [pagination.perPage, sortOrder, filter?.sortFilter, haveUserId]);

  useEffect(() => {
    if (pagination.currentPage > 1 && pagination.pageDirecton) {
      setLoading(true);
      const fetchNextPage = async () => {
        setLoading(true);
        try {
          const orders = await getOrders({
            pageSize: pagination.perPage,
            currentLastDoc: currentDoc && currentDoc.currentLastDoc,
            currentFirstDoc: currentDoc && currentDoc.currentFirstDoc,
            filter: (filter?.sortFilter?.sort as keyof Order) || "uid",
            sort: sortOrder || "desc",
            direction: pagination.pageDirecton || "next",
            userId: haveUserId || undefined,
          });
          const getAllOrder = orders.data as {
            currentFirstDoc: string;
            currentLastDoc: string;
            orders: Order[];
            length: number;
          };
          setCurrentDoc({
            currentFirstDoc: getAllOrder.currentFirstDoc,
            currentLastDoc: getAllOrder.currentLastDoc,
          });
          setTotalData(getAllOrder.length);
          const aggregateData = getAllOrder?.orders.map(async (item, index) => {
            const getUserName = await getFullName(item.uid as string);

            return {
              uid: item.uid,
              id: item.orderId as string,
              name: getUserName || "User",
              products: item.products,
              rank:
                (pagination.currentPage - 1) * pagination.perPage + (index + 1),
              orderRequest: dayjs(item.orderRequest).format(
                " YYYY MMM D, h:mm A"
              ),

              delivered:
                (item.orderFullfilled &&
                  dayjs(item.orderFullfilled).format(" YYYY MMM D, h:mm A")) ||
                "",
              status: item.status,
            };
          });
          const getaggregateDataPromises = await Promise.all(aggregateData);
          setInitialOrders((prev: any) => {
            return [
              ...prev,
              ...getaggregateDataPromises.filter(
                (order) =>
                  !prev.some((data: OrderModal) => data.id === order.id)
              ),
            ];
          });
        } catch (error) {
          setInitialOrders([]);
        }
        setLoading(false);
      };

      fetchNextPage();
    }
  }, [
    pagination.currentPage,
    pagination.perPage,
    sortOrder,
    pagination.pageDirecton,
    filter?.sortFilter?.sort,
    haveUserId
  ]);

  useEffect(() => {
    const handleNewOrder = async (order: Order) => {
      // Assuming getFullName is asynchronous
      const userName = await getFullName(order.uid as string);
      setInitialOrders((prev) => [
        {
          id: order.orderId as string,
          name: userName as string,
          orderRequest: dayjs(order.orderRequest).format(
            "YYYY MMM D, h:mm A"
          ) as string,
          orderFullfilled: dayjs(order.orderFullfilled).format(
            "YYYY MMM D, h:mm A"
          ) as string,
          products: order.products as Product[],
          rank: 1,
          status: order.status as keyof status["status"],
        },
        ...prev.map((o) => ({ ...o, rank: o.rank! + 1 })),
      ]);
      toast.success(`${userName} was orderered products.`);
    };
    // Listen for the 'new_order' event
    socket.on("new_order", handleNewOrder);

    // Cleanup listener when component unmounts
    return () => {
      socket.off("new_order", handleNewOrder);
    };
  }, []);

  const [resolvedOrders, setResolvedOrders] = useState<
    InvoiceDocumentProp["orders"]
  >([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const resolvedOrders = await Promise.all(
        exportSelectedOrder.map(async (order) => {
          const matchedOrder = initialOrders?.find((od) => od.id === order);

          if (!matchedOrder) {
            return null;
          }

          const user = await getUserInfo(matchedOrder.uid as string);

          return {
            orderDetails: {
              products: matchedOrder?.products,
              status: matchedOrder?.status,
            },
            customerDetails: {
              name: matchedOrder?.name as string,
              phoneNumber: user?.phoneNumber || "N/A", // Ensure correct type for phoneNumber
              userId: matchedOrder?.uid || "N/A",
            },
            invoiceData: {
              invoiceDate: matchedOrder?.orderRequest || "N/A",
              invoiceNumber: order,
            },
          };
        })
      );

      // Filter out null values and update the state
      setResolvedOrders(resolvedOrders as InvoiceDocumentProp["orders"]);
    };

    fetchOrders();
  }, [exportSelectedOrder, initialOrders]);

  return (
    <div className="flex flex-col items-start justify-center w-full gap-5 px-5 py-4 rounded-sm">
      <div className="flex sm:flex-row flex-col gap-3 items-end sm:items-center justify-between w-full pt-5">
        <div className="flex w-full text-start flex-col -space-y-1.5 items-start justify-center gap-1">
          <h4 className="text-[1.25rem] font-[600] tracking-wider text-[var(--dark-text)]">
            All Orders
          </h4>
          <p className="text-[15px] tracking-wider text-[var(--dark-secondary-text)] text-nowrap ">
            {totalData || 0} entries found
          </p>
        </div>
        <div className="flex items-center justify-center gap-5 ">
          <div className="flex items-center justify-center gap-2">
            <button
              disabled={!exportSelectedOrder.length}
              onClick={() => setIsExport(!isExport)}
              className="flex items-center gap-2 justify-center bg-[var(--primary-color)] text-white py-[0.5rem] border-[1px] border-[var(--primary-color)] px-4 rounded"
            >
              <Download strokeWidth={2.5} className="size-5" />
              <p className="text-[16px]   tracking-widest ">Export</p>
            </button>
            <Button
              selectedCheck={[filter?.sortFilter?.id as string]}
              sortFn={(value) => setSortOrder(value)}
              bodyStyle={{
                width: "400px",
                top: "3rem",
                left: "-18rem",
              }}
              parent={
                <div className="flex border-[1px] border-[var(--dark-border)] px-4 py-2 rounded items-center justify-start gap-2">
                  <Filter
                    strokeWidth={2.5}
                    className="size-5 text-[var(--dark-secondary-text)]"
                  />
                  <p className="text-[16px] text-[var(--dark-secondary-text)] tracking-widest ">
                    Filter
                  </p>
                </div>
              }
              sort={[
                { label: "Requested", value: "orderRequest", id: "jfhkdj" },
                { label: "Name", value: "uid", id: "fkdsj" },
                {
                  label: "Rank",
                  value: "status",
                  id: "kfljdsfsdf",
                },
              ]}
              checkFn={{
                checkSortFn: (isChecked, value, id) => {
                  if (!isChecked) {
                    return setFilter((prev) => ({
                      ...prev,
                      sortFilter: { id: "", sort: "" },
                    }));
                  }
                  if (isChecked) {
                    setFilter((prev) => ({
                      ...prev,
                      sortFilter: { id: id, sort: value },
                    }));
                  }
                },
              }}
            />
          </div>
        </div>
      </div>
      <div className="flex sm:flex-row flex-col items-start sm:items-start   justify-start gap-8 sm:gap-5 w-full px-1">
        <form
          action=""
          className="relative sm:w-auto w-full text-[var(--dark-text)]  "
        >
          <input
            id="search"
            type="search"
            onChange={(event) => debouncedHandleChange(event?.target.value)}
            className=" border placeholder:tracking-wider placeholder:text-[16px] placeholder:text-[var(--dark-secondary-text)] outline-none sm:w-[300px] w-full py-2 px-2  border-[var(--dark-border)] bg-[var(--light-background)] rounded-lg  ring-[var(--primary-color)] focus:ring-[3px] duration-150 "
            placeholder="Search for products"
          />
        </form>
        {filter?.sortFilter?.sort && (
          <div className="flex items-center rounded-md border-[1px] border-[var(--dark-border)]  justify-between px-1 gap-2 py-1  ">
            <div className="flex  items-center justify-center">
              <span className="  text-[15px] text-[var(--dark-secondary-text)] ">
                {filter.sortFilter.sort &&
                  filter.sortFilter.sort.charAt(0).toUpperCase() +
                    filter?.sortFilter?.sort.slice(1).toLocaleLowerCase()}
              </span>
            </div>
            <button
              onClick={() =>
                setFilter((prev) => ({
                  ...prev,
                  sortFilter: { id: "", sort: "" },
                }))
              }
              className=" "
            >
              <X className="text-[var(--danger-text)] " size={20} />
            </button>
          </div>
        )}
      </div>
      <OrderTable
        handlePageDirection={(pageDirection) =>
          setPagination((prev) => ({ ...prev, pageDirecton: pageDirection }))
        }
        selectedData={exportSelectedOrder}
        action={{
          checkAllFn: (isChecked: boolean) => exportAllOrder(isChecked),
          checkFn: (id: string, isChecked: boolean) =>
            exportSelectedOrderFn(id, isChecked),
        }}
        totalData={(totalData as number) || 1}
        pagination={{
          currentPage: pagination.currentPage,
          perPage: pagination.perPage,
        }}
        onPageChange={(page) =>
          setPagination((prev) => ({ ...prev, currentPage: page }))
        }
        orders={initialOrders}
        loading={loading}
      />
      {!isExport && exportSelectedOrder.length > 0 && (
        <Modal
          close={isExport}
          isExport={true}
          closeModal={() => setIsExport(!isExport)}
        >
          <Invoice orders={resolvedOrders} />
        </Modal>
      )}
    </div>
  );
};

export default OrderList;
