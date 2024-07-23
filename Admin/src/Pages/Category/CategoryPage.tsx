import { Filter, Plus, Search } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import Modal from "../../Components/Common/Popup/Popup";
import { UploadCategory } from "../../Components/Upload/UploadCategory";
import Table from "../../Components/Common/Table/Table";
import { getCategory } from "../../firebase/db";
import { SearchCategory } from "../../Utility/Search";
import { debounce } from "../../Utility/Debounce";
import { DropDown } from "../../Components/Common/DropDown/DropDown";
import { FilterButton } from "../../Components/Common/Sorting/Sorting";

export const CategoryPage: React.FC = () => {
  const [isModalOpen, setIsModelOpen] = useState<boolean>(true);
  const [category, setCategory] = useState<{ [key: string]: string }>();
  const [categoryData, setCategoryData] = useState<
    { Category: string; Image: string }[]
  >([]);
  const [categoryHeader, setCategoryHeader] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [sortOrder, setSortOrder] = useState({ field: "", order: "desc" });

  const closeModal = () => setIsModelOpen(true);

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
      const categories = await getCategory("bnw");
      setCategory(categories.icons as any);
    } catch (error) {
      setLoading(false);
      setError(true);
      return console.log(`Error found while fetching category` + error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (category) {
      const arrayOfObject = Object.keys(category as any).map((item) => ({
        Category: item,
        Image: category[item],
      }));
      setCategoryData(arrayOfObject);
    }
  }, [category]);

  useEffect(() => {
    if (categoryData.length > 0) {
      const headers = Object.keys(categoryData[0]);
      headers.push("Button");
      headers.unshift("sn");
      setCategoryHeader(headers);
    }
  }, [categoryData]);

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
              onClick={() => setIsModelOpen(!isModalOpen)}
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
      <div className="flex items-center justify-start w-full ">
        <form action="" className="relative w-full">
          <input
            onChange={(event) => debouncingSearch(event.target.value)}
            id="search"
            type="search"
            className="border placeholder:text-sm placeholder:text-[var(--dark-secondary-text)] outline-none sm:w-[300px] w-full py-2 px-2  border-[var(--dark-secondary-background)] bg-[var(--light-background)] rounded-lg  focus:border-[var(--primary-color)]"
            placeholder="Search"
          />
        </form>
      </div>
      <Table
        error={error}
        loading={loading}
        actions={(string: string) => console.log(string)}
        pagination={{ currentPage: 1, perPage: 5 }}
        headerStyle={{ gridTemplateColumns: "repeat(5,1fr)" }}
        bodyStyle={{ gridTemplateColumns: "repeat(5,1fr)" }}
        headers={categoryHeader}
        data={categoryData as any}
      />
      <div className="absolute ">
        <Modal close={isModalOpen} closeModal={closeModal}>
          <UploadCategory categories={setCategory} />
        </Modal>
      </div>
    </div>
  );
};
