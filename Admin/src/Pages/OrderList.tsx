import { ArrowDownWideNarrow, Download, Search } from "lucide-react";
import { Table } from "../Components/Common/Table/Table";
import data from "../data.json";
import { FilterButton } from "../Components/Common/Filter/Filter";

const OrderList = () => {
  const { orderHeaders, orders } = data;
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
            <Search className="absolute top-3 cursor-pointer text-[var(--dark-secondary-text)]   size-5 left-2" />
            <input
              type="search"
              className=" pl-9 border-[1px] placeholder:text-sm outline-none w-full sm:w-[300px] rounded py-2 px-8 border-[var(--dark-secondary-text)] "
              placeholder="Search"
            />
          </form>
          <div className="flex items-center justify-center gap-4">
            <FilterButton />
            <button className="flex gap-1 text-[var(--light-text)] bg-[var(--dark-text)] px-5 py-3 rounded items-center justify-center">
              <Download className="size-5" />
              <span className="text-[15px] ">Export</span>
            </button>
          </div>
        </div>
        <div className="w-full shadow-lime-300 rounded-t-md  shadow-inner overflow-auto">
          <Table
            pagination={{ currentPage: 1, perPage: 2 }}
            width="800px"
            colSpan={"6"}
            data={orders}
            headers={orderHeaders}
            onCheckBoxChange={handleCheckboxChange}
          />
        </div>
      </div>
    </div>
  );
};

export default OrderList;
