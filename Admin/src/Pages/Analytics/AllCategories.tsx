import { useEffect, useState } from "react";
import { FilterButton } from "../../Components/Common/Sorting/Sorting";
import Table from "../../Components/Common/Table/Table";
import { CategoryTable } from "../Category/CategoryTable";
import { CategoryType } from "../../models/category.model";
import { bulkDeleteOfCategory, getCategories } from "../../Services";
import toast from "react-hot-toast";
import Delete from "../../Components/Common/Delete/Delete";
import Modal from "../../Components/Common/Popup/Popup";
import UpdateCategory from "../../Components/Upload/UpdateCategory";
import { ArrowDownAZ, ChevronUp, Trash2, X } from "lucide-react";

const AllCategories = () => {
  const [initialCategory, setInitialCategory] = useState<CategoryType[]>([]);
  const [originalData, setOriginalData] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [bulkSelectedCategory, setBulkSelectedCategory] = useState<
    { id: string }[]
  >([]);
  const [id, setId] = useState<string>();
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [isBulkDelete, setIsBulkDelete] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(true);
  const [sortOrder, setSortOrder] = useState({ field: "", order: "desc" });

  const getAllCategories = async () => {
    setLoading(true);
    try {
      const categories = await getCategories();
      const categorydata: CategoryType[] = categories.map((category) => ({
        id: category.id,
        name: category.name,
        item: 55,
        order: 100,
        rank: Math.floor(Math.random() * (50 - 10 + 1)) + 10,
        revenue: 15000,
        image: category.image,
      }));
      setOriginalData(categorydata);
      setInitialCategory(categorydata);
    } catch (error) {
      setLoading(false);
      return console.log(`Error found while fetching category` + error);
    }
    setLoading(false);
  };

  const handleBulkSelected = (id: string, isChecked: boolean) => {
    const refreshIds = bulkSelectedCategory?.filter(
      (product) => product.id !== id
    );

    isChecked
      ? setBulkSelectedCategory((prev) => {
          const newCategory = prev?.filter((category) => category.id !== id);
          const findProduct = initialCategory?.find(
            (category) => category.id === id
          );
          return newCategory
            ? [...newCategory, { id: findProduct?.id }]
            : [{ id: findProduct?.id }];
        })
      : setBulkSelectedCategory(refreshIds);
  };
  const handleAllSelected = (isChecked: boolean) => {
    if (isChecked) {
      const AllCategories = initialCategory?.map((product) => {
        return { id: product.id };
      });
      setBulkSelectedCategory(AllCategories as { id: string }[]);
    }
    if (!isChecked) {
      setBulkSelectedCategory([]);
    }
  };

  const handleSelectedDelete = async () => {
    try {
      const toastLoader = toast.loading("Deleting category...");
      const AllCategoriesId = bulkSelectedCategory?.map(
        (category) => category.id
      );
      await bulkDeleteOfCategory(AllCategoriesId);
      toast.dismiss(toastLoader);
      const refreshCategory = initialCategory.filter((category) => {
        return !AllCategoriesId.includes(category.id as string);
      });
      setInitialCategory(refreshCategory);
      toast.success("Successfully deleted");
    } catch (error) {
      console.error("Error deleting products:", error);
      // Handle the error appropriately, e.g., show a notification to the user
    }
  };

  const handleSelect = async (value: string) => {
    const newOrder = sortOrder.order === "asc" ? "desc" : "asc";

    let sortedCustomers;
    if (value === "Items") {
      sortedCustomers = [...initialCategory].sort(
        (a: CategoryType, b: CategoryType) =>
          newOrder === "desc"
            ? (((b.item as number) - a.item) as number)
            : (((a.item as number) - b.item) as number)
      );
    }
    if (value === "Orders") {
      sortedCustomers = [...initialCategory]?.sort((a, b) =>
        newOrder == "desc" ? (b.order = a.order) : a.order - b.order
      );
    }
    if (value === "Revenue") {
      sortedCustomers = [...initialCategory]?.sort((a, b) =>
        newOrder == "desc" ? (b.revenue = a.revenue) : a.revenue - b.revenue
      );
    }
    if (value === "Rank") {
      sortedCustomers = [...initialCategory]?.sort((a, b) =>
        newOrder == "desc" ? (b.rank = a.rank) : a.rank - b.rank
      );
    }

    setSortOrder({ field: value, order: newOrder });
    setInitialCategory(sortedCustomers as CategoryType[]);
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  useEffect(() => {
    if (sortOrder?.field === "") {
      setInitialCategory(originalData);
    }
  }, [originalData, sortOrder?.field]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-5 px-3 py-5">
      <div className="flex items-center justify-between flex-grow w-full gap-5 px-3 pb-6">
        <div className="flex items-center justify-center gap-3">
          <p className="text-xl text-nowrap">Categories</p>
          <div className="h-5  w-[1px] bg-gray-300 "></div>
          <button disabled={bulkSelectedCategory.length > 0 ? false : true}>
            <Trash2
              onClick={() => {
                setIsBulkDelete(true);
              }}
              className="size-7"
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
              <button onClick={() => setSortOrder({ field: "" })} className=" ">
                <X className="text-[var(--danger-text)] " size={20} />
              </button>
            </div>
          )}
        </div>
        <div className="z-[100]">
          <FilterButton
            onSelect={handleSelect}
            sortOrder={sortOrder.order}
            sortingOptions={["Items", "Orders", "Revenue", "Rank"]}
          />
        </div>
      </div>
      <CategoryTable
        selectedData={bulkSelectedCategory}
        loading={loading}
        category={initialCategory}
        actions={{
          checkFn: (id, isChecked) => handleBulkSelected(id, isChecked),
          delete: (id) => {
            setId(id);
            setIsDelete(true);
          },
          edit: (id) => {
            setId(id);
            setIsEdit(false);
          },
          checkAllFn: (isChecked: boolean) => handleAllSelected(isChecked),
        }}
      />
      {isDelete && (
        <Delete
          closeModal={() => setIsDelete(false)}
          id={id as string}
          isClose={isDelete}
          setDelete={(id) => console.log(id)}
        />
      )}
      <Modal close={isEdit} closeModal={() => setIsEdit(true)}>
        <UpdateCategory id={id as string} closeModal={() => setIsEdit(true)} />
      </Modal>
      {isBulkDelete && (
        <Delete
          isClose={isBulkDelete}
          closeModal={() => setIsBulkDelete(false)}
          id={id as string}
          setDelete={() => handleSelectedDelete()}
        />
      )}
    </div>
  );
};

export default AllCategories;
