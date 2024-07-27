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
  bulkeDeleteOfCategory,
  deleteCategory,
  getCategories,
} from "../../Services";
import toast from "react-hot-toast";
import Table from "../../Components/Common/Table/Table";
import { CategoryType } from "../../models/category.model";
import { ColumnProps } from "../../models/table.model";
import Delete from "../../Components/Common/Delete/Delete";

export const CategoryPage: React.FC = () => {
  const [isUpdateModalOpen, setIsUpdateModelOpen] = useState<boolean>(true);
  const [isUploadModalOpen, setIsUPloadModalOpen] = useState<boolean>(true);
  const [categoryData, setCategoryData] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [categoryId, setCategoryId] = useState<string>("");
  const [sortOrder, setSortOrder] = useState({ field: "", order: "desc" });
  const [isEdit, setIsEdit] = useState<boolean>(true);
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [id, setId] = useState<string>();

  const dispatch = useDispatch<AppDispatch>();

  const Columns: ColumnProps[] = [
    {
      fieldName: (
        <div className=" w-[50px]  text-start">
          <input className="w-4 h-4 cursor-pointer" type="checkbox" />
        </div>
      ),
      render: () => (
        <div className="w-[50px] ">
          <input className="w-4 h-4 cursor-pointer" type="checkbox" />
        </div>
      ),
    },
    {
      fieldName: "Name",
      colStyle: { width: "150px", justifyContent: "start", textAlign:"start" },
      render: (value: CategoryType) => (
        <div className="w-[150px] text-[var(--dark-text)] flex items-center justify-start gap-3 ">
          <div className="w-[40px] h-[40px]">
            <img
              className="w-full h-full rounded-full"
              src={value.image}
              alt=""
            />
          </div>
          <span> {value.name}</span>
        </div>
      ),
    },
    {
      fieldName: "Id",
      colStyle: { width: "120px", textAlign:"start" },
      render: (item: CategoryType) => (
        <div className="w-[120px] relative cursor-pointer group/id text-start ">
          #{item.id?.substring(0, 8)}
          <div className=" top-[-27px] group-hover/id:visible opacity-0 group-hover/id:opacity-[100] duration-150 invisible left-[-30px]  absolute bg-[var(--light-foreground)] p-1 rounded shadow ">
            {item.id}
          </div>
        </div>
      ),
    },
    {
      fieldName: "Items",
      colStyle: { width: "100px", justifyContent: "start", textAlign:"start" },
      render: (item: CategoryType) => (
        <div className=" w-[100px]  text-[var(--dark-text)]">
          <p>{item.order}</p>
        </div>
      ),
    },
    {
      fieldName: "Orders",
      colStyle: { width: "120px", justifyContent: "start", textAlign:"start" },
      render: (item: CategoryType) => (
        <div className=" w-[120px] text-[var(--dark-text)] ">
          <p>{item.order}</p>
        </div>
      ),
    },
    {
      fieldName: "Revenue",
      colStyle: { width: "120px", justifyContent: "start", textAlign:"start" },
      render: (item: CategoryType) => (
        <div className=" w-[120px] text-[var(--dark-text)]  ">
          <p>Rs {item.revenue}</p>
        </div>
      ),
    },
    {
      fieldName: "Rank",
      colStyle: { width: "100px", justifyContent: "start", textAlign:"start" },
      render: (item: CategoryType) => (
        <div className=" w-[100px] flex  text-[var(--dark-text)] gap-2 items-center justify-start ">
          <div className="mt-1">{item.rank}</div>
        </div>
      ),
    },
  ];

  const handleAction = async (value: string, type: string) => {
    console.log(value, type);
    if (type === "Delete") {
      const toastLoader = toast.loading("Category deleting...");
      await deleteCategory(value);
      toast.dismiss(toastLoader);
      toast.success("Category deleted successfully");
      const refreshCategory = categoryData?.filter(
        (category) => category.ID !== value
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
      setCategoryData(categorydata);
    } catch (error) {
      setLoading(false);
      return console.log(`Error found while fetching category` + error);
    }
    setLoading(false);
  };

  useEffect(() => {
    const categories = categoryData.map((category) => category.name);
    dispatch(categoryAdd(categories));
  }, [categoryData, dispatch]);

  useEffect(() => {
    getAllCategories();
  }, []);

  const SearchingCategories = async (value: string) => {
    const getCategories = (await getCategory("bnw")).icons as any;

    const arrayOfObject = Object.keys(getCategories as any).map((item) => ({
      Category: item,
      Image: getCategories[item],
    }));
    const filterCategories = SearchCategory(arrayOfObject, value);
    setCategoryData(filterCategories);
  };

  const debouncingSearch = useCallback(debounce(SearchingCategories, 250), [
    categoryData,
  ]);

  const handleDelete = async (id: string) => {
    if (!id) return toast.error("Category not exist");
    const toastLoader = toast.loading("Deleting category...");
    try {
      await bulkeDeleteOfCategory(id);
      toast.dismiss(toastLoader);
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
        <div>
          <Trash2 className="size-7"/>
         </div>
      </div>
      <Table
        data={categoryData}
        columns={Columns}
        actionIconColor="red"
        actions={{
          deleteFn: (value: string) => {
            setIsDelete(true);
            setId(value);
          },
          editFn: (value: string) => {
            setIsEdit(false);
            setId(value);
          },
        }}
        disableActions={false}
        loading={loading}
        bodyHeight={400}
        pagination={{ currentPage: 1, perPage: 5 }}
        onPageChange={(pageNumber) => console.log(pageNumber)}
        disableNoData={false}
        headStyle={{ width: "100%" }}
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
    </div>
  );
};
