import { useCallback, useEffect, useState } from "react";
import { CategoryTable } from "../Category/Category.table";
import { Category } from "../../models/category.model";
import {
  bulkDeleteOfCategory,
  deleteCategory,
  getCategories,
} from "../../Services/category.services";
import { addLogs } from "../../Services/log.services";
import toast from "react-hot-toast";
import Delete, { DeleteButton } from "../../Components/Common/Delete/Delete";
import Modal from "../../Components/Common/Popup/Popup";
import UpdateCategory from "../../Components/Upload/Category.update.upload";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../Store";
import { categoryAdd } from "../../Reducer/category.reducer";
import { Filter, X } from "lucide-react";
import { SearchCategory } from "../../Utility/category.utils";
import { debounce } from "../../Utility/debounce";
import { Button } from "../../Components/Common/Button/Button";
import { aggregateCategories } from "../Category/category";

const AllCategories = () => {
  const [initialCategory, setInitialCategory] = useState<Category[]>([]);
  const [isFilter, setIsFilter] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [bulkSelectedCategory, setBulkSelectedCategory] = useState<
    { id: string }[]
  >([]);
  const [id, setId] = useState<string>();
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [isBulkDelete, setIsBulkDelete] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(true);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const dispatch = useDispatch<AppDispatch>();

  const getAllCategories = async () => {
    setLoading(true);
    try {
      const categories = await getCategories();
      const allCategory = await aggregateCategories(categories);
      allCategory?.forEach((data) => dispatch(categoryAdd(data.name)));
      setInitialCategory(allCategory);
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
      await addLogs({
        action: "delete",
        date: new Date(),
        detail: `Category bulk delete : ${JSON.stringify(AllCategoriesId)}`,
      });
      toast.dismiss(toastLoader);
      const refreshCategory = initialCategory.filter((category) => {
        return !AllCategoriesId.includes(category.id as string);
      });
      setInitialCategory(refreshCategory);
      toast.success("Successfully deleted");
    } catch (error) {
      throw new Error("Error deleting products:" + error);
    }
  };

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

  useEffect(() => {
    if (initialCategory?.length <= 0 || undefined) {
      getAllCategories();
    }
  }, [initialCategory?.length]);

  useEffect(() => {
    const handleSelect = async (value: string) => {
      let sortedCustomers;
      if (value === "item") {
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
      if (value.length <= 0 || undefined) {
        getAllCategories();
      }
      setInitialCategory(sortedCustomers as Category[]);
    };
    handleSelect(isFilter as string);
  }, [isFilter, sortOrder]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-5 px-3 py-5">
      <div className="flex sm:flex-row flex-col items-start sm:items-center justify-between flex-grow w-full gap-5 px-3 pb-6">
        <div className="flex flex-col w-full items-start justify-center gap-3">
          <div className="flex flex-col -space-y-1.5 items-start justify-center gap-1">
            <h4 className="text-[1.25rem] font-[600] tracking-wider text-[var(--dark-text)]">
              All Categories
            </h4>
            <p className="text-[15px] tracking-wider text-[var(--dark-secondary-text)] text-nowrap ">
              {initialCategory?.length || 0} entries found
            </p>
          </div>

          <div className="flex   items-start sm:items-center justify-start w-full gap-8 sm:gap-2 ">
            <div className="flex w-full sm:w-auto items-center justify-start gap-2 ">
              {" "}
              <form
                action=""
                className="relative text-[var(--dark-text)] w-full sm:w-auto "
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
                deleteFn={() => setIsBulkDelete(true)}
                dataLength={bulkSelectedCategory.length}
              />
            </div>
            <div>
              {isFilter && (
                <div className="flex px-2 py-0.5 w-full gap-3 border-[var(--dark-secondary-text)]  items-center rounded border  justify-start">
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
        </div>
        <div>
          <Button
            sortFn={(value) => setSortOrder(value)}
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
            sort={[
              { label: "Rank", value: "rank", id: "fkdhkjhefksj" },
              { label: "Revenue", value: "revenue", id: "flksdj" },
              {
                label: "Orders",
                value: "orders",
                id: "kfljsffldkl;'",
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
      <CategoryTable
        totalData={initialCategory?.length}
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
          setDelete={(id) => handleDelete(id)}
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
