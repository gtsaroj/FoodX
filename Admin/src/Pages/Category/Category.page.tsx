import { Filter, Plus, X } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import Modal from "../../Components/Common/Popup/Popup";
import { UploadCategory } from "../../Components/Upload/Category.upload";
import { SearchCategory } from "../../Utility/category.utils";
import { debounce } from "../../Utility/debounce";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../Store";
import { categoryAdd } from "../../Reducer/category.reducer";
import UpdateCategory from "../../Components/Upload/Category.update.upload";
import {
  bulkDeleteOfCategory,
  deleteCategory,
  getCategories,
} from "../../Services/category.services";
import { addLogs } from "../../Services/log.services";
import toast from "react-hot-toast";
import { Category } from "../../models/category.model";
import Delete, { DeleteButton } from "../../Components/Common/Delete/Delete";
import { CategoryTable } from "./Category.table";
import { Button } from "../../Components/Common/Button/Button";
import { aggregateCategories } from "./category";

export const CategoryPage: React.FC = () => {
  const [isUpdateModalOpen, setIsUpdateModelOpen] = useState<boolean>(true);
  const [isUploadModalOpen, setIsUPloadModalOpen] = useState<boolean>(true);
  const [initialCategory, setInitialCategory] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isBulkDelete, setIsBulkDeleted] = useState<boolean>(false);
  const [isFilter, setIsFilter] = useState<string>();

  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("asc");
  const [isEdit, setIsEdit] = useState<boolean>(true);
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [id, setId] = useState<string>();
  const [bulkSelectedCategory, setBulkSelectedCategory] = useState<
    { id: string }[]
  >([]);

  const dispatch = useDispatch<AppDispatch>();

  const getAllCategories = async () => {
    setLoading(true);
    try {
      const categories = await getCategories();
      const allCategories = (await aggregateCategories(
        categories
      )) as Category[];
      setInitialCategory(allCategories);
    } catch (error) {
      setLoading(false);
      throw new Error(`Error found while fetching category` + error);
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
  console.log(initialCategory)

  //select all category
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
  // Delete each category
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
      throw new Error("Error deleting products:" + error);
    }
    setIsBulkDeleted(false);
  };

  //dispatch latest category
  useEffect(() => {
    initialCategory?.forEach((category) =>
      dispatch(categoryAdd(category.name))
    );
  }, [initialCategory, dispatch, isFilter?.length]);

  useEffect(() => {
    getAllCategories();
  }, []);

  useEffect(() => {
    const handleSelect = async (value: string) => {
      let sortedCustomers;
      if (value === "Items") {
        sortedCustomers = [...initialCategory].sort(
          (a: Category, b: Category) =>
            sortOrder === "desc"
              ? (((b.item as number) - a.item) as number)
              : (((a.item as number) - b.item) as number)
        );
      }
      if (value === "orders") {
        sortedCustomers = [...initialCategory]?.sort((a, b) =>
          sortOrder == "desc" ? (b.order = a.order) : a.order - b.order
        );
      }
      if (value === "revenue") {
        sortedCustomers = [...initialCategory]?.sort((a, b) =>
          sortOrder == "desc" ? (b.revenue = a.revenue) : a.revenue - b.revenue
        );
      }
      if (value === "rank") {
        sortedCustomers = [...initialCategory]?.sort((a, b) =>
          sortOrder == "desc" ? (b.rank = a.rank) : a.rank - b.rank
        );
      }
      if (value.length <= 0) {
        getAllCategories();
      }
      setInitialCategory(sortedCustomers as Category[]);
    };
    handleSelect(isFilter as string);
  }, [isFilter, sortOrder]);

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
        <div className="flex flex-col -space-y-1.5 items-start justify-center gap-1">
          <h4 className="text-[1.25rem] font-[600] tracking-wider text-[var(--dark-text)]">
            All Categories
          </h4>
          <p className="text-[15px] tracking-wider text-[var(--dark-secondary-text)] text-nowrap ">
            {initialCategory?.length || 0} entries found
          </p>
        </div>
        <div className="flex items-center justify-center gap-5 ">
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setIsUPloadModalOpen(!isUploadModalOpen)}
              className="flex items-center gap-2 justify-center bg-[var(--primary-color)] text-white py-[0.5rem] border-[1px] border-[var(--primary-color)] px-4 rounded"
            >
              <Plus strokeWidth={2.5} className="size-5   " />
              <p className="text-[16px] tracking-widest ">Item</p>
            </button>
            <Button
              sortFn={(value) => setSortOrder(value)}
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
              sort={[
                { label: "Rank", value: "rank", id: "fkkfjsoadsj" },
                { label: "Revenue", value: "revenue", id: "flfdshskfjksdj" },
                {
                  label: "Orders",
                  value: "orders",
                  id: "kfljsf",
                },
              ]}
              checkFn={{
                checkSortFn: (isChecked, value) => {
                  if (!isChecked) {
                    return setIsFilter("");
                  }
                  if (isChecked) {
                    setIsFilter(value);
                  }
                },
              }}
            />
          </div>
        </div>
      </div>
      <div className="flex  sm:flex-row flex-col  items-start sm:items-center justify-start w-full gap-8 sm:gap-2 ">
        <div className="flex w-full sm:w-auto items-center justify-start gap-2 ">
          {" "}
          <form
            action=""
            className="relative text-[var(--dark-text)] sm:w-auto w-full "
          >
            <input
              id="search"
              type="search"
              onChange={(event) => debouncingSearch(event?.target.value)}
              className=" border placeholder:tracking-wider placeholder:text-[16px] placeholder:text-[var(--dark-secondary-text)] outline-none sm:w-[300px] w-full py-2 px-2  border-[var(--dark-border)] bg-[var(--light-background)] rounded-lg  ring-[var(--primary-color)] focus:ring-[3px] duration-150 "
              placeholder="Search for products"
            />
          </form>
          <div className="h-10  w-[1px] bg-[var(--dark-border)] "></div>
          <DeleteButton
            dataLength={bulkSelectedCategory.length}
            deleteFn={() => setIsBulkDeleted(true)}
          />
        </div>
        <div>
          {isFilter && (
            <div className="flex px-1 py-0.5 w-full gap-2 border-[var(--dark-secondary-text)]  items-center rounded border  justify-start">
              <div className="flex gap-1 items-center justify-center">
                <span className="  text-[15px] text-[var(--dark-secondary-text)]">
                  {isFilter.toLowerCase()}
                </span>
              </div>
              <button onClick={() => setIsFilter("")} className=" ">
                <X className="text-[var(--danger-text)] " size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
      <CategoryTable
        totalData={initialCategory?.length}
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
