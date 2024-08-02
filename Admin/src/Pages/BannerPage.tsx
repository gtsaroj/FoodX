import { Filter, Plus, Trash2 } from "lucide-react";
import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import Modal from "../Components/Common/Popup/Popup";
import UploadBanner from "../Components/Upload/UploadBanner";
import { DropDown } from "../Components/Common/DropDown/DropDown";
import Table from "../Components/Common/Table/Table";
import { BannerModel } from "../models/banner.model";
import { ColumnProps } from "../models/table.model";
import UpdateBanner from "../Components/Upload/UpdateBanner";
import Delete from "../Components/Common/Delete/Delete";
import toast from "react-hot-toast";
import { bulkDeleteBanner, deleteBanner, getBanners } from "../Services";
import { debounce } from "../Utility/Debounce";
import { SearchBanner, SearchCategory } from "../Utility/Search";

const FoodPage: React.FC = () => {
  const [isModalOpen, setIsModelOpen] = useState<boolean>(true);
  const [initialBanner, setInitialBanner] = useState<BannerModel[]>([]);
  const [isEdit, setIsEdit] = useState<boolean>(true);
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [id, setId] = useState<string>();
  const [isBulkDelete, setIsBulkDelete] = useState<boolean>(false);
  const [bulkSelectedBanner, setBulkSelectedBanner] = useState<
    { id: string }[]
  >([]);

  const closeModal = () => setIsModelOpen(true);

  const columns: ColumnProps[] = [
    {
      fieldName: "Id",
      colStyle: { width: "150px", textAlign: "start" },
      render: (item: BannerModel) => (
        <div className="w-[150px] text-[var(--dark-secondary-text)]  relative cursor-pointer group/id text-start ">
          #{item.id?.substring(0, 8)}
          <div className=" top-[-27px] group-hover/id:visible opacity-0 group-hover/id:opacity-[100] duration-150 invisible left-[-30px]  absolute bg-[var(--light-foreground)] p-1 rounded shadow ">
            {item.id}
          </div>
        </div>
      ),
    },
    {
      fieldName: "Name",
      colStyle: { width: "200px", justifyContent: "start", textAlign: "start" },
      render: (item: BannerModel) => (
        <div className="w-[200px]">{item.title}</div>
      ),
    },
    {
      fieldName: "Image",
      colStyle: {
        width: "200px",
        justifyContent: "start",
        textAlign: "center",
        padding: "0px 15px 0px 0px",
      },
      render: (item: BannerModel) => (
        <div className="w-[200px] flex items-center justify-start">
          {" "}
          <img className="w-[180px] h-[50px] " src={item.image} alt="" />
        </div>
      ),
    },
    {
      fieldName: "Date",
      colStyle: { width: "150px", justifyContent: "start", textAlign: "start" },
      render: (item: BannerModel) => (
        <div className="flex flex-col items-start w-[150px]  ">
          <span>{item.date && item.date.fulldate + ","}</span>
          <span>{item.date && item.date.time}</span>
        </div>
      ),
    },
  ];

  const getAllBanners = async () => {
    try {
      const response = (await getBanners()) as BannerModel[];
      console.log(response);
      const fetchedBanners: BannerModel[] = response?.map((banner) => {
        return {
          id: banner.id,
          title: banner.title,
          image: banner.image,
          date: { fulldate: "2024-6-01", time: "04:45" },
        };
      });
      setInitialBanner(fetchedBanners);
    } catch (error) {
      throw new Error("Unable to fetch banners");
    }
  };

  const handleBulkSelected = (id: string, isChecked: boolean) => {
    const refreshIds = bulkSelectedBanner?.filter(
      (banner: { id: string }) => banner.id !== id
    );

    isChecked
      ? setBulkSelectedBanner((prev) => {
          const newBanner = prev?.filter((banner) => banner.id !== id);
          const findBanner = initialBanner?.find((banner) => banner.id === id);
          return newBanner
            ? [...newBanner, { id: findBanner?.id }]
            : [{ id: findBanner?.id }];
        })
      : setBulkSelectedBanner(refreshIds);
  };
  const handleAllSelected = (isChecked: boolean) => {
    if (isChecked) {
      const AllCategories = initialBanner?.map((banner) => {
        return { id: banner.id };
      });
      setBulkSelectedBanner(AllCategories as { id: string }[]);
    }
    if (!isChecked) {
      setBulkSelectedBanner([]);
    }
  };

  const handleSelectedDelete = async () => {
    const toastLoader = toast.loading("Deleting category...");
    try {
      const AllCategoriesId = bulkSelectedBanner?.map(
        (category) => category.id
      );
      await bulkDeleteBanner({ id: [...AllCategoriesId] });
      toast.dismiss(toastLoader);
      const refreshCategory = initialBanner.filter((category) => {
        return !AllCategoriesId.includes(category.id as string);
      });
      setInitialBanner(refreshCategory);
      toast.success("Successfully deleted");
    } catch (error) {
      toast.dismiss(toastLoader);
      toast.dismiss("Failed to delete");
      console.error("Error deleting products:", error);
      // Handle the error appropriately, e.g., show a notification to the user
    }
    setIsBulkDelete(false);
  };

  const handleDelete = async (id: string) => {
    if (!id) return toast.error("Banner not exist in database");
    const toastLoader = toast.loading("Deleting banner...");
    try {
      await deleteBanner({ id: id });
      toast.dismiss(toastLoader);
      toast.success("Successfully deleted");
      const refreshBanner = initialBanner?.filter((banner) => banner.id !== id);
      setInitialBanner(refreshBanner);
    } catch (error) {
      toast.dismiss(toastLoader);
      toast.error("Unable to delete banner");
      throw new Error("Unable to delet banner");
    }
    setIsDelete(false);
  };

  const SearchingCategories = (value: string) => {
    if (value.length <= 0) return getAllBanners();
    const filterCategory = SearchBanner(initialBanner, value);
    setInitialBanner(filterCategory);
  };

  const debouncingSearch = useCallback(debounce(SearchingCategories, 250), [
    initialBanner,
  ]);

  useEffect(() => {
    getAllBanners();
  }, []);

  return (
    <div className="relative flex flex-col items-start justify-center w-full px-5 py-7 gap-7">
      <div className="flex items-center justify-between w-full">
        <div className="flex flex-col items-start justify-center gap-8">
          <div className="flex flex-col items-start justify-center gap-1">
            <h4 className="text-xl tracking-wide text-[var(--dark-text)]">
              Banners
            </h4>
            <p className="text-[14px] text-[var(--dark-secondary-text)] text-nowrap ">
              {initialBanner.length} entries found
            </p>
          </div>
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
            <button
              disabled={bulkSelectedBanner?.length >= 1 ? false : true}
              onClick={() => setIsBulkDelete(true)}
            >
              <Trash2 className="size-7" />
            </button>
          </div>
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
              options={[]}
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
      <Table
        selectedData={bulkSelectedBanner}
        columns={columns}
        data={initialBanner}
        actions={{
          deleteFn: (value: string) => {
            setIsDelete(true);
            setId(value);
          },
          editFn: (value: string) => {
            setIsEdit(false);
            setId(value);
          },
          checkFn: (id: string, isChecked: boolean) =>
            handleBulkSelected(id, isChecked),
          checkAllFn: (isChecked: boolean) => handleAllSelected(isChecked),
        }}
        pagination={{ currentPage: 1, perPage: 5 }}
      />

      <Modal close={isModalOpen} closeModal={closeModal}>
        <UploadBanner />
      </Modal>

      <Modal close={isEdit} closeModal={() => setIsEdit(true)}>
        <UpdateBanner id={id as string} closeModal={() => setIsEdit(true)} />
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
          id={id as string}
          setDelete={() => handleSelectedDelete()}
          isClose={isBulkDelete}
          closeModal={() => setIsBulkDelete(false)}
        />
      )}
    </div>
  );
};

export default FoodPage;
