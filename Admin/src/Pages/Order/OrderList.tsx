import { ChevronUp, Download, Filter, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { getOrders } from "../../Services";
import { Order, OrderModal } from "../../models/order.model";
import { debounce } from "../../Utility/Debounce";
import { SearchOrder } from "../../Utility/Search";
import { getFullName } from "../../Utility/Utils";
import { convertIsoToReadableDateTime } from "../../Utility/DateUtils";
import { OrderTable } from "./OrderTable";
import { Button } from "../../Components/Common/Button/Button";
import { GetOrderModal } from "../../../../backend/src/models/order.model";
import { order } from "../../../../frontend/src/Services";

const OrderList = () => {
  const [initialOrders, setInitialOrders] = useState<OrderModal[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
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
  const [isFilter, setIsFilter] = useState<{
    dateFilter?: any;
    sortFilter?: string;
  }>();

  const getAllOrders = async (data: GetOrderModal) => {
    setLoading(true);
    try {
      //  get total orders data from  server
      let orders;
      if (pagination.currentPage === 1) {
        orders = await getOrders({
          pageSize: data.pageSize,
          filter: data.filter,
          sort: data.sort,
          direction: data.direction,
          currentFirstDoc: data.currentFirstDoc || null,
          currentLastDoc: data.currentLastDoc || null,
        });
      }
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
      const aggregateData = allOrder?.orders.map(async (item) => {
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
      setInitialOrders(getaggregateDataPromises as any);
    } catch (error) {
      setLoading(false);
      throw new Error("Unable to display orders data" + error);
    }
    setLoading(false);
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
    getAllOrders({
      filter: (isFilter?.sortFilter as keyof Order) || "uid",
      pageSize: pagination.perPage,
      sort: sortOrder || "asc",
      direction: "next",
      currentFirstDoc: null,
      currentLastDoc: null,
    });
  }, [pagination.perPage, sortOrder, isFilter?.sortFilter]);

  useEffect(() => {
    if (
      pagination.currentPage > 1 &&
      currentDoc?.currentFirstDoc &&
      currentDoc?.currentLastDoc
    ) {
      console.log(
        pagination.currentPage,
        currentDoc.currentFirstDoc,
        currentDoc.currentLastDoc
      );
      const fetchNextPage = async () => {
        const orders = await getOrders({
          filter: (isFilter?.sortFilter as keyof Order) || "uid",
          pageSize: pagination.perPage,
          sort: sortOrder || "asc",
          currentFirstDoc: currentDoc.currentFirstDoc,
          currentLastDoc: currentDoc.currentLastDoc,
          direction: "next",
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
      };
      fetchNextPage();
    }
  }, [
    isFilter?.sortFilter,
    sortOrder,
    currentDoc?.currentFirstDoc,
    currentDoc?.currentLastDoc,
    pagination.currentPage,
    pagination.perPage,
  ]);

  return (
    <div className="flex flex-col items-start justify-center w-full gap-5 px-5 py-4 rounded-sm">
      <div className="flex items-center justify-between w-full pt-5">
        <div className="flex flex-col -space-y-1.5 items-start justify-center gap-1">
          <h4 className="text-[1.25rem] font-[600] tracking-wider text-[var(--dark-text)]">
            All Orders
          </h4>
          <p className="text-[15px] tracking-wider text-[var(--dark-secondary-text)] text-nowrap ">
            {totalData || 0} entries found
          </p>
        </div>
        <div className="flex items-center justify-center gap-5 ">
          <div className="flex items-center justify-center gap-2">
            <button className="flex items-center gap-2 justify-center bg-[var(--primary-color)] text-[var(--dark-text)] py-[0.5rem] border-[1px] border-[var(--primary-color)] px-4 rounded">
              <Download strokeWidth={2.5} className="size-5" />
              <p className="text-[16px]  tracking-widest ">
                Export
              </p>
            </button>
            <Button
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
                checkSortFn: (isChecked, value) => {
                  if (!isChecked) {
                    setIsFilter((prev) => ({ ...prev, sortFilter: "" }));
                  }
                  if (isChecked) {
                    setIsFilter((prev) => ({ ...prev, sortFilter: value }));
                  }
                },
              }}
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
        {isFilter?.sortFilter && (
          <div className="flex items-center rounded-md border  justify-between px-1 gap-2 py-1  ">
            <div className="flex  items-center justify-center">
              <span className="  text-[15px] text-[var(--dark-secondary-text)] ">
                {isFilter.sortFilter && isFilter.sortFilter}
              </span>
            </div>
            <button
              onClick={() =>
                setIsFilter((prev) => ({ ...prev, sortFilter: "" }))
              }
              className=" "
            >
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
