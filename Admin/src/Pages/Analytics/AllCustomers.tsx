import { useCallback, useEffect, useState } from "react";
import { FilterButton } from "../../Components/Common/Sorting/Sorting";
import { aggregateCustomerData } from "../../Utility/CustomerUtils";
import { CustomerType } from "../../models/user.model";
import { CustomerTable } from "../Customers/CustomerTable";
import {
  addLogs,
  bulkDeleteOfCustomer,
  deletUser,
  getUser,
} from "../../Services";
import toast from "react-hot-toast";
import {
  AlignLeft,
  ChevronUp,
  Filter,
  User2,
  UserCheck,
  UserCircle2Icon,
  UserCircleIcon,
  X,
} from "lucide-react";
import Delete, { DeleteButton } from "../../Components/Common/Delete/Delete";
import Modal from "../../Components/Common/Popup/Popup";
import UpdateCustomer from "../../Components/Upload/UpdateCustomer";
import { debounce } from "../../Utility/Debounce";
import { SearchCustomer } from "../../Utility/Search";
import { DbUser, GetUserModal } from "../../models/UserModels";
import { User } from "firebase/auth";
import { BiCategory } from "react-icons/bi";
import { FaRegStar } from "react-icons/fa";
import { Button } from "../../Components/Common/Button/Button";

