import { ChevronUp, Download, Filter, Trash2, X } from "lucide-react";
import { DropDown } from "../../Components/Common/DropDown/DropDown";
import { useCallback, useEffect, useState } from "react";
import { getOrders } from "../../Services";
import { Order, OrderModal } from "../../models/order.model";
import { debounce } from "../../Utility/Debounce";
import { SearchOrder } from "../../Utility/Search";
import { getFullName } from "../../Utility/Utils";
import { convertIsoToReadableDateTime } from "../../Utility/DateUtils";
import { FilterButton } from "../../Components/Common/Sorting/Sorting";
import { DatePicker } from "../../Components/DatePicker/DatePicker";
import { OrderTable } from "./OrderTable";

const OrderList = () => {
  const [initialOrders, setInitialOrders] = useState<OrderModal[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [originalData, setOriginalData] = useState<OrderModal[]>([]);
  const [sortOrder, setSortOrder] = useState({ field: "", order: "desc" });
  const [pagination, setPagination] = useState<{
    currentPage: number;
    perPage: number;
  }>({ currentPage: 1, perPage: 3 });
  const [currentDoc, setCurrentDoc] = useState<{
    currentFirstDoc: string;
    currentLastDoc: string;
  }>();

  const getAllOrders = async () => {
    setLoading(true);
    try {
      //  get total orders data from  server
      const orders = (await getOrders({
        path: "customerLogs",
        pageSize: pagination.perPage,
        filter: "orderId",
        sort: "asc",
        direction: "next",
      })) as {
        currentFirstDoc: string;
        currentLastDoc: string;
        orders: Order[];
      };

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
  const handleSelect = async (value: string) => {
    const newOrder = sortOrder.order === "asc" ? "desc" : "asc";

    let sortedCustomers;
    // if (value === "Requested") {
    //   sortedCustomers = [...initialOrders].sort((a: OrderModal, b: any) => {
    //     const dateA = parseDateString(a.orderRequest.);
    //     const dateB = parseDateString(b.Requested);
    //     return newOrder === "desc"
    //       ? dateB.getTime() - dateA.getTime()
    //       : dateA.getTime() - dateB.getTime();
    //   });
    // }
    if (value === "Name") {
      sortedCustomers = [...initialOrders].sort(
        (a: OrderModal, b: OrderModal) =>
          newOrder === "desc"
            ? b.name.localeCompare(a.name)
            : a.name.localeCompare(b.name)
      );
    }
    if (value === "Status") {
      sortedCustomers = [...initialOrders].sort(
        (a: OrderModal, b: OrderModal) =>
          newOrder === "desc"
            ? b.status.localeCompare(a.status)
            : a.status.localeCompare(b.status)
      );
    }

    setSortOrder({ field: value, order: newOrder });
    setInitialOrders(sortedCustomers as OrderModal[]);
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
    (async () => {
      getAllOrders();
    })();
  }, []);

  useEffect(() => {
    if (sortOrder.field === "") {
      setInitialOrders(originalData);
    }
  }, [sortOrder.field, originalData]);

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
            <DropDown
              children={
                <>
                  <Filter className="size-4 text-[var(--dark-secondary-text)]" />
                  <span className="text-[var(--dark-secondary-text)]">
                    Filter
                  </span>
                </>
              }
              options={[
                <FilterButton
                  onSelect={handleSelect}
                  sortOrder={sortOrder.order}
                  sortingOptions={["Name", "Status", "Requested"]}
                />,
                <DatePicker />,
              ]}
              style={{
                display: "flex",
                fontSize: "15px",
                borderRadius: "4px",
                padding: "0.5rem 1rem 0.5rem 1rem",
                color: "var(--dark-text)",
                border: "1px solid var(--light-secondary-text)  ",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                background: "",
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
        {sortOrder.field && (
          <div className="flex w-[120px]  items-center rounded-lg border  justify-between p-2">
            <div className="flex gap-1 items-center justify-center">
              <span className="  text-sm ">
                {sortOrder.field.toLowerCase()}
              </span>
              <p
                className={` duration-150 ${
                  sortOrder?.order === "desc"
                    ? "rotate-180"
                    : sortOrder.order === "asc"
                    ? ""
                    : ""
                } `}
              >
                <ChevronUp size={20} />
              </p>
            </div>
            <button onClick={() => setSortOrder({ field: "" })} className=" ">
              <X className="text-[var(--danger-text)] " size={20} />
            </button>
          </div>
        )}
      </div>
      <OrderTable
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
