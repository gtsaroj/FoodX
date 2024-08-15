import { ChevronUp, Download, Filter, X } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { aggregateCustomerData } from "../../Utility/CustomerUtils";
import { CustomerType, User } from "../../models/user.model";
import { debounce } from "../../Utility/Debounce";
import { CustomerTable } from "./CustomerTable";
import "../../index.css";
import { SearchCustomer } from "../../Utility/Search";
import { getUser } from "../../Services";
import { DbUser, GetUserModal } from "../../models/UserModels";
import { Button } from "../../Components/Common/Button/Button";

const CustomerList: React.FC = () => {
  const [initialCustomer, setInitialCustomer] = useState<CustomerType[]>([]);
  const [originalData, setOriginalData] = useState<CustomerType[]>([]);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<{
    currentPage: number;
    perPage: number;
  }>({ currentPage: 1, perPage: 3 });
  const [currentDoc, setCurrentDoc] = useState<{
    currentFirstDoc: string;
    currentLastDoc: string;
  }>();
  const [isFilter, setIsFilter] = useState<{
    typeFilter?: "admin" | "customer" | "chef" | string;
    sortFilter?: string;
  }>();
  const [totalData, setTotalData] = useState<number>();

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
      let user;
      if (pagination.currentPage > 1) {
        user = await getUser({
          path: path,
          pageSize: pageSize,
          filter: filter,
          direction: direction,
          sort: sort,
          currentFirstDoc: currentDoc?.currentFirstDoc || null,
          currentLastDoc: currentDoc?.currentLastDoc || null,
        });
      }
      if (pagination.currentPage === 1) {
        user = await getUser({
          path: path,
          pageSize: pageSize,
          filter: filter,
          direction: direction,
          sort: sort,
          currentFirstDoc: currentFirstDoc || null,
          currentLastDoc: currentLastDoc || null,
        });
      }
      const getUsers = user.data as {
        currentFirstDoc: string;
        currentLastDoc: string;
        users: DbUser[];
        length: number;
      };
      setCurrentDoc({
        currentFirstDoc: getUsers.currentFirstDoc,
        currentLastDoc: getUsers.currentLastDoc,
      });
      setTotalData(getUser.length);
      const customerList = await aggregateCustomerData(getUsers.users);
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

  useEffect(() => {
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
  }, [
    pagination.perPage,
    isFilter?.sortFilter,
    isFilter?.typeFilter,
    sortOrder,
  ]);

  useEffect(() => {
    if (
      pagination.currentPage > 1 &&
      currentDoc?.currentFirstDoc &&
      currentDoc?.currentFirstDoc.length > 1
    ) {
      (async () => {
        const customers = (await getUser({
          path:
            (isFilter?.typeFilter as "customer" | "admin" | "chef") ||
            "customer",
          pageSize: pagination.perPage,
          direction: "next",
          filter: (isFilter?.sortFilter as keyof User) || "fullName",
          sort: "asc",
          currentFirstDoc: currentDoc.currentFirstDoc,
          currentLastDoc: currentDoc.currentLastDoc,
        })) as {
          currentFirstDoc: string;
          currentLastDoc: string;
          users: DbUser[];
          length: number;
        };
        setCurrentDoc({
          currentFirstDoc: customers.currentFirstDoc,
          currentLastDoc: customers.currentLastDoc,
        });
        setTotalData(customers.length);
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
  }, [
    pagination.currentPage,
    pagination.perPage,
    currentDoc?.currentLastDoc,
    currentDoc?.currentFirstDoc,
    isFilter?.sortFilter,
    isFilter?.typeFilter,
  ]);

  return (
    <div className="flex flex-col items-start justify-center w-full gap-5 px-5 py-2 2xl:container">
      <div className="flex items-center justify-between w-full px-2 pt-5">
        <div className="flex flex-col -space-y-1.5 items-start justify-center gap-1">
          <h4 className="text-[1.25rem] font-[600] tracking-wider text-[var(--dark-text)]">
            All Customers
          </h4>
          <p className="text-[15px] tracking-wider text-[var(--dark-secondary-text)] text-nowrap ">
            {totalData || 0} entries found
          </p>
        </div>
        <div className="flex items-center justify-center gap-5 ">
          <div className="flex  items-center justify-center gap-2">
            <button className="flex items-center gap-2 justify-center bg-[var(--primary-color)] text-[var(--dark-text)] py-[0.5rem] border-[1px] border-[var(--primary-color)] px-4 rounded">
              <Download strokeWidth={2.5} className="size-5" />
              <p className="text-[16px] tracking-widest ">Export</p>
            </button>
            <Button
              bodyStyle={{
                width: "400px",
                top: "3.5rem",
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
                checkSortFn: (isChecked: boolean, value: string) => {
                  if (!isChecked) {
                    return setIsFilter((prev) => ({ ...prev, sortFilter: "" }));
                  }

                  setIsFilter((prev) => ({ ...prev, sortFilter: value }));
                },
                checkTypeFn: (
                  isChecked: boolean,
                  value: "admin" | "chef" | "customer"
                ) => {
                  if (!isChecked) {
                    return setIsFilter((prev) => ({ ...prev, typeFilter: "" }));
                  }
                  setIsFilter((prev) => ({ ...prev, typeFilter: value }));
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
                { label: "Role", value: "role", id: "fldkjs" },
              ]}
              sortFn={(type: "asc" | "desc") =>
                setSortOrder(type as "asc" | "desc")
              }
            />
          </div>
        </div>
      </div>
      <div className="flex sm:flex-row flex-col items-start sm:items-center justify-start gap-8 sm:gap-2 w-full px-1">
        <form action="" className="relative w-full ">
          <input
            id="search"
            type="search"
            onChange={(event) => debouncedHandleChange(event?.target.value)}
            className=" border placeholder:tracking-wider placeholder:text-[16px] placeholder:text-[var(--dark-secondary-text)] outline-none sm:w-[300px] w-full py-2 px-2  border-[var(--dark-border)] bg-[var(--light-background)] rounded-lg  ring-[var(--primary-color)] focus:ring-[3px] duration-150 "
            placeholder="Search for products"
          />
        </form>
        {isFilter?.sortFilter && (
          <div className="flex px-2 py-0.5 gap-3 border-[var(--dark-secondary-text)]  items-center rounded border  justify-start">
            <div className="flex gap-1 items-center justify-center">
              <span className="text-[15px] text-[var(--dark-secondary-text)]">
                {isFilter.sortFilter?.toLocaleLowerCase()}
              </span>
            </div>
            <button
              onClick={() =>
                setIsFilter((prev) => ({ ...prev, sortFilter: "" }))
              }
              className=" "
            >
              <X className="text-[var(--danger-text)] " size={20} />
            </button>
          </div>
        )}
        {isFilter?.typeFilter && (
          <div className="flex px-2 py-0.5 gap-3 border-[var(--dark-secondary-text)]  items-center rounded border  justify-start">
            <div className="flex gap-1 items-center justify-center">
              <span className="text-[15px] text-[var(--dark-secondary-text)]">
                {isFilter.typeFilter?.toLocaleLowerCase()}
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
      <CustomerTable
        totalData={totalData}
        pagination={{
          currentPage: pagination.currentPage,
          perPage: pagination.perPage,
        }}
        onPageChange={(page: number) =>
          setPagination((prev) => ({ ...prev, currentPage: page }))
        }
        loading={loading}
        users={initialCustomer}
      />
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