const AllCustomers = () => {
  const [totalData, setTotalData] = useState<number>();
  const [isFilter, setIsFilter] = useState<string>();
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
  const [pagination, setPagination] = useState<{
    currentPage: number;
    perPage: number;
  }>({ currentPage: 1, perPage: 2 });
  const [currentDoc, setCurrentDoc] = useState<{
    currentFirstDoc: string;
    currentLastDoc: string;
  }>();

  const handleCustomerData = async (data: GetUserModal) => {
    setLoading(true);
    try {
      const AllCustomers = (await getUser({
        path: data.path,
        filter: data.filter,
        pageSize: data.pageSize,
        direction: data.direction,
        sort: data.sort,
        currentFirstDoc: data.currentFirstDoc,
        currentLastDoc: data.currentLastDoc,
      })) as {
        currentFirstDoc: string;
        currentLastDoc: string;
        users: DbUser[];
        length: number;
      };
      const customerList = await aggregateCustomerData(AllCustomers.users);
      setOriginalData((prev) => {
        return [
          ...prev,
          ...customerList.filter(
            (data) => !prev.some((user) => user.id === data.id)
          ),
        ];
      });
      setInitialCustomer((prev) => {
        return [
          ...prev,
          ...customerList.filter(
            (data) => !prev.some((user) => user.id === data.id)
          ),
        ];
      });
      setTotalData(AllCustomers.length);
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
    const toastLoader = toast.loading("Deleting customer...");
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
      await addLogs({
        action: "delete",
        date: new Date(),
        detail: `bulk delete : customer :  ${JSON.stringify(
          customer
        )}, chef : ${JSON.stringify(chef)}, admin: ${JSON.stringify(admin)} `,
      });
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
    console.log(id);
    if (!id) return toast.error("Customer not found");
    const findCustomer = initialCustomer?.find(
      (customer) => customer.id === id
    );
    const toastLoader = toast.loading("Deleting customer...");
    try {
      await deletUser({
        role: findCustomer?.role as string,
        uid: findCustomer?.id as string,
      });

      toast.dismiss(toastLoader);
      toast.success("Succesfully deleted");
      const refreshCustomer = initialCustomer?.filter((data) => data.id !== id);
      setInitialCustomer(refreshCustomer);
      setIsDelete(true);
    } catch (error) {
      toast.dismiss(toastLoader);
      toast.error("Error while delting user");
      throw new Error("Error while deleting user" + error);
    }
  };

  const handleSelect = async (value: string) => {
    const newOrder = sortOrder.order === "asc" ? "desc" : "asc";

    if (value === "order") {
      newOrder === "asc"
        ? await handleCustomerData({
            direction: "next",
            filter: "fullName",
            pageSize: pagination.perPage,
            path: "admin",
            sort: "asc",
            currentFirstDoc: currentDoc?.currentFirstDoc,
          })
        : await handleCustomerData({
            direction: "next",
            filter: "fullName",
            pageSize: pagination.perPage,
            path: "admin",
            sort: "desc",
            currentFirstDoc: currentDoc?.currentFirstDoc,
          });
    }
    if (value === "amount") {
      newOrder === "asc"
        ? await handleCustomerData({
            direction: "next",
            filter: "fullName",
            pageSize: pagination.perPage,
            path: "admin",
            sort: "asc",
            currentFirstDoc: currentDoc?.currentFirstDoc,
          })
        : await handleCustomerData({
            direction: "next",
            filter: "fullName",
            pageSize: pagination.perPage,
            path: "admin",
            sort: "desc",
            currentFirstDoc: currentDoc?.currentFirstDoc,
          });
    }

    setSortOrder({ field: value, order: newOrder });
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

  const handleChangeUser = (value: "customer" | "admin" | "chef") => {
    setIsFilter(value);
    if (value === "admin") {
      handleCustomerData({
        path: "admin",
        direction: "next",
        filter: "fullName",
        pageSize: pagination.perPage,
        sort: "asc",
        currentFirstDoc: currentDoc?.currentFirstDoc,
        currentLastDoc: currentDoc?.currentLastDoc,
      });
    }
    if (value === "chef") {
      handleCustomerData({
        path: "chef",
        direction: "next",
        filter: "fullName",
        pageSize: pagination.perPage,
        sort: "asc",
        currentFirstDoc: currentDoc?.currentFirstDoc,
        currentLastDoc: currentDoc?.currentLastDoc,
      });
    }
    if (value === "customer") {
      handleCustomerData({
        path: "customer",
        direction: "next",
        filter: "fullName",
        pageSize: pagination.perPage,
        sort: "asc",
        currentFirstDoc: currentDoc?.currentFirstDoc,
        currentLastDoc: currentDoc?.currentLastDoc,
      });
    }
  };

  useEffect(() => {
    if (sortOrder.field === "") {
      setInitialCustomer(originalData);
    }
  }, [sortOrder.field, originalData]);

  useEffect(() => {
    if (
      initialCustomer.length <= 0 ||
      !isFilter?.length ||
      !sortOrder.field.length
    ) {
      handleCustomerData({
        path: "customer",
        direction: "next",
        filter: "fullName",
        pageSize: pagination.perPage,
        sort: "asc",
        currentFirstDoc: currentDoc?.currentFirstDoc,
        currentLastDoc: currentDoc?.currentLastDoc,
      });
    }
  }, [
    initialCustomer.length,
    currentDoc?.currentFirstDoc,
    currentDoc?.currentLastDoc,
    pagination.perPage,
    isFilter?.length,
    sortOrder.field.length,
  ]);

  useEffect(() => {
    if (
      pagination.currentPage > 1 &&
      currentDoc?.currentFirstDoc &&
      currentDoc?.currentFirstDoc.length > 1
    ) {
      (async () => {
        const customers = (await getUser({
          path: "customer",
          pageSize: pagination.perPage,
          direction: "next",
          filter: "fullName",
          sort: "asc",
          currentFirstDoc: currentDoc.currentFirstDoc,
        })) as {
          currentFirstDoc: string;
          currentLastDoc: string;
          users: DbUser[];
        };
        setCurrentDoc((prev) => ({
          ...prev,
          currentFirstDoc: customers.currentFirstDoc,
          currentLastDoc: customers.currentLastDoc,
        }));
        const aggregateCustomer = await aggregateCustomerData(customers.users);
        setInitialCustomer((customer) => {
          return [
            ...customer,
            ...aggregateCustomer.filter(
              (user) => !customer.some((cust) => user.id === cust.id)
            ),
          ];
        });
      })();
    }
  }, [currentDoc?.currentFirstDoc, pagination.currentPage, pagination.perPage]);

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
            <DeleteButton
              dataLength={bulkSelectedCustomer.length}
              deleteFn={() => setIsBulkDelete(true)}
            />
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
            {isFilter && (
              <div className="flex w-[150px]  items-center rounded-lg border  justify-between p-2">
                <div className="flex gap-1 items-center justify-center">
                  <span className="  text-sm ">{isFilter.toLowerCase()}</span>
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
                <button onClick={() => setIsFilter(undefined)} className=" ">
                  <X className="text-[var(--danger-text)] " size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="z-[100]">
          <Button
            bodyStyle={{
              width: "150px",
              top: "3.5rem",
              left: "-2.7rem",
            }}
            parent={
              <div className="flex border px-4 py-2 rounded items-center justify-start gap-3">
                <Filter className="size-5 text-[var(--dark-secondary-text)]" />
                <span className=" text-[17px] tracking-wide text-[var(--dark-secondary-text)]">
                  Filter
                </span>
              </div>
            }
            children={[
              <FilterButton
                bodyStyle={{
                  width: "150px",
                  top: "-0.3rem",
                  left: "-10rem",
                }}
                sortOrder={sortOrder.order}
                onSelect={handleSelect}
                children={[
                  { label: "Amount", value: "amount" },
                  { label: "Order", value: "order" },
                ]}
              />,
              <FilterButton
                bodyStyle={{ width: "150px", top: "-2.9rem", left: "-10rem" }}
                children={[
                  {
                    label: (
                      <div className="flex items-center justify-start gap-2">
                        <span className="text-[17px] tracking-wide ">
                          Customer
                        </span>
                      </div>
                    ),
                    value: "customer",
                  },
                  {
                    label: (
                      <div className="flex items-center justify-start gap-2">
                        <span className="text-[17px] tracking-wide ">
                          Admin
                        </span>
                      </div>
                    ),
                    value: "admin",
                  },
                  {
                    label: (
                      <div className="flex items-center justify-start gap-2">
                        <span className="text-[17px] tracking-wide ">Chef</span>
                      </div>
                    ),
                    value: "chef",
                  },
                ]}
                parent={
                  <div className="flex py-1.5 px-2 items-center justify-start gap-2">
                    <UserCheck className="size-5  " />
                    <span className="tracking-wide text-[17px] ">Category</span>
                  </div>
                }
                onSelect={(value) =>
                  handleChangeUser(value as "customer" | "admin" | "chef")
                }
              />,
            ]}
          />
        </div>
      </div>
      <CustomerTable
        totalData={3}
        onPageChange={(page) =>
          setPagination((prev) => ({ ...prev, currentPage: page }))
        }
        pagination={{
          currentPage: pagination.currentPage,
          perPage: pagination.perPage,
        }}
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
