import { ChevronUp, Download, Filter, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { getOrders } from "../../Services";
import { Order, OrderModal } from "../../models/order.model";
import { debounce } from "../../Utility/Debounce";
import { SearchOrder } from "../../Utility/Search";
import { getFullName } from "../../Utility/Utils";
import { convertIsoToReadableDateTime } from "../../Utility/DateUtils";
import { FilterButton } from "../../Components/Common/Sorting/Sorting";
import { OrderTable } from "./OrderTable";
import { Button } from "../../Components/Common/Button/Button";
import { BiCategory } from "react-icons/bi";
import { GetOrderModal } from "../../../../backend/src/models/order.model";

const OrderList = () => {
  const [initialOrders, setInitialOrders] = useState<OrderModal[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [originalData, setOriginalData] = useState<OrderModal[]>([]);
  const [totalData, setTotalData] = useState<number>();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">();
  const [pagination, setPagination] = useState<{
    currentPage: number;
    perPage: number;
  }>({ currentPage: 1, perPage: 3 });
  const [currentDoc, setCurrentDoc] = useState<{
    currentFirstDoc: string;
    currentLastDoc: string;
  }>();
  const [isFilter, setIsFiltered] = useState<string | undefined>();

  const getAllOrders = async (data: GetOrderModal) => {
    setLoading(true);
    try {
      //  get total orders data from  server
      const orders = (await getOrders({
        pageSize: data.pageSize,
        filter: data.filter,
        sort: data.sort,
        direction: data.direction,
      })) as {
        currentFirstDoc: string;
        currentLastDoc: string;
        orders: Order[];
        length: number;
      };
      setTotalData(orders.length);
      setCurrentDoc((prev) => ({
        ...prev,
        currentFirstDoc: orders.currentFirstDoc,
        currentLastDoc: orders.currentLastDoc,
      }));
      const aggregateData = orders?.orders.map(async (item) => {
        let getUserName = await getFullName(item?.uid);
        const getDate = convertIsoToReadableDateTime(
          item.orderRequest as string
        );

        if (!getUserName) getUserName = "Student";
        const productNames = item.products?.map(
          (product) =>
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
      setOriginalData(getaggregateDataPromises as any);
      setInitialOrders(getaggregateDataPromises as any);
    } catch (error) {
      setLoading(false);

      throw new Error("Unable to display orders data" + error);
    }
    setLoading(false);
  };
  const handleSelect = async (isChecked: boolean, value: string) => {
    if (value === "rank" && isChecked) {
      await getAllOrders({
        filter: "orderId",
        pageSize: pagination.perPage,
        sort: sortOrder as "asc" | "desc",
        direction: "next",
        currentFirstDoc: currentDoc?.currentFirstDoc,
      });
    }
    if (value === "status" && isChecked) {
      await getAllOrders({
        filter: "orderId",
        pageSize: pagination.perPage,
        sort: sortOrder as "asc" | "desc",
        direction: "next",
        currentFirstDoc: currentDoc?.currentFirstDoc,
      });
    }
  };

  const handleChange = (value: string) => {
    const filterOrder = SearchOrder(initialOrders, value);
    if (value?.length === 0) getAllOrders();
    setInitialOrders(filterOrder);
  };

  // const handleEdit = async (value: string, uid?: string) => {
  //   try {
  //     const toastLoading = toast.loading("Status updating");
  //     await updateOrderStatus(value, uid);
  //     await getAllOrders();
  //     toast.dismiss(toastLoading);
  //     toast.success("Updated status");
  //   } catch (error) {
  //     throw new Error("Unable to update order status");
  //   }
  // };

  const debouncedHandleChange = useCallback(debounce(handleChange, 350), [
    initialOrders,
  ]);

  useEffect(() => {
    if (
      initialOrders.length < 0 ||
      !isFilter?.length 
    ) {
      getAllOrders({
        filter: "orderId",
        pageSize: pagination.perPage,
        sort: "asc",
        direction: "next",
        currentFirstDoc: currentDoc?.currentFirstDoc,
      });
    }
  }, [initialOrders.length, isFilter?.length, currentDoc?.currentFirstDoc, pagination.perPage]);

  useEffect(() => {
    if (
      pagination.perPage > 1 &&
      currentDoc?.currentFirstDoc &&
      currentDoc?.currentFirstDoc.length > 0
    ) {
      const fetchNextPage = async () => {
        const getAllOrder = (await getOrders({
          filter: "orderId",
          pageSize: pagination.perPage,
          sort: "asc",
          currentFirstDoc: currentDoc.currentFirstDoc,
        })) as {
          currentFirstDoc: string;
          currentLastDoc: string;
          orders: Order[];
        };

        setCurrentDoc((prev) => ({
          ...prev,
          currentFirstDoc: getAllOrder.currentFirstDoc,
          currentLastDoc: getAllOrder.currentLastDoc,
        }));

        const aggregateData = getAllOrder?.orders.map(async (item) => {
          let getUserName = await getFullName(item?.uid);
          const getDate = convertIsoToReadableDateTime(
            item.orderRequest as string
          );

          if (!getUserName) getUserName = "Student";
          const productNames = item.products?.map(
            (product) =>
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
        setInitialOrders((prev) => {
          return [
            ...prev,
            ...getaggregateDataPromises.filter(
              (order) => !prev.some((data) => data.id === order.id)
            ),
          ];
        });

        setOriginalData(getaggregateDataPromises as any);
      };

      fetchNextPage();
    }
  }, [pagination.perPage, pagination.currentPage, currentDoc?.currentFirstDoc]);

  async function handleOrderFilter(orderStatus: string) {
    setIsFiltered(orderStatus);
    if (orderStatus === "Recieved") {
      await getOrders({
        filter: "uid",
        pageSize: pagination.perPage,
        sort: "asc",
        currentFirstDoc: currentDoc?.currentFirstDoc,
        direction: "next",
        // status: "Received",
      });
    }
    if (orderStatus === "Pending") {
      await getOrders({
        filter: "uid",
        pageSize: pagination.perPage,
        sort: "asc",
        currentFirstDoc: currentDoc?.currentFirstDoc,
        direction: "next",
        // status: "Pending",
      });
    }
    if (orderStatus === "Delivered") {
      await getOrders({
        filter: "uid",
        pageSize: pagination.perPage,
        sort: "asc",
        currentFirstDoc: currentDoc?.currentFirstDoc,
        direction: "next",
        // status: "Delivered",
      });
    }
    if (orderStatus === "Preparing") {
      await getOrders({
        filter: "uid",
        pageSize: pagination.perPage,
        sort: "asc",
        currentFirstDoc: currentDoc?.currentFirstDoc,
        direction: "next",
        // status: "Preparing",
      });
    }
    if (orderStatus === "Canceled") {
      await getOrders({
        filter: "uid",
        pageSize: pagination.perPage,
        sort: "asc",
        currentFirstDoc: currentDoc?.currentFirstDoc,
        direction: "next",
        // status: "Canceled",
      });
    }
  }

  return (
    <div className="flex flex-col items-start justify-center w-full gap-5 px-5 py-4 rounded-sm">
      <div className="flex items-center justify-between w-full pt-5">
        <div className="flex flex-col items-start justify-center gap-1">
          <h4 className="text-xl tracking-wider text-[var(--dark-text)]">
            Orders
          </h4>
        </div>
        <div className="flex items-center justify-center gap-5 ">
          <div className="flex items-center justify-center gap-2">
            <button className="flex items-center gap-2 justify-center bg-[var(--primary-color)] text-[var(--light-foreground)] py-[0.5rem] border-[1px] border-[var(--primary-color)] px-4 rounded">
              <Download className="size-4" />
              <p className="text-[15px]">Export</p>
            </button>
            <Button
              sortFn={(value) => setSortOrder(value)}
              bodyStyle={{
                width: "400px",
                top: "3.5rem",
                left: "-18rem",
              }}
              parent={
                <div className="flex border px-4 py-2 rounded items-center justify-start gap-3">
                  <Filter className="size-5 text-[var(--dark-secondary-text)]" />
                  <span className=" text-[17px] tracking-wide text-[var(--dark-secondary-text)]">
                    Filter
                  </span>
                </div>
              }
              sort={[
                { label: "Status", value: "status", id: "jfhkdj" },
                { label: "Rank", value: "rank", id: "fkdsj" },
              ]}
              checkFn={(isChecked: boolean, value: any) =>
                handleSelect(isChecked, value)
              }
            />
          </div>
        </div>
      </div>
      <div className="flex sm:flex-row flex-col items-start sm:items-center justify-start gap-8 sm:gap-2 w-full px-1">
        <form action="" className="w-full sm:w-auto">
          <input
            id="search"
            type="search"
            onChange={(event) => debouncedHandleChange(event?.target.value)}
            className=" border placeholder:text-sm placeholder:text-[var(--dark-secondary-text)] outline-none sm:w-[300px] w-full py-2 px-2  border-[var(--dark-secondary-background)] bg-[var(--light-background)] rounded-lg  focus:border-[var(--primary-color)] "
            placeholder="Search"
          />
        </form>
        {isFilter && (
          <div className="flex w-[150px]  items-center rounded-lg border  justify-between p-2">
            <div className="flex gap-1 items-center justify-center">
              <span className="  text-sm ">{isFilter.toLowerCase()}</span>
              <p
                className={` duration-150 ${
                  sortOrder === "desc"
                    ? "rotate-180"
                    : sortOrder === "asc"
                    ? ""
                    : ""
                } `}
              >
                <ChevronUp size={20} />
              </p>
            </div>
            <button onClick={() => setIsFiltered(undefined)} className=" ">
              <X className="text-[var(--danger-text)] " size={20} />
            </button>
          </div>
        )}
      </div>
      <OrderTable
        totalData={totalData as number}
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
    </div>
  );
};

export default OrderList;
