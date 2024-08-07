import { ChevronUp, Download, Filter, X } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { aggregateCustomerData } from "../../Utility/CustomerUtils";
import { CustomerType } from "../../models/user.model";
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
  const [isFilter, setIsFilter] = useState<string>();
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
      const user = (await getUser({
        path: path,
        pageSize: pageSize,
        filter: filter,
        direction: direction,
        sort: sort,
        currentFirstDoc: currentFirstDoc || null,
        currentLastDoc: currentLastDoc || null,
      })) as {
        currentFirstDoc: string;
        currentLastDoc: string;
        users: DbUser[];
        length: number;
      };

      setCurrentDoc({
        currentFirstDoc: user.currentFirstDoc,
        currentLastDoc: user.currentLastDoc,
      });
      setTotalData(user.length);

      const customerList = await aggregateCustomerData(user.users);
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
  const handleSelect = async (
    isChecked: boolean,
    value: "customer" | "admin" | "chef" | "orders" | "amount" | "role"
  ) => {
    if (!isChecked) return setIsFilter("");
    setIsFilter(value);
    try {
      if (value === "orders" && isChecked) {
        await handleCustomerData({
          direction: "next",
          filter: "fullName",
          pageSize: pagination.perPage,
          path: "admin",
          sort: "asc",
          currentFirstDoc: currentDoc?.currentFirstDoc,
        });
      }

      // if (value === "amount" && isChecked) {
      //   await handleCustomerData({
      //     direction: "next",
      //     filter: "fullName",
      //     pageSize: pagination.perPage,
      //     path: "admin",
      //     sort: "asc",
      //     currentFirstDoc: currentDoc?.currentFirstDoc,
      //   });
      // }
      if (value === "admin" && isChecked) {
        await handleCustomerData({
          path: "admin",
          direction: "next",
          filter: "fullName",
          pageSize: pagination.perPage,
          currentFirstDoc: currentDoc?.currentFirstDoc,
          currentLastDoc: currentDoc?.currentLastDoc,
          sort: "asc",
        });
      }
      if (value === "customer" && isChecked) {
        await handleCustomerData({
          path: "customer",
          direction: "next",
          filter: "fullName",
          pageSize: pagination.perPage,
          currentFirstDoc: currentDoc?.currentFirstDoc,
          currentLastDoc: currentDoc?.currentLastDoc,
          sort: "asc",
        });
      }
      if (value === "chef" && isChecked) {
        await handleCustomerData({
          path: "chef",
          direction: "next",
          filter: "fullName",
          pageSize: pagination.perPage,
          currentFirstDoc: currentDoc?.currentFirstDoc,
          currentLastDoc: currentDoc?.currentLastDoc,
          sort: "asc",
        });
      }
      // if (value === "order") {
      //   await handleCustomerData({
      //     path: "customer",
      //     direction: "next",
      //     filter: "fullName",
      //     pageSize: pagination.perPage,
      //     currentFirstDoc: currentDoc?.currentFirstDoc,
      //     currentLastDoc: currentDoc?.currentLastDoc,
      //     sort: "asc",
      //   });
      // }
    } catch (error) {
      throw new Error("Unable to show data" + error);
    }
  };

  useEffect(() => {
    if (initialCustomer.length <= 0 || isFilter?.length <= 0 ) {
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
    isFilter?.length,
    initialCustomer.length,
    currentDoc?.currentFirstDoc,
    currentDoc?.currentLastDoc,
    pagination.perPage,
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

  useEffect(() => {
    if (sortOrder.field === "") {
      setInitialCustomer(originalData);
    }
  }, [sortOrder, originalData]);

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
            <Button
              bodyStyle={{
                width: "400px",
                top: "3.5rem",
                left: "-18rem",
              }}
              parent={
                <div className="flex border px-4 py-2 rounded items-center justify-start gap-3">
                  <Filter className="size-5 text-[var(--dark-secondary-text)]" />
                  <span className=" text-[17px] tracking-wide text-[var(--dark-secondary-text)]">
                    Filter
                  </span>
                </div>
              }
              checkFn={(isChecked: boolean, value: string) => {
                handleSelect(isChecked, value as any);
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
        <form action="" className=" w-full sm:w-auto">
          <input
            id="search"
            type="search"
            onChange={(event) => debouncedHandleChange(event?.target.value)}
            className="border placeholder:text-sm placeholder:text-[var(--dark-secondary-text)] outline-none sm:w-[300px] w-full py-2 px-2  border-[var(--dark-secondary-background)] bg-[var(--light-background)] rounded-lg  focus:border-[var(--primary-color)] "
            placeholder="Search"
          />
        </form>
        {isFilter && (
          <div className="flex w-[150px]  items-center rounded-lg border  justify-between p-2">
            <div className="flex gap-1 items-center justify-center">
              <span className="  text-sm ">{isFilter.toLowerCase()}</span>
            </div>
            <button onClick={() => setIsFilter("")} className=" ">
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
