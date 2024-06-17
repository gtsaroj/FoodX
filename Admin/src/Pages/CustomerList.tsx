import { ChevronDown, Ellipsis, Search } from "lucide-react";
import React, { useRef } from "react";
import { Table } from "../Components/Common/Table/Table";
import data from "../data.json";
import { FilterButton } from "../Components/Common/Filter/Filter";

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
    <div className="2xl:container w-full py-2  flex flex-col gap-7 items-start justify-center">
      <h1 className="text-[20px] pt-3 ">Customer</h1>
      <div className="w-full flex sm:flex-row flex-col-reverse gap-2 items-start sm:items-center justify-between">
        <form action="" className="relative w-full">
          <Search className="absolute text-[var(--dark-secondary-text)]    top-3 size-5 left-2" />
          <input
            type="search"
            className=" pl-9 border-[1px] placeholder:text-sm outline-none w-full sm:w-[250px] rounded py-2 px-8 border-[var(--dark-secondary-text)] "
            placeholder="Search for customer"
          />
        </form>
        <FilterButton />
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
