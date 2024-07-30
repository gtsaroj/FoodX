import { ArrowDownAZ, Filter, Plus, Trash2 } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import Modal from "../../Components/Common/Popup/Popup";
import { UploadCategory } from "../../Components/Upload/UploadCategory";
import { getCategory } from "../../firebase/db";
import { SearchCategory } from "../../Utility/Search";
import { debounce } from "../../Utility/Debounce";
import { DropDown } from "../../Components/Common/DropDown/DropDown";
import { FilterButton } from "../../Components/Common/Sorting/Sorting";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../Reducer/Store";
import { categoryAdd } from "../../Reducer/Action";
import UpdateCategory from "../../Components/Upload/UpdateCategory";
import {
  bulkDeleteOfCategory,
  deleteCategory,
  getCategories,
} from "../../Services";
import toast from "react-hot-toast";
import { CategoryType } from "../../models/category.model";
import Delete from "../../Components/Common/Delete/Delete";
import { CategoryTable } from "./CategoryTable";

export const CategoryPage: React.FC = () => {
  const [isUpdateModalOpen, setIsUpdateModelOpen] = useState<boolean>(true);
  const [isUploadModalOpen, setIsUPloadModalOpen] = useState<boolean>(true);
  const [initialCategory, setInitialCategory] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isBulkDelete, setIsBulkDeleted] = useState<boolean>(false);
  const [bulkSelectedProduct, setBulkSelectedProduct] = useState<
    {
      category: "specials" | "products";
      id: string;
    }[]
  >([]);
  const [sortOrder, setSortOrder] = useState({ field: "", order: "desc" });
  const [isEdit, setIsEdit] = useState<boolean>(true);
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [id, setId] = useState<string>();
  const [bulkSelectedCategory, setBulkSelectedCategory] = useState<
    { id: string }[]
  >([]);

  const dispatch = useDispatch<AppDispatch>();

  const handleAction = async (value: string, type: string) => {
    console.log(value, type);
    if (type === "Delete") {
      const toastLoader = toast.loading("Category deleting...");
      await deleteCategory(value);
      toast.dismiss(toastLoader);
      toast.success("Category deleted successfully");
      const refreshCategory = categoryData?.filter(
        (category) => category.id !== value
      );
      setCategoryData(refreshCategory);
    } else if (type === "Edit") {
      setCategoryId(value);
      setIsUpdateModelOpen(false);
    }
  };

  const handleSelect = async (value: string) => {
    const newOrder = sortOrder.order === "asc" ? "desc" : "asc";

    let sortedCustomers;
    if (value === "Category") {
      sortedCustomers = [...categoryData].sort((a: any, b: any) =>
        newOrder === "desc"
          ? b.Category.localeCompare(a.Category)
          : a.Category.localeCompare(b.Category)
      );
    }

    setSortOrder({ field: value, order: newOrder });
    setCategoryData(sortedCustomers as { Category: string; Image: string }[]);
  };

  const getAllCategories = async () => {
    setLoading(true);
    try {
      const categories = await getCategories();
      const categorydata: CategoryType[] = categories.map((category) => ({
        id: category.id,
        name: category.name,
        item: 55,
        order: 100,
        rank: 45,
        revenue: 15000,
        image: category.image,
      }));
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
    }
    setIsBulkDeleted(false);
  };

  useEffect(() => {
    const categories = initialCategory.map((category) => category.name);
    dispatch(categoryAdd(categories));
  }, [initialCategory, dispatch]);

  useEffect(() => {
    getAllCategories();
  }, []);

  const SearchingCategories = async (value: string) => {
    if (value.length > 0) {
      const filterCategories = SearchCategory(initialCategory, value);
      setInitialCategory(filterCategories);
    } else {
      getAllCategories();
    }
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
                  parent={
                    <>
                      <ArrowDownAZ className="size-4" />
                      <span className=" text-[15px]">Sort By</span>
                    </>
                  }
                  onSelect={handleSelect}
                  sortOrder={sortOrder.order}
                  sortingOptions={["Category"]}
                />,
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
      <div className="flex items-center justify-start w-full gap-2 ">
        <form action="" className="relative">
          <input
            onChange={(event) => debouncingSearch(event.target.value)}
            id="search"
            type="search"
            className="border placeholder:text-sm placeholder:text-[var(--dark-secondary-text)] outline-none sm:w-[300px] w-full py-2 px-2  border-[var(--dark-secondary-background)] bg-[var(--light-background)] rounded-lg  focus:border-[var(--primary-color)]"
            placeholder="Search"
          />
        </form>
        <div className="h-10  w-[1px] bg-gray-300 "></div>
        <button
          disabled={bulkSelectedCategory?.length >= 1 ? false : true}
          onClick={() => setIsBulkDeleted(true)}
        >
          <Trash2 className="size-7" />
        </button>
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
