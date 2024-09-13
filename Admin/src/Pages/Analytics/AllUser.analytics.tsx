import { useCallback, useEffect, useState } from "react";
import { aggregateCustomerData } from "../../Utility/user.utils";
import { User } from "../../models/user.model";
import { CustomerTable } from "../User/User.page.table";
import {
  bulkDeleteOfCustomer,
  deletUser,
  getUsers,
  searchUser,
} from "../../Services/user.services";
import { addLogs } from "../../Services/log.services";
import toast from "react-hot-toast";
import { Filter, X } from "lucide-react";
import Delete, { DeleteButton } from "../../Components/Common/Delete/Delete";
import Modal from "../../Components/Common/Popup/Popup";
import UpdateCustomer from "../../Components/Upload/User.upload";
import { debounce } from "../../Utility/debounce";
import { SearchCustomer } from "../../Utility/user.utils";
import { DbUser, GetUserModal } from "../../models/user.model";
import { Button } from "../../Components/Common/Button/Button";

const AllCustomers = () => {
  const [totalData, setTotalData] = useState<number>();
  const [isFilter, setIsFilter] = useState<{
    typeFilter?: "customer" | "admin" | "chef" | string;
    sortFilter?: string;
  }>();
  const [loading, setLoading] = useState<boolean>(false);
  const [initialCustomer, setInitialCustomer] = useState<User[]>([]);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | undefined>("asc");
  const [bulkSelectedCustomer, setBulkSelectedCustomer] = useState<
    { id: string; role: "customer" | "admin" | "chef" }[]
  >([]);
  const [isEdit, setIsEdit] = useState<boolean>(true);
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [isBulkDelete, setIsBulkDelete] = useState<boolean>(false);
  const [id, setId] = useState<string>();
  const [customerModal, setCustomerModal] = useState<User>();
  const [pagination, setPagination] = useState<{
    currentPage: number;
    perPage: number;
  }>({ currentPage: 1, perPage: 5 });
  const [currentDoc, setCurrentDoc] = useState<{
    currentFirstDoc: string;
    currentLastDoc: string;
  }>();

  const handleCustomerData = async ({
    direction,
    filter,
    pageSize,
    path,
    sort,
    currentFirstDoc,
    currentLastDoc,
  }: GetUserModal) => {
    setLoading(true);
    try {
      const user = await getUsers({
        path: path,
        pageSize: pageSize,
        filter: filter,
        direction: direction,
        sort: sort,
        currentFirstDoc: currentFirstDoc || null,
        currentLastDoc: currentLastDoc || null,
      });

      const users = user.data as {
        currentFirstDoc: string;
        currentLastDoc: string;
        users: User[];
        length: number;
      };

      setCurrentDoc({
        currentFirstDoc: users.currentFirstDoc,
        currentLastDoc: users.currentLastDoc,
      });
      setTotalData(users.length);
      setInitialCustomer(users.users);
    } catch (error) {
      setLoading(false);
      throw new Error(`Error while getting customers : ${error}`);
    }
    setLoading(false);
  };

  const handleBulkSelected = (id: string, isChecked: boolean) => {
    const refreshIds = bulkSelectedCustomer?.filter(
      (product) => product.id !== id
    );

    isChecked
      ? setBulkSelectedCustomer(
          (prev): { id: string; role: "customer" | "admin" | "chef" }[] => {
            const newCustomer = prev?.filter((category) => category.id !== id);
            const findCustomer = initialCustomer.find(
              (category) => category?.uid === id
            );
            return newCustomer
              ? [
                  ...newCustomer,
                  {
                    id: findCustomer?.uid as string,
                    role: findCustomer?.role as "customer" | "admin" | "chef",
                  },
                ]
              : [
                  {
                    id: findCustomer?.uid as string,
                    role: findCustomer?.role as "customer" | "admin" | "chef",
                  },
                ];
          }
        )
      : setBulkSelectedCustomer(refreshIds);
  };
  const handleAllSelected = (isChecked: boolean) => {
    if (isChecked) {
      const AllCategories = initialCustomer?.map((customer) => {
        return { id: customer.uid as string, role: customer.role };
      });
      setBulkSelectedCustomer(
        AllCategories as { id: string; role: "customer" | "admin" | "chef" }[]
      );
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
      const refreshCategory = initialCustomer.filter((user) => {
        return (
          !customer.includes(user.uid as string) &&
          !admin.includes(user.uid as string)
        );
      });

      setInitialCustomer(refreshCategory);
      toast.success("Successfully deleted");
    } catch (error) {
      toast.dismiss(toastLoader);
      toast.error("Error while deleting...");
      throw new Error("Error while bulk user delete" + error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!id) return toast.error("Customer not found");
    const findCustomer = initialCustomer?.find(
      (customer) => customer.uid === id
    );
    const toastLoader = toast.loading("Deleting customer...");
    try {
      await deletUser({
        role: findCustomer?.role as string,
        uid: findCustomer?.uid as string,
      });

      toast.dismiss(toastLoader);
      toast.success("Succesfully deleted");
      const refreshCustomer = initialCustomer?.filter(
        (data) => data.uid !== id
      );
      setInitialCustomer(refreshCustomer);
      setIsDelete(true);
    } catch (error) {
      toast.dismiss(toastLoader);
      toast.error("Error while delting user");
      throw new Error("Error while deleting user" + error);
    }
  };

  // search user
  const handleChange = async (value: string) => {
    if (value.length <= 0)
      return handleCustomerData({
        path:
          (isFilter?.typeFilter as "admin" | "customer" | "chef") || "customer",
        direction: "next",
        filter: (isFilter?.sortFilter as keyof User) || "fullName",
        pageSize: pagination.perPage,
        sort: sortOrder || "asc",
        currentFirstDoc: null,
        currentLastDoc: null,
      });
    const filterCustomer = await searchUser(value);
    const aggregateUser = await aggregateCustomerData(filterCustomer);
    setCurrentDoc({ currentFirstDoc: "", currentLastDoc: "" });
    setInitialCustomer(aggregateUser);
  };

  const debouncedHandleChange = useCallback(debounce(handleChange, 350), [
    initialCustomer,
  ]);
  // call getUser fn based on changing the current page number
  useEffect(() => {
    if (pagination.currentPage === 1) {
      handleCustomerData({
        path:
          (isFilter?.typeFilter as "admin" | "customer" | "chef") || "customer",
        direction: "next",
        filter: (isFilter?.sortFilter as keyof User) || "fullName",
        pageSize: pagination.perPage,
        sort: sortOrder || "asc",
        currentFirstDoc: null,
        currentLastDoc: null,
      });
    }
  }, [
    pagination.perPage,
    isFilter?.sortFilter,
    isFilter?.typeFilter,
    sortOrder,
    pagination.currentPage,
  ]);

  useEffect(() => {
    if (
      pagination.currentPage > 1 &&
      currentDoc?.currentFirstDoc &&
      currentDoc.currentLastDoc
    ) {
      (async () => {
        setLoading(true);
        const customers = await getUsers({
          path:
            (isFilter?.typeFilter as "customer" | "admin" | "chef") ||
            "customer",
          pageSize: pagination.perPage,
          direction: "next",
          filter: (isFilter?.sortFilter as keyof User) || "fullName",
          sort: (isFilter?.sortFilter as "asc" | "desc") || "asc",
          currentFirstDoc: currentDoc && currentDoc.currentFirstDoc,
          currentLastDoc: currentDoc && currentDoc.currentLastDoc,
        });

        const users = customers.data as {
          currentFirstDoc: string;
          currentLastDoc: string;
          users: DbUser[];
          length: number;
        };
        setCurrentDoc({
          currentFirstDoc: users.currentFirstDoc,
          currentLastDoc: users.currentLastDoc,
        });
        setTotalData(users.length);

        setInitialCustomer((customer) => {
          return [
            ...customer,
            ...users.users.filter(
              (user) => !customer.some((cust) => user.uid === cust.uid)
            ),
          ];
        });
        setLoading(false);
      })();
    }
  }, [
    pagination.currentPage,
    pagination.perPage,
    isFilter?.sortFilter,
    isFilter?.typeFilter,
  ]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-5 px-3 py-5">
      <div className="flex sm:flex-row flex-col items-start sm:items-center justify-between flex-grow w-full gap-5 px-3 pb-6">
        <div className="flex flex-col w-full items-start justify-center gap-3">
          <div className="flex flex-col -space-y-1.5 items-start justify-center gap-1">
            <h4 className="text-[1.25rem] font-[600] tracking-wider text-[var(--dark-text)]">
              All Customers
            </h4>
            <p className="text-[15px] tracking-wider text-[var(--dark-secondary-text)] text-nowrap ">
              {totalData || 0} entries found
            </p>
          </div>
          <div className="flex w-full items-center justify-start gap-2">
            <form
              action=""
              className="relative text-[var(--darkt-text)] w-full sm:w-auto "
            >
              <input
                id="search"
                type="search"
                onChange={(event) => debouncedHandleChange(event?.target.value)}
                className=" border placeholder:tracking-wider placeholder:text-[16px] placeholder:text-[var(--dark-secondary-text)] outline-none sm:w-[300px] w-full py-2 px-2  border-[var(--dark-border)] bg-[var(--light-background)] rounded-lg  ring-[var(--primary-color)] focus:ring-[3px] duration-150 "
                placeholder="Search for products"
              />
            </form>
            <div className="h-10  w-[1px] bg-[var(--dark-border)] "></div>
            <DeleteButton
              dataLength={bulkSelectedCustomer.length}
              deleteFn={() => setIsBulkDelete(true)}
            />
            {isFilter?.sortFilter && (
              <div className="flex px-2 py-0.5  gap-3 border-[var(--dark-secondary-text)]  items-center rounded border  justify-start">
                <div className="flex gap-1 items-center justify-center">
                  <span className="  text-[15px] text-[var(--dark-secondary-text)] ">
                    {isFilter.sortFilter.toLowerCase()}
                  </span>
                </div>
                <button
                  onClick={() =>
                    setIsFilter((prev) => ({ ...prev, sortFilter: "" }))
                  }
                >
                  <X className="text-[var(--danger-text)] " size={20} />
                </button>
              </div>
            )}
            {isFilter?.typeFilter && (
              <div className="flex px-2 py-0.5  gap-3 border-[var(--dark-secondary-text)]  items-center rounded border  justify-start">
                <div className="flex gap-1 items-center justify-center">
                  <span className="  text-[15px] text-[var(--dark-secondary-text)] ">
                    {isFilter.typeFilter.toLowerCase()}
                  </span>
                </div>
                <button
                  onClick={() =>
                    setIsFilter((prev) => ({ ...prev, typeFilter: "" }))
                  }
                >
                  <X className="text-[var(--danger-text)] " size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
        <div>
          <Button
            bodyStyle={{
              width: "400px",
              top: "3rem",
              left: "-18rem",
            }}
            parent={
              <div className="flex border-[1px] border-[var(--dark-border)] px-4 py-2 rounded items-center justify-start gap-2">
                <Filter
                  strokeWidth={2.5}
                  className="size-5 text-[var(--dark-secondary-text)]"
                />
                <p className="text-[16px] text-[var(--dark-secondary-text)] tracking-widest ">
                  Filter
                </p>
              </div>
            }
            checkFn={{
              checkSortFn: (isChecked, value) => {
                if (!isChecked) {
                  return setIsFilter((prev) => ({ ...prev, sortFilter: "" }));
                }
                if (isChecked) {
                  setIsFilter((prev) => ({ ...prev, sortFilter: value }));
                }
              },
              checkTypeFn: (isChecked, value) => {
                if (!isChecked) {
                  return setIsFilter((prev) => ({ ...prev, typeFilter: "" }));
                }
                if (isChecked) {
                  setIsFilter((prev) => ({ ...prev, typeFilter: value }));
                }
              },
            }}
            types={[
              { label: "Admin", value: "admin", id: "sfksdjlk" },
              { label: "Customer", value: "customer", id: "fkldsjfks" },
              { label: "Chef", value: "chef", id: "fkldjs" },
            ]}
            sort={[
              { label: "Orders", value: "orders", id: "flksjd" },
              { label: "Amount", value: "amount", id: "lfkjds" },
            ]}
            sortFn={(type: "asc" | "desc") => setSortOrder(type)}
          />
        </div>
      </div>
      <CustomerTable
        totalData={totalData || 1}
        onPageChange={(page) =>
          setPagination((prev) => ({ ...prev, currentPage: page }))
        }
        pagination={{
          currentPage: pagination.currentPage,
          perPage: pagination.perPage,
        }}
        selectedData={bulkSelectedCustomer}
        users={initialCustomer as User[]}
        loading={loading}
        actions={{
          delete: (id) => {
            setIsDelete(true);
            setId(id);
          },
          edit: (id) => {
            const findCustomer = initialCustomer?.find(
              (customer) => customer.uid == id
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
            customerInfo={customerModal as User}
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
