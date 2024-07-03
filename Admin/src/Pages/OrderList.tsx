import { Download, Filter, Search } from "lucide-react";
import data from "../data.json";
import { DropDown } from "../Components/Common/DropDown/DropDown";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { getOrders } from "../Services";
import { Order } from "../models/order.model";
import { deleteOrderFromDatabase } from "../firebase/oder";
import Table from "../Components/Common/Table/Table";
import { getUserData } from "../firebase/db";
import { debounce } from "../Utility/Debounce";
import { SearchProduct } from "../Utility/Search";
import { getFullName } from "../Utility/Utils";

const OrderList = () => {
  const [initialOrders, setInitialOrders] = useState<Order[]>([]);
  const { orderHeaders, orders } = data;

  const handleCheckboxChange = (
    rowIndex: number,
    colName: string,
    checked: boolean
  ) => {
    console.log(rowIndex, colName, checked);
  };

 const handleChange = (value: string) => {
    const filterOrder = SearchProduct(initialOrders, value);
    if (filterOrder) setInitialOrders(filterOrder);
  };

  const handleDelete = async (orderId: string) => {
    if (!orderId) throw new Error("orderId not found");
    try {
      const deleteOrder = await deleteOrderFromDatabase(orderId);
      console.log(deleteOrder);
    } catch (error) {
      throw new Error("Unable to delete order" + error);
    }
  };

  const debouncedHandleChange = useCallback(debounce(handleChange, 350), [
    initialOrders,
  ]);

  useEffect(() => {
    (async () => {
      try {
        //  get total orders data from  server
        const orders = await getOrders();
        const totalOrders = orders.data as Order[];
        const aggregateData = totalOrders?.map(async (item) => {
          const getUserName = await getFullName(item.uid);
          const productNames =  item.products?.map((product)=> product.name as string);
          return { ...item, uid: getUserName,products : productNames };
        });
        const getaggregateDataPromises = await Promise.all(aggregateData);

        if (getaggregateDataPromises)
          setInitialOrders(getaggregateDataPromises as Order[]);
      } catch (error) {
        throw new Error("Unable to display orders data" + error);
      }
    })();
  }, []);

  return (
    <div className="w-full py-6 flex rounded-sm  flex-col gap-16 items-start justify-center px-4">
      <div className="flex sm:flex-row flex-col-reverse items-start gap-5 sm:gap-2 sm:items-center justify-between  w-full">
        <form action="" className="relative w-full">
          <Search className="absolute top-3 cursor-pointer text-[var(--dark-secondary-text)]   size-5 left-2" />
          <input
            type="search"
            onChange={(event) => debouncedHandleChange(event.target.value)}
            className=" pl-9 border-[1px] placeholder:text-sm outline-none w-full sm:w-[300px] rounded py-2 px-8 border-[var(--dark-secondary-text)] "
            placeholder="Search"
          />
        </form>
        <div className="flex items-center justify-center gap-4">
          <DropDown
            options={[]}
            children={
              <>
                {" "}
                <Filter className="size-4" />
                <span>Filter</span>
              </>
            }
            style={{
              display: "flex",
              fontSize: "15px",
              borderRadius: "4px",
              padding: "0.5rem 1rem 0.5rem 1rem",
              color: "var(--light-text)",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              background: "var(--dark-foreground) ",
            }}
          />
          <button className="flex items-center gap-2 justify-center bg-[var(--primary-color)] text-[var(--light-foreground)] py-[0.4rem] border-[1px] border-[var(--primary-color)] px-4 rounded">
            <Download className="size-4" />
            <span className="text-[15px] ">Export</span>
          </button>
        </div>
      </div>
      <div className="w-full shadow-lime-300 rounded-t-md  shadow-inner overflow-auto">
        <Table
          actions={(value) => handleDelete(value)}
          pagination={{ currentPage: 1, perPage: 10 }}
          width="800px"
          colSpan={"6"}
          data={initialOrders}
          headers={orderHeaders}
          onCheckBoxChange={handleCheckboxChange}
        />
      </div>
    </div>
  );
};

export default OrderList;
