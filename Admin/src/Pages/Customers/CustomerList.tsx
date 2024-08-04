import { ChevronUp, Download, Filter, X } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { DropDown } from "../../Components/Common/DropDown/DropDown";
import { getCustomerData } from "../../firebase/db";
import {
  aggregateCustomerData,
  aggregateCustomerSearchData,
} from "../../Utility/CustomerUtils";
import { CustomerType } from "../../models/user.model";
import { debounce } from "../../Utility/Debounce";
import {  DatePicker } from "../../Components/DatePicker/DatePicker";
import { FilterButton } from "../../Components/Common/Sorting/Sorting";
import { CustomerTable } from "./CustomerTable";
import "../../index.css";
import { SearchCustomer } from "../../Utility/Search";

const CustomerList: React.FC = () => {
  const [initialCustomer, setInitialCustomer] = useState<CustomerType[]>([]);
  const [originalData, setOriginalData] = useState<CustomerType[]>([]);
  const [sortOrder, setSortOrder] = useState({ field: "", order: "desc" });
  const [loading, setLoading] = useState<boolean>(false);

  const handleCustomerData = async () => {
    setLoading(true);
    try {
      let AllCustomers  = []
      const customers = await getCustomerData("customer");
      if(customers.length > 0) AllCustomers.push(...customers)
      const admins = await getCustomerData("admin");
      if(admins.length > 0) AllCustomers.push(...admins)
      const chefs = await getCustomerData("chef");
      if(chefs.length > 0) AllCustomers.push(...chefs);
      const customerList = await aggregateCustomerData(AllCustomers);
      setInitialCustomer(customerList);
      setOriginalData(customerList);
    } catch (error) {
      setLoading(false);
      return console.log(`Error while getting customers : ${error}`);
    }
    setLoading(false);
  };

  const handleChange = async (value: string) => {
    if (value.length <= 0) return handleCustomerData();
    const filterCustomer = SearchCustomer(initialCustomer, value);
    if (filterCustomer.length <= 0) return setInitialCustomer([]);
    setInitialCustomer(filterCustomer);
  };

  const debouncedHandleChange = useCallback(debounce(handleChange, 350), [
    initialCustomer,
  ]);
  const handleSelect = async (value: string) => {
    const newOrder = sortOrder.order === "asc" ? "desc" : "asc";

    let sortedCustomers;
    if (value === "Total spent") {
      sortedCustomers = [...initialCustomer].sort(
        (a: CustomerType, b: CustomerType) =>
          newOrder === "desc"
            ? b.amountSpent - a.amountSpent
            : a.amountSpent - b.amountSpent
      );
    }
    if (value === "Name") {
      sortedCustomers = [...initialCustomer].sort(
        (a: CustomerType, b: CustomerType) =>
          newOrder === "desc"
            ? b.name.localeCompare(a.name)
            : a.name.localeCompare(b.name)
      );
    }
    if (value === "Total order") {
      sortedCustomers = [...initialCustomer].sort(
        (a: CustomerType, b: CustomerType) =>
          newOrder === "desc"
            ? b.totalOrder - a.totalOrder
            : a.totalOrder - b.totalOrder
      );
    }

    setSortOrder({ field: value, order: newOrder });
    setInitialCustomer(sortedCustomers as CustomerType[]);
  };

  useEffect(() => {
    handleCustomerData();
  }, []);

  useEffect(() => {
    if (sortOrder.field === "") {
      setInitialCustomer(originalData);
    }
  }, [sortOrder.field, originalData]);

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
                <FilterButton
                  sortOrder={sortOrder.order}
                  sortingOptions={["Total spent", "Name", "Total order"]}
                  onSelect={handleSelect}
                />,
                <DatePicker />,
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
      <div className="flex sm:flex-row flex-col items-start sm:items-center justify-start gap-8 sm:gap-2 w-full px-1">
        <form action="" className=" w-full sm:w-auto">
          <input
            id="search"
            type="search"
            onChange={(event) => debouncedHandleChange(event?.target.value)}
            className="border placeholder:text-sm placeholder:text-[var(--dark-secondary-text)] outline-none sm:w-[300px] w-full py-2 px-2  border-[var(--dark-secondary-background)] bg-[var(--light-background)] rounded-lg  focus:border-[var(--primary-color)] "
            placeholder="Search"
          />
        </form>
        {sortOrder.field && (
          <div className="flex w-[150px]  items-center rounded-lg border  justify-between p-2">
            <div className="flex gap-1 items-center justify-center">
              <span className="  text-sm ">
                {sortOrder.field.toLowerCase()}
              </span>
              <p
                className={` duration-150 ${
                  sortOrder?.order === "desc"
                    ? "rotate-180"
                    : sortOrder.order === "asc"
                    ? ""
                    : ""
                } `}
              >
                <ChevronUp size={20} />
              </p>
            </div>
            <button onClick={() => setSortOrder({ field: "" })} className=" ">
              <X className="text-[var(--danger-text)] " size={20} />
            </button>
          </div>
        )}
      </div>
      <CustomerTable loading={loading} users={initialCustomer} />
    </div>
  );
};

