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
        <div className="flex sm:flex-row flex-col-reverse items-start gap-5 sm:gap-2 sm:items-center justify-between  w-full">
          <form action="" className="relative w-full">
            <Search className="absolute top-4 size-5 left-2" />
            <input
              type="search"
              className=" pl-9 placeholder:text-sm outline-none w-full sm:w-[300px] rounded py-4 px-8 border-[var(--dark-border)] "
              placeholder="Search for orderID, customer, orderstatus or something"
            />
          </form>
          <div className="flex items-center justify-center gap-4">
            <button className="flex gap-1 text-[var(--light-text)] bg-[var(--dark-text)] px-5 py-3 rounded items-center justify-center">
              <ArrowDownWideNarrow className="size-5 " />
              <span className="text-[15px] ">Filter</span>
            </button>
            <button className="flex gap-1 text-[var(--light-text)] bg-[var(--dark-text)] px-5 py-3 rounded items-center justify-center">
              <Download className="size-5" />
              <span className="text-[15px] ">Export</span>
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
