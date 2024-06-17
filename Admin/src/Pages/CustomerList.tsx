import { ChevronDown, Ellipsis, Search } from "lucide-react";
import React, { useRef } from "react";
import { Table } from "../Components/Common/Table/Table";
import data from "../data.json";

const CustomerList: React.FC = () => {
  const { customers, customerDetails } = data;
  const handleCheckboxChange = (
    rowIndex: number,
    colName: string,
    checked: boolean
  ) => {
    console.log(rowIndex, colName, checked);
  };

  const searchFormRef = useRef<HTMLButtonElement>(null);
  return (
    <div className="2xl:container w-full py-2  flex flex-col gap-10 items-start justify-center">
      <h1 className="text-[20px] py-3 px-2 ">Customer</h1>
      <div className="w-full flex sm:flex-row flex-col-reverse items-start sm:items-center justify-between">
        <form action="" className="relative w-full">
          <Search className="absolute top-4 size-5 left-2" />
          <input
            type="search"
            className=" pl-9 placeholder:text-sm outline-none w-full sm:w-[250px] rounded-md py-4 px-8 border-[var(--dark-border)] "
            placeholder="Search for customer"
          />
        </form>
        <button className="flex w-[150px] gap-1 text-[var(--light-text)] bg-[var(--dark-text)] px-5 py-3 rounded items-center justify-start sm:justify-start">
          <ChevronDown className="size-4" />
          <span className="text-[15px] ">Add filter</span>
        </button>
      </div>
      <div className="w-full">
        <Table
          pagination={{ perPage: 2, currentPage: 1 }}
          width="800px"
          data={customerDetails}
          colSpan="7"
          headers={customers}
          onCheckBoxChange={handleCheckboxChange}
        />
      </div>
    </div>
  );
};

export default CustomerList;