export default CustomerList;

//functions

// const handleBulkSelected = (id: string, isChecked: boolean) => {
//   const refreshIds = bulkSelectedCustomer?.filter(
//     (product) => product.id !== id
//   );

//   isChecked
//     ? setBulkSelectedCustomer((prev) => {
//         const newCategory = prev?.filter((category) => category.id !== id);
//         const findProduct = initialCustomer?.find(
//           (category) => category.id === id
//         );
//         return newCategory
//           ? [...newCategory, { id: findProduct?.id }]
//           : [{ id: findProduct?.id }];
//       })
//     : setBulkSelectedCustomer(refreshIds);
// };
// const handleAllSelected = (isChecked: boolean) => {
//   if (isChecked) {
//     const AllCategories = initialCustomer?.map((product) => {
//       return { id: product.id };
//     });
//     setBulkSelectedCustomer(AllCategories as { id: string }[]);
//   }
//   if (!isChecked) {
//     setBulkSelectedCustomer([]);
//   }
// };

// const handleSelectedDelete = async () => {
//   try {
//     const toastLoader = toast.loading("Deleting category...");
//     const AllCategoriesId = bulkSelectedCustomer?.map(
//       (category) => category.id
//     );
//     await bulkDeleteOfCategory(AllCategoriesId);
//     toast.dismiss(toastLoader);
//     const refreshCategory = initialCustomer.filter((category) => {
//       return !AllCategoriesId.includes(category.id as string);
//     });
//     setInitialCustomer(refreshCategory);
//     toast.success("Successfully deleted");
//   } catch (error) {
//     console.error("Error deleting products:", error);
//     // Handle the error appropriately, e.g., show a notification to the user
//   }
// };

// const handleDelete = async (id: string) => {
//   const toastLoading = toast.loading("Deleting user...");
//   const findUser = initialCustomer?.find((customer) => customer.id === id);
//   try {
//     await deleteUser({
//       id: [findUser?.id as string],
//       role: findUser?.role as string,
//     });
//     toast.dismiss(toastLoading);
//     toast.success("Successfully deleted");
//     const refreshData = initialCustomer?.filter(
//       (customer) => customer.id !== id
//     );
//     setInitialCustomer(refreshData);
//     setIsDelete(false);
//   } catch (error) {
//     toast.dismiss(toastLoading);
//     toast.error("Failed to delete user");
//   }
//   setIsDelete(false);
// };

//table action
// selectedData={bulkSelectedCustomer}
// actions={{
//   checkAllFn: (isChecked: boolean) => handleAllSelected(isChecked),
//   checkFn: (id: string, isChecked: boolean) =>
//     handleBulkSelected(id, isChecked),
// }}

//modal of delete
{
  /* {isDelete && (
        <Delete
          id={id as string}
          closeModal={() => setIsDelete(false)}
          isClose={isDelete}
          setDelete={() => handleSelectedDelete()}
        />
      )} */
}

// state
// const [bulkSelectedCustomer, setBulkSelectedCustomer] = useState<
// { id: string }[]
// >([]);
// const [isChecked, setIsChecked] = useState<boolean>(false);
// const [checked, setChecked] = useState<CustomerType[]>([]);
// const [isDelete, setIsDelete] = useState<boolean>(false);
// const [id, setId] = useState<string>();
