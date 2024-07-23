import {
  ArrowDown,
  ArrowDownAZ,
  ArrowUp,
  Download,
  Filter,
  Search,
  Trash,
} from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
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
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const handleCustomerData = async () => {
    setLoading(true);
    try {
      const customers = await getCustomerData("customers");
      const customerList = await aggregateCustomerData(customers);
      setInitialCustomer(customerList);
    } catch (error) {
      setLoading(false);
      setError(true);
      return console.log(`Error while getting customers : ${error}`);
    }
    setLoading(false);
  };

  const handleCheckboxChange = (isChecked: boolean, id: string) => {
    setChecked((prevChecked) => {
      const checkedCustomer = initialCustomer.find(
        (customer) => customer.ID === id
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
      sortedCustomers = [...initialCustomer].sort((a: any, b: any) =>
        newOrder === "desc"
          ? b.amountSpent - a.amountSpent
          : a.amountSpent - b.amountSpent
      );
    }
    if (value === "Name") {
      sortedCustomers = [...initialCustomer].sort((a: any, b: any) =>
        newOrder === "desc"
          ? b.name.localeCompare(a.name)
          : a.name.localeCompare(b.name)
      );
    }
    if (value === "Total Order") {
      sortedCustomers = [...initialCustomer].sort((a: any, b: any) =>
        newOrder === "desc"
          ? b.totalOrder - a.totalOrder
          : a.totalOrder - b.totalOrder
      );
    }

    setSortOrder({ field: value, order: newOrder });
    setInitialCustomer(sortedCustomers as CustomerType[]);
  };

  return (
    <div className="flex flex-col items-start justify-center w-full gap-5 px-5 py-2 2xl:container">
      <div className="flex items-center justify-between w-full px-2 pt-5">
        <div className="flex flex-col items-start justify-center gap-1">
          <h4 className="text-[1.25rem] font-[600] tracking-wide text-[var(--dark-text)]">
            All users
          </h4>
        </div>
        <div className="flex items-center justify-center gap-5 ">
          <div className="flex  items-center justify-center gap-2">
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
                <FilterButton onSelect={handleSelect} />,
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
      <div className="flex items-center justify-start w-full px-1 pb-5">
        <form action="" className="relative w-full">
          <input
            id="search"
            type="search"
            onChange={(event) => debouncedHandleChange(event?.target.value)}
            className="border placeholder:text-sm placeholder:text-[var(--dark-secondary-text)] outline-none sm:w-[300px] w-full py-2 px-2  border-[var(--dark-secondary-background)] bg-[var(--light-background)] rounded-lg  focus:border-[var(--primary-color)] "
            placeholder="Search"
          />
        </form>
      </div>
      <div className="w-full">
        <Table
          loading={loading}
          error={error}
          onSelectAll={handleSelectAll}
          pagination={{ perPage: 5, currentPage: 1 }}
          headerStyle={{ gridTemplateColumns: "repeat(9,1fr)" }}
          bodyStyle={{ gridTemplateColumns: "repeat(9,1fr)" }}
          data={initialCustomer as CustomerType[]}
          headers={customerHeader as string[]}
          onChange={handleCheckboxChange}
        />
      </div>
    </div>
  );
};

export default CustomerList;

interface SortValue {
  onSelect: (value: string) => void;
}
export const FilterButton: React.FC<SortValue> = ({ onSelect }) => {
  const sortOptions = ["Amount spent", "Name", "Total order"];
  const [openChild, setOpenChild] = useState<boolean>(false);

  const reference = useRef<HTMLDivElement>();

  useEffect(() => {
    const closeModal = (event: Event) => {
      if (
        reference.current &&
        !reference.current.contains(event.target as any)
      ) {
        setOpenChild(false);
      } else {
        setOpenChild(true);
      }
    };

    window.addEventListener("mousedown", closeModal);

    return () => {
      window.removeEventListener("mousedown", closeModal);
    };
  }, []);

  return (
    <div
      ref={reference as any}
      className="relative w-full"
    >
      <div className="flex w-full p-1.5 hover:bg-[var(--light-secondary-background)] items-center rounded justify-start gap-2">
        <ArrowDownAZ className="size-4" />
        <span className=" text-[15px]">Sort By</span>
      </div>
      {openChild && (
        <div className="w-[200px]  p-0.5 rounded gap-1 flex flex-col items-start justify-center absolute left-[-15.2rem] top-0 border shadow-[#00000015] shadow-sm ">
          {sortOptions?.map((option, key) => (
            <button
              onClick={() => onSelect(option)}
              className=" text-start hover:bg-[var(--light-secondary-background)] w-full p-2 tracking-wide text-[16px] "
              key={key}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
