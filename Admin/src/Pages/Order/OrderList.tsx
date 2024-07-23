import { Download, Filter, Search } from "lucide-react";
import { DropDown } from "../../Components/Common/DropDown/DropDown";
import { useCallback, useEffect, useState } from "react";
import { getOrders } from "../../Services";
import { Order, OrderModelType } from "../../models/order.model";
import {
  deleteOrderFromDatabase,
  updateOrderStatus,
} from "../../firebase/order";
import Table from "../../Components/Common/Table/Table";
import { debounce } from "../../Utility/Debounce";
import { SearchOrder } from "../../Utility/Search";
import { getFullName } from "../../Utility/Utils";
import toast, { Toaster } from "react-hot-toast";
import {
  convertIsoToReadableDateTime,
  parseDateString,
} from "../../Utility/DateUtils";
import { FilterButton } from "../../Components/Common/Sorting/Sorting";
import { DatePickerDemo } from "../../Components/DatePicker/DatePicker";

const OrderList = () => {
  const [initialOrders, setInitialOrders] = useState<OrderModelType[]>([]);
  const [orderHeader, setOrderHeader] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [sortOrder, setSortOrder] = useState({ field: "", order: "desc" });

  const getAllOrders = async () => {
    setLoading(true);
    try {
      //  get total orders data from  server
      const orders = await getOrders();
      const totalOrders = orders.data as Order[];
      const aggregateData: OrderModelType[] = totalOrders?.map(async (item) => {
        const getUserName = await getFullName(item?.uid);
        const getDate = convertIsoToReadableDateTime(
          item.orderRequest as string
        );
        if (getUserName) {
          const productNames = item.products?.map(
            (product) =>
              (product.name as string) + " × " + product.quantity + ", "
          );
          return {
            ID: item.orderId,
            Name: getUserName,
            Products: productNames,
            Requested: `${getDate.date.substring(5, getDate.date.length)} | ${
              getDate.time
            }`,
            Fulfilled: item.orderFullFilled,
            Status: item.status,
          };
        }
      });
      const getaggregateDataPromises = await Promise.all(aggregateData);

      if (getaggregateDataPromises)
        setInitialOrders(getaggregateDataPromises as OrderModelType[]);
    } catch (error) {
      setLoading(false);
      setError(true);
      throw new Error("Unable to display orders data" + error);
    }
    setLoading(false);
  };

  const handleSelect = async (value: string) => {
    const newOrder = sortOrder.order === "asc" ? "desc" : "asc";

    let sortedCustomers;
    if (value === "Requested") {
      sortedCustomers = [...initialOrders].sort((a: any, b: any) => {
        const dateA = parseDateString(a.Requested);
        const dateB = parseDateString(b.Requested);
        return newOrder === "desc"
          ? dateB.getTime() - dateA.getTime()
          : dateA.getTime() - dateB.getTime();
      });
    }
    if (value === "Name") {
      sortedCustomers = [...initialOrders].sort((a: any, b: any) =>
        newOrder === "desc"
          ? b.Name.localeCompare(a.Name)
          : a.Name.localeCompare(b.Name)
      );
    }
    if (value === "Status") {
      sortedCustomers = [...initialOrders].sort((a: any, b: any) =>
        newOrder === "desc" ? b.Status - a.Status : a.Status - b.Status
      );
    }

    setSortOrder({ field: value, order: newOrder });
    setInitialOrders(sortedCustomers as OrderModelType[]);
  };

  const handleChange = (value: string) => {
    const filterOrder = SearchOrder(initialOrders, value);
    if (value?.length === 0) getAllOrders();
    setInitialOrders(filterOrder);
  };

  const changeOrderStatus = async (value: string, uid: string) => {
    try {
      const toastLoading = toast.loading("Status updating");
      await updateOrderStatus(value, uid);
      await getAllOrders();
      toast.dismiss(toastLoading);
      toast.success("Updated status");
    } catch (error) {
      throw new Error("Unable to update order status");
    }
  };

  const handleDelete = async (orderId: string) => {
    if (!orderId) throw new Error("orderId not found");
    try {
      const toastLoading = toast.loading("Order deleting...");
      await deleteOrderFromDatabase(orderId);
      await getAllOrders();
      toast.dismiss(toastLoading);  
      toast.success("Order deleted!");
    } catch (error) {
      throw new Error("Unable to delete order" + error);
    }
  };

  const debouncedHandleChange = useCallback(debounce(handleChange, 350), [
    initialOrders,
  ]);

  useEffect(() => {
    (async () => {
      getAllOrders();
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        if (initialOrders.length > 0) {
          const headersOfOrder = initialOrders[0];
          const keys = Object.keys(headersOfOrder);
          keys.push("Button");
          setOrderHeader(keys);
        }
      } catch (error) {
        throw new Error(error as any);
      }
    })();
  }, [initialOrders]);

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
                <DatePickerDemo />,
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
      <div className="flex items-center justify-start w-full pb-5">
        <form action="" className="relative w-full">
          <input
            id="search"
            type="search"
            onChange={(event) => debouncedHandleChange(event?.target.value)}
            className=" border placeholder:text-sm placeholder:text-[var(--dark-secondary-text)] outline-none sm:w-[300px] w-full py-2 px-2  border-[var(--dark-secondary-background)] bg-[var(--light-background)] rounded-lg  focus:border-[var(--primary-color)] "
            placeholder="Search"
          />
        </form>
      </div>
      <div className="w-full overflow-auto rounded-t-md">
        <Table
          loading={loading}
          error={error}
          onChange={(value: string, orderId: string) =>
            changeOrderStatus(value, orderId)
          }
          options={["Pending", "Canceled", "Recieved", "Delivered"]}
          actions={(value) => handleDelete(value)}
          pagination={{ currentPage: 1, perPage: 10 }}
          headerStyle={{
            gridTemplateColumns: "repeat(9,1fr) ",
          }}
          bodyStyle={{
            display: "grid",
            gridTemplateColumns: "repeat(9,1fr) ",
          }}
          data={initialOrders as Order[]}
          headers={orderHeader}
        />
      </div>
      <Toaster />
    </div>
  );
};

export default OrderList;
