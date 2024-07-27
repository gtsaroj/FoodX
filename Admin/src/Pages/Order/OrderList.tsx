import {
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Download,
  Filter,
  Trash,
  Trash2,
} from "lucide-react";
import { DropDown } from "../../Components/Common/DropDown/DropDown";
import { useCallback, useEffect, useState } from "react";
import { getOrders } from "../../Services";
import { Order, OrderModal } from "../../models/order.model";
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
import { ColumnProps } from "../../models/table.model";
import Delete from "../../Components/Common/Delete/Delete";
import Modal from "../../Components/Common/Popup/Popup";
import UpdateOrder from "../../Components/Upload/UpdateOrder";

const OrderList = () => {
  const [initialOrders, setInitialOrders] = useState<OrderModal[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(true);
  const [status, setStatus] = useState<string>();
  const [id, setId] = useState<string>();

  const [sortOrder, setSortOrder] = useState({ field: "", order: "desc" });
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState<string>();

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

      setInitialOrders(getaggregateDataPromises);
    } catch (error) {
      setLoading(false);

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
  const Columns: ColumnProps[] = [
    {
      fieldName: (
        <div className=" w-[30px] text-start">
          <input className="w-4 h-4 cursor-pointer" type="checkbox" />
        </div>
      ),
      render: () => (
        <div className="w-[30px]  ">
          <input className="w-4 h-4 cursor-pointer" type="checkbox" />
        </div>
      ),
    },
    {
      fieldName: "Id",
      colStyle: { width: "100px", textAlign: "start",},
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
      colStyle: { width: "180px ", justifyContent: "start", textAlign: "start" },
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

  const handleChange = (value: string) => {
    const filterOrder = SearchOrder(initialOrders, value);
    if (value?.length === 0) getAllOrders();
    setInitialOrders(filterOrder);
  };

  const handleEdit = async (value: string, uid?: string) => {
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
      await deleteOrderFromDatabase(orderId as string);
      await getAllOrders();
      toast.dismiss(toastLoading);
      toast.success("Order deleted!");
      setIsDelete(false);
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
    initialOrders?.forEach((order) => {
      setSelectedProducts(order.products[0]);
    });
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
      <div className="flex items-center justify-start gap-2 w-full pb-5">
        <form action="" className="relative">
          <input
            id="search"
            type="search"
            onChange={(event) => debouncedHandleChange(event?.target.value)}
            className=" border placeholder:text-sm placeholder:text-[var(--dark-secondary-text)] outline-none sm:w-[300px] w-full py-2 px-2  border-[var(--dark-secondary-background)] bg-[var(--light-background)] rounded-lg  focus:border-[var(--primary-color)] "
            placeholder="Search"
          />
        </form>
        <div className="h-10  w-[1px] bg-gray-300 "></div>
        <div>
          <Trash2 className="size-7"/>
         </div>
      </div>
      <div className="w-full overflow-auto rounded-t-md">
        <Table
          data={initialOrders as OrderModal[]}
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
    </div>
  );
};

export default OrderList;
