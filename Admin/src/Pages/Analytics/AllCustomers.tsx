import { useEffect, useState } from "react";
import { FilterButton } from "../../Components/Common/Sorting/Sorting";
import Table from "../../Components/Common/Table/Table";
import { ProductTable } from "../../models/productMode";
import { getCustomerData } from "../../firebase/db";
import { aggregateCustomerData } from "../../Utility/CustomerUtils";
import { CustomerType } from "../../models/user.model";
import { CustomerTable } from "../Customers/CustomerTable";
import { bulkDeleteOfCategory } from "../../Services";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";
import Delete from "../../Components/Common/Delete/Delete";

const AllCustomers = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [initialCustomer, setInitialCustomer] = useState<CustomerType[]>([]);
  const [bulkSelectedCustomer, setBulkSelectedCustomer] = useState<
    { id: string }[]
  >([]);
  const [isEdit, setIsEdit] = useState<boolean>(true);
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [id, setId] = useState<string>();

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

  const handleBulkSelected = (id: string, isChecked: boolean) => {
    const refreshIds = bulkSelectedCustomer?.filter(
      (product) => product.id !== id
    );

    isChecked
      ? setBulkSelectedCustomer((prev) => {
          const newCategory = prev?.filter((category) => category.id !== id);
          const findProduct = initialCustomer?.find(
            (category) => category.id === id
          );
          return newCategory
            ? [...newCategory, { id: findProduct?.id }]
            : [{ id: findProduct?.id }];
        })
      : setBulkSelectedCustomer(refreshIds);
  };
  const handleAllSelected = (isChecked: boolean) => {
    if (isChecked) {
      const AllCategories = initialCustomer?.map((product) => {
        return { id: product.id };
      });
      setBulkSelectedCustomer(AllCategories as { id: string }[]);
    }
    if (!isChecked) {
      setBulkSelectedCustomer([]);
    }
  };

  const handleSelectedDelete = async () => {
    try {
      const toastLoader = toast.loading("Deleting category...");
      const AllCategoriesId = bulkSelectedCustomer?.map(
        (category) => category.id
      );
      await bulkDeleteOfCategory(AllCategoriesId);
      toast.dismiss(toastLoader);
      const refreshCategory = initialCustomer.filter((category) => {
        return !AllCategoriesId.includes(category.id as string);
      });
      setInitialCustomer(refreshCategory);
      toast.success("Successfully deleted");
    } catch (error) {
      console.error("Error deleting products:", error);
      // Handle the error appropriately, e.g., show a notification to the user
    }
  };

  useEffect(() => {
    handleCustomerData();
  }, []);
  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-5 px-3 py-5">
      <div className="flex items-center justify-between flex-grow w-full gap-5 px-3 pb-6">
        <div className="flex items-center justify-center gap-1">
          <p className="text-xl text-nowrap">Customers</p>
          <div className="h-5  w-[1px] bg-gray-300 "></div>
          <button
            disabled={bulkSelectedCustomer.length >= 1 ? false : true}
            onClick={() => setIsDelete(true)}
          >
            <Trash2 className="size-7" />
          </button>
        </div>
        <div>
          <FilterButton
            sortOrder=""
            onSelect={() => {}}
            sortingOptions={["Asc", "Desc"]}
          />
        </div>
      </div>
      <CustomerTable
        selectedData={bulkSelectedCustomer}
        users={initialCustomer as CustomerType[]}
        loading={loading}
        actions={{
          delete: (id) => console.log(id),
          edit: (id) => console.log(id),
          checkFn: (id: string, isChecked: boolean) =>
            handleBulkSelected(id, isChecked),
          checkAllFn: (isCheck: boolean) => handleAllSelected(isCheck),
        }}
      />
      {isDelete && (
        <Delete
          closeModal={() => setIsDelete(false)}
          id={id}
          isClose={isDelete}
          setDelete={() => handleSelectedDelete()}
        />
      )}
    </div>
  );
};

export default AllCustomers;
