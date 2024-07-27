import { Download, Filter, OctagonX, Trash2 } from "lucide-react";
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
import { deleteAllUser, deleteUser } from "../Services";
import toast from "react-hot-toast";
import { FilterButton } from "../Components/Common/Sorting/Sorting";
import { ColumnProps } from "../models/table.model";
import Modal from "../Components/Common/Popup/Popup";
import UpdateCategory from "../Components/Upload/UpdateCustomer";
import UpdateCustomer from "../Components/Upload/UpdateCustomer";
import Delete from "../Components/Common/Delete/Delete";

const CustomerList: React.FC = () => {
  const [initialCustomer, setInitialCustomer] = useState<CustomerType[]>([]);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [checked, setChecked] = useState<CustomerType[]>([]);
  const [sortOrder, setSortOrder] = useState({ field: "", order: "desc" });
  const [loading, setLoading] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(true);
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [id, setId] = useState<string>();

  const Columns: ColumnProps[] = [
    {
      fieldName: (
        <div className=" w-[50px]  text-start">
          <input className="w-4 h-4 cursor-pointer" type="checkbox" />
        </div>
      ),
      render: () => (
        <div className="w-[50px] ">
          <input className="w-4 h-4 cursor-pointer" type="checkbox" />
        </div>
      ),
    },
    {
      fieldName: " Name",
      colStyle: { width: "280px", justifyContent: "start", textAlign: "start" },
      render: (value: CustomerType) => (
        <div className="w-[280px] text-[var(--dark-text)] flex items-center justify-start gap-3 ">
          <div className="w-[50px] h-[50px]">
            <img
              className="w-full h-full rounded-full"
              src={value.image}
              alt=""
            />
          </div>
          <div className="flex flex-col">
            <span className="tracking-wide text-[15px] font-[500] contrast-125 ">
              {" "}
              {value.name}
            </span>
            <span className="tracking-wide text-[var(--dark-secondary-text)] text-sm font-[500] contrast-125">
              {value.email}
            </span>
          </div>
        </div>
      ),
    },
    {
      fieldName: "Id",
      colStyle: { width: "150px", textAlign: "start" },
      render: (item: CustomerType) => (
        <div className="w-[150px] text-[var(--dark-secondary-text)]  relative cursor-pointer group/id text-start ">
          #{item.id?.substring(0, 8)}
          <div className=" top-[-27px] group-hover/id:visible opacity-0 group-hover/id:opacity-[100] duration-150 invisible left-[-30px]  absolute bg-[var(--light-foreground)] p-1 rounded shadow ">
            {item.id}
          </div>
        </div>
      ),
    },
    {
      fieldName: "Role",
      colStyle: { width: "150px", justifyContent: "start", textAlign: "start" },
      render: (item: CustomerType) => (
        <div className=" w-[150px]  text-[var(--dark-text)]">
          <p>{item.role}</p>
        </div>
      ),
    },
    {
      fieldName: "Orders",
      colStyle: { width: "150px", justifyContent: "start", textAlign: "start" },
      render: (item: CustomerType) => (
        <div className=" w-[150px] text-[var(--dark-text)] ">
          <p>{item.totalOrder}</p>
        </div>
      ),
    },
    {
      fieldName: "Amount",
      colStyle: { width: "120px", justifyContent: "start", textAlign: "start" },
      render: (item: CustomerType) => (
        <div className=" w-[120px] text-[var(--dark-text)]  ">
          <p>Rs {item.amountSpent}</p>
        </div>
      ),
    },
  ];

  const handleCustomerData = async () => {
    setLoading(true);
    try {
      const customers = await getCustomerData("customers");
      const customerList = await aggregateCustomerData(customers);
      setInitialCustomer(customerList);
    } catch (error) {
      setLoading(false);
      return console.log(`Error while getting customers : ${error}`);
    }
    setLoading(false);
  };

  const handleCheckboxChange = (isChecked: boolean, id: string) => {
    setIsChecked(isChecked);
    setChecked((prevChecked) => {
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
      setIsChecked(checked);
      setChecked(initialCustomer); // Select all customers
    } else {
      setChecked([]); // Deselect all customers
    }
  };

  const deleteUsers = async () => {
    const toastLoading = toast.loading("User deleting...");
    try {
      await deleteAllUser(checked);

      handleCustomerData();
      toast.dismiss(toastLoading);
      return toast.success("users deleted successfully");
    } catch (error) {
      toast.dismiss(toastLoading);
      toast.error("Route not found");
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

  const debouncedHandleChange = useCallback(debounce(handleChange, 350), [
    initialCustomer,
  ]);
  const handleSelect = async (value: string) => {
    const newOrder = sortOrder.order === "asc" ? "desc" : "asc";

    let sortedCustomers;
    if (value === "Total spent") {
      sortedCustomers = [...initialCustomer].sort((a: any, b: any) =>
        newOrder === "desc"
          ? b.Amountspent - a.Amountspent
          : a.Amountspent - b.Amountspent
      );
    }
    if (value === "Name") {
      sortedCustomers = [...initialCustomer].sort((a: any, b: any) =>
        newOrder === "desc"
          ? b.Name.localeCompare(a.Name)
          : a.Name.localeCompare(b.Name)
      );
    }
    if (value === "Total order") {
      sortedCustomers = [...initialCustomer].sort((a: any, b: any) =>
        newOrder === "desc"
          ? b.Totalorder - a.Totalorder
          : a.Totalorder - b.Totalorder
      );
    }

    setSortOrder({ field: value, order: newOrder });
    setInitialCustomer(sortedCustomers as CustomerType[]);
  };

  const handleDelete = async (id: string) => {
    const toastLoading = toast.loading("Deleting user...");
    const findUser = initialCustomer?.find((customer) => customer.id === id);
    try {
      await deleteUser({
        id: [findUser?.id as string],
        role: findUser?.role as string,
      });
      toast.dismiss(toastLoading);
      toast.success("Successfully deleted");
      const refreshData = initialCustomer?.filter(
        (customer) => customer.id !== id
      );
      setInitialCustomer(refreshData);
      setIsDelete(false);
    } catch (error) {
      toast.dismiss(toastLoading);
      toast.error("Failed to delete user");
    }
    setIsDelete(false);
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
                <FilterButton
                  sortOrder={sortOrder.order}
                  sortingOptions={["Total spent", "Name", "Total order"]}
                  onSelect={handleSelect}
                />,
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
      <div className="flex items-center justify-start gap-2 w-full px-1">
        <form action="" className="relative">
          <input
            id="search"
            type="search"
            onChange={(event) => debouncedHandleChange(event?.target.value)}
            className="border placeholder:text-sm placeholder:text-[var(--dark-secondary-text)] outline-none sm:w-[300px] w-full py-2 px-2  border-[var(--dark-secondary-background)] bg-[var(--light-background)] rounded-lg  focus:border-[var(--primary-color)] "
            placeholder="Search"
          />
        </form>
        <div className="h-10  w-[1px] bg-gray-300 "></div>
        <div>
          <Trash2 className="size-7"/>
         </div>
      </div>
      <div className="w-full">
        <Table
          data={initialCustomer}
          columns={Columns}
          actionIconColor="red"
          disableActions={true}
          loading={loading}
          bodyHeight={400}
          pagination={{ currentPage: 1, perPage: 5 }}
          onPageChange={(pageNumber) => console.log(pageNumber)}
          disableNoData={initialCustomer?.length < 1 ? true : false}
          headStyle={{ width: "100%" }}
        />
      </div>
    </div>
  );
};

export default CustomerList;
