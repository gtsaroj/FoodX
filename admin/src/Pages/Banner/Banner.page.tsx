import { Plus } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import Modal from "../../Components/Common/Popup/Popup";
import UploadBanner from "../../Components/Upload/Banner.Upload";
import Table from "../../Components/Common/Table/Table";
import { BannerModel } from "../../models/banner.model";
import { ColumnProps } from "../../models/table.model";
import Delete, { DeleteButton } from "../../Components/Common/Delete/Delete";
import toast from "react-hot-toast";
import {
  bulkDeleteBanner,
  deleteBanner,
  getBanners,
} from "../../Services/banner.services";
import { debounce } from "../../Utility/debounce";
import { SearchBanner } from "../../Utility/banner.utils";
import dayjs from "dayjs";

const FoodPage: React.FC = () => {
  const [isModalOpen, setIsModelOpen] = useState<boolean>(true);
  const [initialBanner, setInitialBanner] = useState<BannerModel[]>([]);
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [idAndPath, setIdAndPath] = useState<{
    id: string;
    path: string | "banners" | "sponsors";
  }>({ id: "", path: "" });
  const [isBulkDelete, setIsBulkDelete] = useState<boolean>(false);
  const [bulkSelectedBanner, setBulkSelectedBanner] = useState<
    { id: string; path: "sponsors" | "banners" }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);

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
      fieldName: "Type",
      colStyle: { width: "200px", justifyContent: "start", textAlign: "start" },
      render: (item: BannerModel) => (
        <div className="w-[200px]">{item.path}</div>
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
          <span>{item.date as any}</span>
        </div>
      ),
    },
  ];

  const getAllBanners = async () => {
    setLoading(true);
    const banners = [];
    try {
      const [normalBanner, sponsorBanner] = [
        (await getBanners({
          path: "banners",
        })) as { banners: BannerModel[] },
        (await getBanners({
          path: "sponsors",
        })) as { banners: BannerModel[] },
      ];

      if (normalBanner) {
        const fetchNormalBanner = normalBanner?.banners?.map((banner) => {
          return {
            id: banner.id,
            title: banner.title,
            image: banner.image,
            date: dayjs(
              banner.date &&
                banner.date._seconds * 1000 + banner.date._nanoseconds / 1e6
            ).format("DD/MM/YYYY"),
            path: "banners",
          };
        });
        if (fetchNormalBanner.length > 0) banners.push(...fetchNormalBanner);
      }
      if (sponsorBanner) {
        const fetchSponsorBanner = sponsorBanner?.banners?.map((banner) => {
          return {
            id: banner.id,
            title: banner.title,
            image: banner.image,
            date: dayjs(
              banner.date &&
                banner.date._seconds * 1000 + banner.date._nanoseconds / 1e6
            ).format("DD/MM/YYYY"),
            path: "sponsors",
          };
        });
        if (fetchSponsorBanner.length > 0) banners.push(...fetchSponsorBanner);
      }
      setInitialBanner(banners as any);
    } catch (error) {
      throw new Error("Unable to fetch banners" + error);
    }
    setLoading(false);
  };

  const handleBulkSelected = (id: string, isChecked: boolean) => {
    const refreshIds = bulkSelectedBanner?.filter(
      (banner: { id: string }) => banner.id !== id
    );

    isChecked
      ? setBulkSelectedBanner((prev: any) => {
          const newBanner = prev?.filter(
            (banner: BannerModel) => banner.id !== id
          );
          const findBanner = initialBanner?.find((banner) => banner.id === id);
          return newBanner
            ? [...newBanner, { id: findBanner?.id, path: findBanner?.path }]
            : [{ id: findBanner?.id, path: findBanner?.path }];
        })
      : setBulkSelectedBanner(refreshIds);
  };
  const handleAllSelected = (isChecked: boolean) => {
    if (isChecked) {
      const AllCategories = initialBanner?.map((banner) => {
        return { id: banner.id, path: banner.path };
      });
      setBulkSelectedBanner(
        AllCategories as { id: string; path: "banners" | "sponsors" }[]
      );
    }
    if (!isChecked) {
      setBulkSelectedBanner([]);
    }
  };

  const handleSelectedDelete = async () => {
    const toastLoader = toast.loading("Deleting category...");

    try {
      const { banners, sponsors } = bulkSelectedBanner.reduce<{
        banners: string[];
        sponsors: string[];
      }>(
        (acc, data) => {
          if (data.path === "banners") {
            acc.banners.push(data.id);
          } else if (data.path === "sponsors") {
            acc.sponsors.push(data.id);
          }
          return acc;
        },
        { banners: [], sponsors: [] }
      );

      if (banners.length > 0) {
        await bulkDeleteBanner({ id: banners, path: "banners" });
      }
      if (sponsors.length > 0) {
        await bulkDeleteBanner({ id: sponsors, path: "sponsors" });
      }

      const AllCategoriesId = bulkSelectedBanner?.map(
        (category) => category.id
      );

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
    const findBanner = initialBanner?.find((banner) => banner.id === id);
    try {
      await deleteBanner({
        id: findBanner?.id as string,
        path: findBanner?.path as "sponsors" | "banners",
      });
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
        <div className="flex w-full sm:pt-0 pt-14 flex-col items-start justify-center gap-8">
          <div className="flex flex-col -space-y-1.5 items-start justify-center gap-1">
            <h4 className="text-[1.25rem] font-[600] tracking-wider text-[var(--dark-text)]">
              All Banners
            </h4>
            <p className="text-[15px] tracking-wider text-[var(--dark-secondary-text)] text-nowrap ">
              {initialBanner?.length || 0} entries found
            </p>
          </div>
          <div className="flex w-full items-center justify-start gap-2 ">
            {" "}
            <form
              action=""
              className="relative  text-[var(--dark-text)] w-full sm:w-auto "
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
              dataLength={bulkSelectedBanner.length}
              deleteFn={() => setIsBulkDelete(true)}
            />
          </div>
        </div>
        <div className="flex items-center justify-center gap-5 ">
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setIsModelOpen(!isModalOpen)}
              className="flex items-center gap-2 justify-center bg-[var(--primary-color)] text-white py-[0.5rem] border-[1px] border-[var(--primary-color)] px-4 rounded"
            >
              <Plus strokeWidth={2.5} className="size-5" />
              <p className="text-[16px] tracking-widest ">Item</p>
            </button>
          </div>
        </div>
      </div>
      <Table
        loading={loading}
        totalData={initialBanner?.length}
        selectedData={bulkSelectedBanner?.map((banner) => banner.id)}
        columns={columns}
        data={initialBanner}
        actions={{
          deleteFn: (value: string) => {
            setIsDelete(true);
            const findBanner = initialBanner?.find(
              (banner) => banner.id === value
            );
            setIdAndPath({
              id: findBanner?.id as string,
              path: findBanner?.path as "sponsors" | "banners",
            });
          },
          checkFn: (id: string, isChecked: boolean) =>
            handleBulkSelected(id, isChecked),
          checkAllFn: (isChecked: boolean) => handleAllSelected(isChecked),
        }}
        pagination={{ currentPage: 1, perPage: 5 }}
      />

      <Modal close={isModalOpen} closeModal={closeModal}>
        <UploadBanner closeModal={closeModal} />
      </Modal>
      {isDelete && (
        <Delete
          closeModal={() => setIsDelete(false)}
          id={idAndPath.id as string}
          path={idAndPath.path}
          isClose={isDelete}
          setDelete={(id) => handleDelete(id as string)}
        />
      )}
      {isBulkDelete && (
        <Delete
          id={idAndPath.id}
          setDelete={() => handleSelectedDelete()}
          isClose={isBulkDelete}
          closeModal={() => setIsBulkDelete(false)}
        />
      )}
    </div>
  );
};

export default FoodPage;
