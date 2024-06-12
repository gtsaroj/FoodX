import {
  ArrowDownWideNarrow,
  Download,
  Search,
} from "lucide-react";
import { Table } from "../Components/Common/Table/Table";
import data from "../data.json"


const OrderList = () => {

  const {orderHeaders, orders} = data
  const handleCheckboxChange = (
    rowIndex: number,
    colName: string,
    checked: boolean
  ) => {
    console.log(rowIndex, colName, checked);
  };

  return (
    <div className="w-full sm:px-5  py-2 flex flex-col items-start justify-center gap-8">
      <h1 className="text-[20px] font-semibold">Order</h1>
      <div className="w-full py-6 flex rounded-sm  flex-col gap-5 items-start justify-center px-4">
        <div className="border-b-[4px] w-full hidden sm:flex items-center justify-between  py-4 border-[#8a8495be]">
          <ul className="relative text-[var(--dark-text)] text-[16px]  flex items-center justify-start gap-8">
            <li className="group/orderstatus  cursor-pointer">
              All Order
              <div className="w-[50px] invisible bottom-[-20px] translate-x-[-20px] group-hover/orderstatus:translate-x-0 duration-200 opacity-0 group-hover/orderstatus:opacity-100  absolute group-hover/orderstatus:visible bg-[var(--primary-color)] h-[4px]"></div>
            </li>
            <li className="group/orderstatus cursor-pointer">
              Recieved
              <div className="w-[50px] invisible bottom-[-20px] translate-x-[-20px] group-hover/orderstatus:translate-x-0 duration-200 opacity-0 group-hover/orderstatus:opacity-100  absolute group-hover/orderstatus:visible bg-[var(--primary-color)] h-[4px]"></div>
            </li>
            <li className="group/orderstatus cursor-pointer">
              Preparing
              <div className="w-[50px] invisible bottom-[-20px] translate-x-[-20px] group-hover/orderstatus:translate-x-0 duration-200 opacity-0 group-hover/orderstatus:opacity-100  absolute group-hover/orderstatus:visible bg-[var(--primary-color)] h-[4px]"></div>
            </li>
            <li className="group/orderstatus cursor-pointer">
              Completed
              <div className="w-[50px] invisible bottom-[-20px] translate-x-[-20px] group-hover/orderstatus:translate-x-0 duration-200 opacity-0 group-hover/orderstatus:opacity-100  absolute group-hover/orderstatus:visible bg-[var(--primary-color)] h-[4px]"></div>
            </li>
            <li className="group/orderstatus cursor-pointer">
              Cancel
              <div className="w-[50px] invisible bottom-[-20px] translate-x-[-20px] group-hover/orderstatus:translate-x-0 duration-200 opacity-0 group-hover/orderstatus:opacity-100  absolute group-hover/orderstatus:visible bg-[var(--primary-color)] h-[4px]"></div>
            </li>
          </ul>
          <h2 className="md:flex hidden text-[var(--dark-text)] text-[13px] ">
            Showing 8-10 of 84 results
          </h2>
        </div>
        <div className="flex sm:flex-row flex-col-reverse items-start gap-5 sm:gap-2 sm:items-center justify-between  w-full">
          <form action="" className="relative w-full">
            <Search className="absolute top-4 size-5 left-2" />
            <input
              type="search"
              className=" pl-9 placeholder:text-sm outline-none w-full sm:w-[350px] rounded-md py-4 px-8 border-[var(--dark-border)] "
              placeholder="Search for orderID, customer, orderstatus or something"
            />
          </form>
          <div className="flex items-center justify-center gap-4">
            <button className="flex gap-1 text-[var(--light-text)] bg-[var(--dark-text)] px-5 py-3 rounded-md items-center justify-center">
              <ArrowDownWideNarrow className="size-4" />
              <span className="text-[14px] ">Filter</span>
            </button>
            <button className="flex gap-1 text-[var(--light-text)] bg-[var(--dark-text)] px-5 py-3 rounded-md items-center justify-center">
              <Download className="size-4" />
              <span className="text-[14px] ">Export</span>
            </button>
          </div>
        </div>
        <div className="w-full shadow-lime-300 rounded-t-md  shadow-inner overflow-auto">
       <Table width="800px" colSpan={"6"} data={orders} headers={orderHeaders} onCheckBoxChange={handleCheckboxChange}/>
      </div>
      </div>
    </div>
  );
};

export default OrderList;
