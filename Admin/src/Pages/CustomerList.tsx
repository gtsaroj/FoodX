import { ArrowDown, ArrowDownAZ, ArrowUp, Search, Trash } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import Table from "../Components/Common/Table/Table";
import { DropDown } from "../Components/Common/DropDown/DropDown";
import { getCustomerData } from "../firebase/db";
import "../index.css";
import {
  aggregateCustomerData,
  aggregateCustomerSearchData,
} from "../Utility/CustomerUtils";
import { CustomerType } from "../models/user.model";
import { debounce } from "../Utility/Debounce";
import { DatePickerDemo } from "../Components/DatePicker/DatePicker";
import { deleteAllUser } from "../Services";
import toast from "react-hot-toast";

const CustomerList: React.FC = () => {
  const [initialCustomer, setInitialCustomer] = useState<CustomerType[]>([]);
  const [customerHeader, setCustomerHeader] = useState<string[]>([]);
  const [checked, setChecked] = useState<CustomerType[]>([]);
  const [sortOrder, setSortOrder] = useState({ field: "", order: "desc" });

  const handleCustomerData = async () => {
    const customers = await getCustomerData("customers");
    const customerList = await aggregateCustomerData(customers);
    setInitialCustomer(customerList);
  };

  const handleCheckboxChange = (isChecked: boolean, id: string) => {
    setChecked((prevChecked) => {
      console.log(id);
      const checkedCustomer = initialCustomer.find(
        (customer) => customer.id === id
      );

      if (isChecked && checkedCustomer) {
        return [...prevChecked, checkedCustomer]; // Add customer to checked list
      } else {
        return prevChecked.filter((customer) => customer.id !== id); // Remove customer from checked list
      }
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setChecked(initialCustomer); // Select all customers
    } else {
      setChecked([]); // Deselect all customers
    }
  };

  const deleteUsers = async () => {
    try {
      const allUsers = await deleteAllUser(checked);
      if (allUsers) {
        handleCustomerData();
        return toast.success("users deleted successfully");
      }
    } catch (error) {
      throw new Error("Unable to delete users");
    }
  };

  const handleChange = async (value: string) => {
    const customers = await getCustomerData("customers");
    const customerList = await aggregateCustomerSearchData(customers, value);
    if (customerList) setInitialCustomer(customerList);
  };

  useEffect(() => {
    handleCustomerData();
  }, []);

  useEffect(() => {
    if (initialCustomer.length > 0) {
      const CustomerHeadersObject = initialCustomer[0];
      const headers = Object.keys(CustomerHeadersObject);
      headers.unshift("Checkbox");
      const index = headers.indexOf("id");
      headers.splice(index, 1);
      setCustomerHeader(headers);
    }
  }, [initialCustomer.length, initialCustomer]);

  const debouncedHandleChange = useCallback(debounce(handleChange, 350), [
    initialCustomer,
  ]);

  const handleSelect = async (value: string) => {
    const newOrder = sortOrder.order === "asc" ? "desc" : "asc";

    let sortedCustomers;
    if (value === "Amount spent") {
      sortedCustomers = [...initialCustomer].sort((a, b) =>
        newOrder === "desc"
          ? b.amountSpent - a.amountSpent
          : a.amountSpent - b.amountSpent
      );
    }
    if (value === "Name") {
      sortedCustomers = [...initialCustomer].sort((a, b) =>
        newOrder === "desc"
          ? b.name.localeCompare(a.name)
          : a.name.localeCompare(b.name)
      );
    }
    if (value === "Total Order") {
      sortedCustomers = [...initialCustomer].sort((a, b) =>
        newOrder === "desc"
          ? b.totalOrder - a.totalOrder
          : a.totalOrder - b.totalOrder
      );
    }

    setSortOrder({ field: value, order: newOrder });
    setInitialCustomer(sortedCustomers);
  };

  console.log(initialCustomer);

  return (
    <div className="flex flex-col items-start justify-center w-full gap-5 px-5 py-2 2xl:container">
      {/* 
      <h1 className="text-[20px] pt-3 ">Customer</h1>
      <div className="flex flex-col-reverse items-start justify-between w-full gap-2 sm:flex-row sm:items-center">
        <form action="" className="relative w-full">
          <Search className="absolute text-[var(--dark-secondary-text)]    top-3 size-5 left-2" />
          <input
            type="search"
            onChange={(e) => debouncedHandleChange(e.target.value)}
            className=" pl-9 border-[1px] placeholder:text-sm outline-none w-full sm:w-[250px] rounded py-2 px-8 border-[var(--dark-secondary-text)] "
            placeholder="Search for customer"
          />
        </form>
        <div className="flex items-center justify-center w-full gap-5">
          {checked.length > 0 && (
            <button
              onClick={() => deleteUsers()}
              className=" border border-[var(--danger-bg)] px-10 py-2 rounded"
            >
              <Trash className="hover:scale-[1.1] duration-150 text-[var(--dark-secondary-text)] size-5" />
            </button>
          )}
          <DropDown
            onSelect={handleSelect}
            children={
              <>
                {" "}
                <ArrowDownAZ className="size-4" />
                <span>Sort By</span>
              </>
            }
            options={["Name", "Amount spent", "Total Order"]}
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

          <DatePickerDemo />
        </div>
      </div> 
    */}
      <div className="flex items-center justify-between w-full px-2 pt-5">
        <div className="flex flex-col items-start justify-center gap-1">
          <h4 className="text-xl tracking-wider text-[var(--dark-text)]">
            Customers
          </h4>
        </div>
        <div className="flex items-center justify-center gap-5 ">
          <div className="flex items-center justify-center gap-2">
            <DatePickerDemo />
            <DropDown
              onSelect={handleSelect}
              children={
                <>
                  <ArrowDownAZ className="size-4 text-[var(--dark-secondary-text)]" />
                  <span className="text-[var(--dark-secondary-text)]">
                    Sort By
                  </span>
                </>
              }
              options={["Name", "Amount spent", "Total Order"]}
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
      <div className="flex items-center justify-start w-full px-1 pb-5">
        <form action="" className="relative w-full">
          <label htmlFor="search">
            <Search className="absolute text-[var(--dark-secondary-text)] cursor-pointer top-3 size-5 left-2" />
          </label>
          <input
            id="search"
            type="search"
            onChange={(event) => debouncedHandleChange(event?.target.value)}
            className=" pl-9 border placeholder:text-sm outline-none sm:w-[250px] w-full py-2 px-8 border-[var(--dark-secondary-background)] rounded bg-transparent focus:border-[var(--primary-color)] "
            placeholder="Search"
          />
        </form>
      </div>
      <div className="w-full">
        <Table
          onSelectAll={handleSelectAll}
          pagination={{ perPage: 5, currentPage: 1 }}
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

// export const SortOptions = () => {
//   return (
//     <div className="flex flex-col items-start justify-center gap-2 px-5">
//       <div className="flex text-[15px]  items-center gap-5 justify-center">
//         Name{" "}
//         {/* <div className="flex items-center justify-center gap-2">
//           <ArrowDown className="size-4" />
//           <ArrowUp className="size-4" />
//         </div>{" "} */}
//       </div>
//       <div className="flex  text-[15px] items-center gap-5 justify-center">
//         Amount Spent{" "}
//         {/* <div className="flex items-center justify-center gap-2">
//           <ArrowDown className="size-4" />
//           <ArrowUp className="size-4" />
//         </div>{" "} */}
//       </div>
//       <div className="flex text-[15px]  items-center gap-5 justify-center">
//         Order{" "}
//         {/* <div className="flex items-center justify-center gap-2">
//           <ArrowDown className="size-4" />
//           <ArrowUp className="size-4" />
//         </div>{" "} */}
//       </div>
//     </div>
//   );
// };
