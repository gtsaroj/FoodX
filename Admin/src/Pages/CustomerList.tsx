import { Filter, Search } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import Table from "../Components/Common/Table/Table";
import { DropDown } from "../Components/Common/DropDown/DropDown";
import { getCustomerData } from "../firebase/db";
import { DbUser } from "../models/UserModels";
import { aggregateCustomerData } from "../Utility/CustomerUtils";
import { CustomerType } from "../models/user.model";

const CustomerList: React.FC = () => {
  const [initialCustomer, setInitialCustomer] = useState<CustomerType[]>([]);
  const [customerHeader, setCustomerHeader] = useState<string[]>([]);

  useEffect(() => {
    const handleCustomerData = async () => {
      const customers = await getCustomerData("customers");
      const customerList = await aggregateCustomerData(customers);
      setInitialCustomer(customerList);
    };
    handleCustomerData()
  }, []);
  console.table(initialCustomer)

  useEffect(() => {
    if (initialCustomer.length > 0) {
      const CustomerHeadersObject = initialCustomer[0];
      const headers = Object.keys(CustomerHeadersObject);
      setCustomerHeader(headers);
    }
  }, [initialCustomer.length, initialCustomer]);

  const handleCheckboxChange = (
    rowIndex: number,
    colName: string,
    checked: boolean
  ) => {
    console.log(rowIndex, colName, checked);
  };

  console.log(initialCustomer, customerHeader);

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
        <DropDown
          children={
            <>
              {" "}
              <Filter className="size-4" />
              <span>Filter</span>
            </>
          }
          options={["fljds", "lfkdsj"]}
          style={{
            display: "flex",
            fontSize: "15px",
            borderRadius: "4px",
            padding: "0.5rem 1rem 0.5rem 1rem",
            color: "var(--dark-text)",
            border: "1px solid var(--dark-secondary-text)  ",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            background: "",
          }}
        />
      </div>
      <div className="w-full">
        <Table
          pagination={{ perPage: 2, currentPage: 1 }}
          width="800px"
          data={initialCustomer as CustomerType[]}
          colSpan="7"
          headers={customerHeader as string[]}
          onCheckBoxChange={handleCheckboxChange}
        />
      </div>
    </div>
  );
};

export default CustomerList;
