import { useCallback, useEffect, useState } from "react";
import { FilterButton } from "../../Components/Common/Sorting/Sorting";
import { getCustomerData } from "../../firebase/db";
import { aggregateCustomerData } from "../../Utility/CustomerUtils";
import { CustomerType } from "../../models/user.model";
import { CustomerTable } from "../Customers/CustomerTable";
import {
  bulkDeleteOfCategory,
  bulkDeleteOfCustomer,
  deleteCustomer,
} from "../../Services";
import toast from "react-hot-toast";
import { ChevronUp, Trash2, X } from "lucide-react";
import Delete from "../../Components/Common/Delete/Delete";
import Modal from "../../Components/Common/Popup/Popup";
import UpdateCustomer from "../../Components/Upload/UpdateCustomer";
import { debounce } from "../../Utility/Debounce";
import { SearchCustomer } from "../../Utility/Search";

const AllCustomers = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [initialCustomer, setInitialCustomer] = useState<CustomerType[]>([]);
  const [originalData, setOriginalData] = useState<CustomerType[]>([]);
  const [sortOrder, setSortOrder] = useState({ field: "", order: "desc" });
  const [bulkSelectedCustomer, setBulkSelectedCustomer] = useState<
    { id: string; role: string }[]
  >([]);
  const [isEdit, setIsEdit] = useState<boolean>(true);
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [isBulkDelete, setIsBulkDelete] = useState<boolean>(false);
  const [id, setId] = useState<string>();
  const [customerModal, setCustomerModal] = useState<CustomerType>();

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
      setOriginalData(customerList);
      setInitialCustomer(customerList);
    } catch (error) {
      setLoading(false);
      return console.log(`Error while getting customers : ${error}`);
    }
    setLoading(false);
  };

  const handleBulkSelected = (id: string, isChecked: boolean) => {
    const refreshIds = bulkSelectedCustomer?.filter(
      (product) => product.id !== id
    );

    isChecked
      ? setBulkSelectedCustomer((prev) => {
          const newCustomer = prev?.filter((category) => category.id !== id);
          const findCustomer = initialCustomer?.find(
            (category) => category.id === id
          );
          return newCustomer
            ? [
                ...newCustomer,
                { id: findCustomer?.id, role: findCustomer?.role },
              ]
            : [{ id: findCustomer?.id, role: findCustomer?.role }];
        })
      : setBulkSelectedCustomer(refreshIds);
  };
  const handleAllSelected = (isChecked: boolean) => {
    if (isChecked) {
      const AllCategories = initialCustomer?.map((customer) => {
        return { id: customer.id as string, role: customer.role };
      });
      setBulkSelectedCustomer(AllCategories as { id: string; role: string }[]);
    }
    if (!isChecked) {
      setBulkSelectedCustomer([]);
    }
  };

  const handleSelectedDelete = async () => {
    const toastLoader = toast.loading("Deleting category...");
    try {
      const { customer, admin, chef } = bulkSelectedCustomer.reduce<{
        customer: string[];
        admin: string[];
        chef: string[];
      }>(
        (acc, customer) => {
          if (customer.role === "admin") {
            acc.admin.push(customer.id);
          } else if (customer.role === "customer") {
            acc.customer.push(customer.id);
          }
          if (customer.role === "chef") {
            acc.chef.push(customer.id);
          }
          return acc;
        },
        { customer: [], admin: [], chef: [] }
      );
      if (customer.length > 0) {
        await bulkDeleteOfCustomer({ role: "customer", ids: [...customer] });
      }
      if (admin.length > 0) {
        await bulkDeleteOfCustomer({ role: "admin", ids: [...admin] });
      }
      if (chef.length > 0) {
        await bulkDeleteOfCustomer({ role: "chef", ids: [...chef] });
      }
      if (!admin && !customer) return toast.error("Please select the customer");
      toast.dismiss(toastLoader);
      const refreshCategory = initialCustomer.filter((customer) => {
        return (
          !customer.includes(customer.id as string) &&
          !admin.includes(customer.id as string)
        );
      });
      setInitialCustomer(refreshCategory);
      toast.success("Successfully deleted");
    } catch (error) {
      toast.dismiss(toastLoader);
      toast.error("Error while deleting...");
      console.error("Error deleting products:", error);
      // Handle the error appropriately, e.g., show a notification to the user
    }
  };

  const handleDelete = async (id: string) => {
    if (!id) return toast.error("Customer not found");
    const findCustomer = initialCustomer?.find(
      (customer) => customer.id === id
    );
    const toastLoader = toast.loading("Deleting customer...");
    try {
      await deleteCustomer({
        role: findCustomer?.role as string,
        id: findCustomer?.id as string,
      });
      toast.dismiss(toastLoader);
      toast.success("Succesfully deleted");
    } catch (error) {
      toast.dismiss(toastLoader);
      toast.error("Error while delting user");
      throw new Error("Error while deleting user" + error);
    }
  };

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

  const handleChange = async (value: string) => {
    if (value.length <= 0) return handleCustomerData();
    const filterCustomer = SearchCustomer(initialCustomer, value);
    if (filterCustomer.length <= 0) return setInitialCustomer([]);
    setInitialCustomer(filterCustomer);
  };

  const debouncedHandleChange = useCallback(debounce(handleChange, 350), [
    initialCustomer,
  ]);

  useEffect(() => {
    if (sortOrder.field === "") {
      setInitialCustomer(originalData);
    }
  }, [sortOrder.field, originalData]);

  useEffect(() => {
    handleCustomerData();
  }, []);
  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-5 px-3 py-5">
      <div className="flex items-center justify-between flex-grow w-full gap-5 px-3 pb-6">
        <div className="flex flex-col items-start justify-center gap-3">
          <p className="text-xl text-nowrap">All Customer</p>
          <div className="flex sm:flex-row flex-col items-start sm:items-center justify-start gap-8 sm:gap-2 w-full">
            <form action="" className=" w-full sm:w-auto">
              <input
                id="search"
                type="search"
                onChange={(event) => debouncedHandleChange(event?.target.value)}
                className="border placeholder:text-sm placeholder:text-[var(--dark-secondary-text)] outline-none sm:w-[300px] w-full py-2 px-2  border-[var(--dark-secondary-background)] bg-[var(--light-background)] rounded-lg  focus:border-[var(--primary-color)] "
                placeholder="Search"
              />
            </form>
            <div className="h-10  w-[1px] bg-gray-300 "></div>
            <button
              className="hover:bg-gray-400 rounded-lg duration-150 p-2"
              disabled={bulkSelectedCustomer?.length >= 1 ? false : true}
              onClick={() => setIsBulkDelete(true)}
            >
              <Trash2
                strokeWidth={3}
                className="size-7 hover:text-[var(--light-text)] duration-150 text-[var(--dark-secondary-text)]   "
              />
            </button>
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
                <button
                  onClick={() => setSortOrder({ field: "" })}
                  className=" "
                >
                  <X className="text-[var(--danger-text)] " size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="z-[100]">
          <FilterButton
            sortOrder={sortOrder.order}
            sortingOptions={["Total spent", "Name", "Total order"]}
            onSelect={handleSelect}
          />
        </div>
      </div>
      <CustomerTable
        selectedData={bulkSelectedCustomer}
        users={initialCustomer as CustomerType[]}
        loading={loading}
        actions={{
          delete: (id) => {
            setIsDelete(true);
            setId(id);
          },
          edit: (id) => {
            const findCustomer = initialCustomer?.find(
              (customer) => customer.id == id
            );
            setCustomerModal(findCustomer);
            setIsEdit(false);
          },
          checkFn: (id: string, isChecked: boolean) =>
            handleBulkSelected(id, isChecked),
          checkAllFn: (isCheck: boolean) => handleAllSelected(isCheck),
        }}
      />
      {isDelete && (
        <Delete
          closeModal={() => setIsDelete(false)}
          id={id as string}
          isClose={isDelete}
          setDelete={(id: string) => handleDelete(id)}
        />
      )}
      <Modal
        children={
          <UpdateCustomer
            closeModal={() => setIsEdit(true)}
            customerInfo={customerModal as CustomerType}
          />
        }
        close={isEdit}
        closeModal={() => setIsEdit(true)}
        disableScroll={true}
      />
      {isBulkDelete && (
        <Delete
          closeModal={() => setIsBulkDelete(false)}
          id={id as string}
          isClose={isBulkDelete}
          setDelete={() => handleSelectedDelete()}
        />
      )}
    </div>
  );
};

export default AllCustomers;
