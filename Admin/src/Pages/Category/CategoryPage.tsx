import { ChevronUp, Filter, Plus, Trash2, X } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import Modal from "../../Components/Common/Popup/Popup";
import { UploadCategory } from "../../Components/Upload/UploadCategory";
import { SearchCategory } from "../../Utility/Search";
import { debounce } from "../../Utility/Debounce";
import { DropDown } from "../../Components/Common/DropDown/DropDown";
import { FilterButton } from "../../Components/Common/Sorting/Sorting";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../Reducer/Store";
import { categoryAdd } from "../../Reducer/Action";
import UpdateCategory from "../../Components/Upload/UpdateCategory";
import {
  addLogs,
  bulkDeleteOfCategory,
  deleteCategory,
  getCategories,
} from "../../Services";
import toast from "react-hot-toast";
import { CategoryType } from "../../models/category.model";
import Delete, { DeleteButton } from "../../Components/Common/Delete/Delete";
import { CategoryTable } from "./CategoryTable";
import { Button } from "../../Components/Common/Button/Button";

export const CategoryPage: React.FC = () => {
  const [isUpdateModalOpen, setIsUpdateModelOpen] = useState<boolean>(true);
  const [isUploadModalOpen, setIsUPloadModalOpen] = useState<boolean>(true);
  const [initialCategory, setInitialCategory] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isBulkDelete, setIsBulkDeleted] = useState<boolean>(false);
  const [isFilter, setIsFilter] = useState<string>();
  const [bulkSelectedProduct, setBulkSelectedProduct] = useState<
    {
      category: "specials" | "products";
      id: string;
    }[]
  >([]);
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("asc");
  const [isEdit, setIsEdit] = useState<boolean>(true);
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [originalData, setOriginalData] = useState<CategoryType[]>([]);
  const [id, setId] = useState<string>();
  const [bulkSelectedCategory, setBulkSelectedCategory] = useState<
    { id: string }[]
  >([]);

  const dispatch = useDispatch<AppDispatch>();

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

  const getAllCategories = async () => {
    setLoading(true);
    try {
      const categories = await getCategories();
      const categorydata: CategoryType[] = categories.map((category) => ({
        id: category.id,
        name: category.name,
        item: Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000,
        order: Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000,
        rank: Math.floor(Math.random() * (50 - 10 + 1)) + 10,
        revenue: Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000,
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
      await addLogs({
        action: "delete",
        date: new Date(),
        detail: `Category bulk delete : ${JSON.stringify(AllCategoriesId)}`,
      });
      setInitialCategory(refreshCategory);
      toast.success("Successfully deleted");
    } catch (error) {
      console.error("Error deleting products:", error);
    }
    setIsBulkDeleted(false);
  };

  useEffect(() => {
    initialCategory.forEach((category) => dispatch(categoryAdd(category.name)));

    setInitialCategory(originalData);
  }, [initialCategory, dispatch, originalData]);

  useEffect(() => {
    getAllCategories();
  }, []);

  const SearchingCategories = async (value: string) => {
    if (value.length <= 0) return getAllCategories();
    const filterCategories = SearchCategory(initialCategory, value);
    if (filterCategories.length <= 0) setInitialCategory([]);
    setInitialCategory(filterCategories);
  };

  const debouncingSearch = useCallback(debounce(SearchingCategories, 250), [
    initialCategory,
  ]);

  const handleDelete = async (id: string) => {
    if (!id) return toast.error("Category not exist");
    const toastLoader = toast.loading("Deleting category...");
    try {
      toast.dismiss(toastLoader);
      await deleteCategory(id);
      toast.success("Successfully deleted");
      await addLogs({
        action: "delete",
        date: new Date(),
        detail: `category : ${id} `,
      });
      const refreshCategory = initialCategory?.filter(
        (category) => category.id !== id
      );
      setInitialCategory(refreshCategory);
    } catch (error) {
      toast.dismiss(toastLoader);
      return toast.error("Failed to delete");
    }
    setIsDelete(false);
  };

  return (
    <div className="relative flex flex-col items-start justify-center w-full px-4 py-7 gap-7 ">
      <div className="flex items-center justify-between w-full">
        <div className="flex flex-col items-start justify-center gap-1">
          <h4 className="text-xl tracking-wide text-[var(--dark-text)]">
            Categories
          </h4>
          <p className="text-[14px] text-[var(--dark-secondary-text)] text-nowrap ">
            6 entries found
          </p>
        </div>
        <div className="flex items-center justify-center gap-5 ">
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setIsUPloadModalOpen(!isUploadModalOpen)}
              className="flex items-center gap-2 justify-center bg-[var(--primary-color)] text-[var(--light-foreground)] py-[0.5rem] border-[1px] border-[var(--primary-color)] px-4 rounded"
            >
              <Plus className="size-4" />
              <p className="text-[15px]">Item</p>
            </button>
            <Button
              sortFn={(value) => setSortOrder(value)}
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
              sort={[
                { label: "Rank", value: "rank", id: "fkdsj" },
                { label: "Revenue", value: "revenue", id: "flksdj" },
                {
                  label: "Orders",
                  value: "orders",
                  id: "kfljsf",
                },
              ]}
              checkFn={(isChecked: boolean, value: any) =>
                handleSelect(isChecked, value)
              }
            />
          </div>
        </div>
      </div>
      <div className="flex sm:flex-row flex-col  items-start sm:items-center justify-start w-full gap-8 sm:gap-2 ">
        <div className="flex items-center justify-start gap-2 ">
          {" "}
          <form
            action=""
            className="relative sm:w-auto w-[300px] min-w-[200px] "
          >
            <input
              onChange={(event) => debouncingSearch(event.target.value)}
              id="search"
              type="search"
              className="border placeholder:text-sm placeholder:text-[var(--dark-secondary-text)] outline-none sm:w-[300px] w-full py-2 px-2  border-[var(--dark-secondary-background)] bg-[var(--light-background)] rounded-lg  focus:border-[var(--primary-color)]"
              placeholder="Search"
            />
          </form>
          <div className="h-10  w-[1px] bg-gray-300 "></div>
          <DeleteButton
            dataLength={bulkSelectedCategory.length}
            deleteFn={() => setIsBulkDeleted(true)}
          />
        </div>
        <div>
          {isFilter && (
            <div className="flex w-[150px]  items-center rounded-lg border  justify-between p-2">
              <div className="flex gap-1 items-center justify-center">
                <span className="  text-sm ">{isFilter.toLowerCase()}</span>
                <p
                  className={` duration-150 ${
                    sortOrder === "desc"
                      ? "rotate-180"
                      : sortOrder === "asc"
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
      <CategoryTable
        selectedData={bulkSelectedCategory}
        loading={loading}
        category={initialCategory}
        actions={{
          delete: (id) => {
            setId(id);
            setIsDelete(true);
          },
          edit: (id) => {
            setId(id);
            setIsEdit(false);
          },
          checkFn: (id, isChecked) => {
            handleBulkSelected(id, isChecked);
          },
          checkAllFn: (isChecked: boolean) => handleAllSelected(isChecked),
        }}
      />
      <Modal
        close={isUploadModalOpen}
        closeModal={() => setIsUPloadModalOpen(!isUploadModalOpen)}
      >
        <UploadCategory
          closeModal={() => setIsUpdateModelOpen(!isUpdateModalOpen)}
        />
      </Modal>
      <Modal close={isEdit} closeModal={() => setIsEdit(true)}>
        <UpdateCategory id={id as string} closeModal={() => setIsEdit(true)} />
      </Modal>
      {isDelete && (
        <Delete
          closeModal={() => setIsDelete(false)}
          id={id as string}
          isClose={isDelete}
          setDelete={(id) => handleDelete(id as string)}
        />
      )}
      {isBulkDelete && (
        <Delete
          isClose={isBulkDelete}
          closeModal={() => setIsBulkDeleted(false)}
          id={id as string}
          setDelete={() => handleSelectedDelete()}
        />
      )}
    </div>
  );
};
