import { ChevronUp, Filter, Plus, Trash2, X } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import UploadFood from "../../Components/Upload/UploadFood";
import Modal from "../../Components/Common/Popup/Popup";
import { DropDown } from "../../Components/Common/DropDown/DropDown";
import { debounce } from "../../Utility/Debounce";
import { ArrangedProduct, ProductType } from "../../models/productMode";
import {
  bulkDeleteOfProduct,
  deleteProduct,
  getProducts,
  getSpecialProducts,
} from "../../Services";
import { SearchProduct } from "../../Utility/Search";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../Reducer/Store";
import { addProducts } from "../../Reducer/Action";
import { FilterButton } from "../../Components/Common/Sorting/Sorting";
import toast from "react-hot-toast";
import UpdateFood from "../../Components/Upload/UpdateFood";
import Delete, { DeleteButton } from "../../Components/Common/Delete/Delete";
import { FoodTable } from "./FoodTable";

const FoodPage: React.FC = () => {
  const [isModalOpen, setIsModelOpen] = useState<boolean>(true);
  const [isEdit, setIsEdit] = useState<boolean>(true);
  const [type, setType] = useState<"specials" | "products">();
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [isBulkDelete, setIsBulkDelete] = useState<boolean>(false);
  const [modalData, setModalData] = useState<ArrangedProduct>();
  const [id, setId] = useState<string>();
  const [bulkSelectedProduct, setBulkSelectedProduct] = useState<
    {
      category: "specials" | "products";
      id: string;
    }[]
  >([]);
  const [pagination, setPagination] = useState<{
    currentPage: number;
    perPage: number;
  }>({ currentPage: 1, perPage: 5 });
  const [currentDoc, setCurrentDoc] = useState<{
    currentFirstDoc: string;
    currentLastDoc: string;
  }>();

  const [fetchedProducts, setFetchedProducts] = useState<ArrangedProduct[]>([]);
  const [originalData, setOriginalData] = useState<ArrangedProduct[]>([]);
  const [sortOrder, setSortOrder] = useState<{ field: string; order: string }>({
    field: "",
    order: "desc",
  });
  const [loading, setLoading] = useState<boolean>(false);

  // get all products
  const getAllProducts = async () => {
    setLoading(true);
    try {
      const products = await getProducts({
        path: "products",
        pageSize: pagination.perPage,
        direction: "next",
        filter: "price",
        sort: "asc",
      });
      // const special = await getSpecialProducts();
      const normalProducts = products.data as {
        currentFirstDoc: string;
        currentLastDoc: string;
        products: ProductType[];
      };
      setCurrentDoc(() => ({
        currentFirstDoc: normalProducts.currentFirstDoc,
        currentLastDoc: normalProducts.currentLastDoc,
      }));

      const arrangeNormalProducts: ArrangedProduct[] =
        normalProducts?.products.map((product: ProductType) => ({
          id: product.id,
          name: product.name,
          image: product.image,
          quantity: product.quantity as number,
          price: product.price as number,
          category: product.tag,
          order: Math.floor(Math.random() * (500 - 50 + 1)) + 50,
          rating: Math.floor(Math.random() * (10 - 1 + 1)) + 1,
          revenue: Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000,
          type: "products",
        }));
      // const arrangeSpecialProducts: ArrangedProduct[] = specialProducts?.map(
      //   (product: ProductType) => ({
      //     id: product.id,
      //     name: product.name,
      //     image: product.image,
      //     quantity: product.quantity as number,
      //     price: product.price as number,
      //     category: product.tag,
      //     order: Math.floor(Math.random() * (500 - 50 + 1)) + 50,
      //     rating: Math.floor(Math.random() * (10 - 1 + 1)) + 1,
      //     revenue: Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000,
      //     type: "specials",
      //   })
      // );
      const getAllProducts = [
        ...arrangeNormalProducts,
        // ...arrangeSpecialProducts,
      ];
      setFetchedProducts(getAllProducts as ArrangedProduct[]);
      setOriginalData(getAllProducts);
    } catch (error) {
      throw new Error(`Error while fetching products` + error);
    }
    setLoading(false);
  };

  const dispatch = useDispatch<AppDispatch>();

  //Sorting
  const handleSelect = async (value: string) => {
    const newOrder = sortOrder.order === "asc" ? "desc" : "asc";

    let sortedCustomers;
    if (value === "Name") {
      sortedCustomers = [...fetchedProducts].sort(
        (a: ArrangedProduct, b: ArrangedProduct) =>
          newOrder === "desc"
            ? b.name.localeCompare(a.name)
            : a.name.localeCompare(b.name)
      );
    }
    if (value === "Quantity") {
      sortedCustomers = [...fetchedProducts].sort(
        (a: ArrangedProduct, b: ArrangedProduct) =>
          newOrder === "desc"
            ? b.quantity - a.quantity
            : a.quantity - b.quantity
      );
    }
    if (value === "Price") {
      sortedCustomers = [...fetchedProducts].sort(
        (a: ArrangedProduct, b: ArrangedProduct) =>
          newOrder === "desc" ? b.price - a.price : a.price - b.price
      );
    }
    if (value === "Revenue") {
      sortedCustomers = [...fetchedProducts].sort(
        (a: ArrangedProduct, b: ArrangedProduct) =>
          newOrder === "desc" ? b.revenue - a.revenue : a.revenue - b.revenue
      );
    }
    if (value === "Orders") {
      sortedCustomers = [...fetchedProducts].sort(
        (a: ArrangedProduct, b: ArrangedProduct) =>
          newOrder === "desc" ? b.order - a.order : a.order - b.order
      );
    }
    if (value === "Rating") {
      sortedCustomers = [...fetchedProducts].sort(
        (a: ArrangedProduct, b: ArrangedProduct) =>
          newOrder === "desc" ? b.rating - a.rating : a.rating - b.rating
      );
    }

    setSortOrder({ field: value, order: newOrder });
    setFetchedProducts(sortedCustomers as ArrangedProduct[]);
  };

  const handleSelectedDelete = async () => {
    const toastLoader = toast.loading("Deleting products...");
    try {
      // Separate products into specials and normal products
      const { specials, products } = bulkSelectedProduct.reduce<{
        specials: string[];
        products: string[];
      }>(
        (acc, product) => {
          if (product.category === "specials") {
            acc.specials.push(product.id);
          } else if (product.category === "products") {
            acc.products.push(product.id);
          }
          return acc;
        },
        { specials: [], products: [] }
      );
      if (specials.length > 0) {
        await bulkDeleteOfProduct({ category: "specials", ids: specials });
      }

      // Perform bulk delete for normal products
      if (products.length > 0) {
        await bulkDeleteOfProduct({ category: "products", ids: products });
      }
      toast.dismiss(toastLoader);
      const refreshProducts = fetchedProducts?.filter((product) => {
        return !specials.includes(product.id) && !products.includes(product.id);
      });
      toast.dismiss(toastLoader);
      setFetchedProducts(refreshProducts);
      toast.success("Successfully deleted");
    } catch (error) {
      toast.dismiss(toastLoader);
      toast.error("Unable to delete products");
      console.error("Error deleting products:", error);
    }
    setIsBulkDelete(false);
  };

  useEffect(() => {
    // call getAllProducts

    getAllProducts();
  }, [pagination.perPage]);

  // delete products
  const handleDelete = async (id: string, type: "specials" | "products") => {
    if (!id && !type) return toast.error(`${id} || ${type} not found`);
    const toastLoader = toast.loading("Deleting product...");
    try {
      await deleteProduct({ id: id, type: type });
      toast.dismiss(toastLoader);
      toast.success("Successfully deleted");
      const refreshProducts = fetchedProducts?.filter(
        (product) => product.id !== id
      );
      setFetchedProducts(refreshProducts);
    } catch (error) {
      toast.dismiss(toastLoader);
      toast.error("Error while deleting...");

      throw new Error("Error while deleting product" + error);
    }
  };
  const handleBulkSelected = (id: string, isChecked: boolean) => {
    const refreshIds = bulkSelectedProduct?.filter(
      (product) => product.id !== id
    );

    isChecked
      ? setBulkSelectedProduct((prev) => {
          const newProduct = prev?.filter((product) => product.id !== id);
          const findProduct = fetchedProducts?.find(
            (product) => product.id === id
          );
          return newProduct
            ? [
                ...newProduct,
                { category: findProduct?.type, id: findProduct?.id },
              ]
            : [{ category: findProduct?.type, id: findProduct?.id }];
        })
      : setBulkSelectedProduct(refreshIds);
  };
  const handleAllSelected = (isChecked: boolean) => {
    if (isChecked) {
      const allProducts = fetchedProducts?.map((product) => {
        return { category: product.type, id: product.id };
      });
      setBulkSelectedProduct(allProducts);
    }
    if (!isChecked) {
      setBulkSelectedProduct([]);
    }
  };

  useEffect(() => {
    if (fetchedProducts.length > 0) {
      fetchedProducts?.forEach((product) => {
        dispatch(
          addProducts({
            id: product.id,
            name: product.name,
            quantity: product.quantity,
            price: product.price,
            image: product.image,
            category: product.category,
          })
        );
      });
    }
  }, [fetchedProducts, dispatch]);

  useEffect(() => {
    if (sortOrder.field === "") {
      setFetchedProducts(originalData);
    }
  }, [originalData, sortOrder.field]);

  // fetch next page
  useEffect(() => {
    if (
      pagination.currentPage > 1 &&
      currentDoc?.currentFirstDoc &&
      currentDoc.currentFirstDoc.length > 0
    ) {
      const fetchNextPage = async () => {
        setLoading(true);
        try {
          const products = await getProducts({
            path: "products",
            pageSize: pagination.perPage,
            direction: "next",
            filter: "name",
            sort: "asc",
            currentFirstDoc: currentDoc.currentFirstDoc,
          });

          const normalProducts = products.data as {
            currentFirstDoc: string;
            currentLastDoc: string;
            products: ProductType[];
          };

          const newProducts = normalProducts.products?.map((product) => ({
            id: product.id,
            name: product.name,
            image: product.image,
            quantity: product.quantity as number,
            price: product.price as number,
            category: product.tag,
            order: 20,
            rating: 4.3,
            revenue: 15000,
            type: "products",
          }));

          setFetchedProducts((prev) => [
            ...prev,
            ...newProducts.filter(
              (product) => !prev.some((p) => p.id === product.id)
            ),
          ]);
        } catch (error) {
          throw new Error(`Error while fetching products: ${error}`);
        }
        setLoading(false);
      };

      fetchNextPage();
    }
  }, [pagination.currentPage, currentDoc?.currentFirstDoc, pagination.perPage]);

  const closeModal = () => setIsModelOpen(true);

  const handleChange = (value: string) => {
    if (value.length <= 0) return getAllProducts();
    const filterProducts = SearchProduct(fetchedProducts, value);

    if (filterProducts.length <= 0) return setFetchedProducts([]);
    setFetchedProducts(filterProducts);
  };

  const debounceSearch = useCallback(debounce(handleChange, 300), []);

  return (
    <div className="relative flex flex-col items-start justify-center w-full px-5 py-7 gap-7 ">
      <div className="flex items-center justify-between w-full">
        <div className="flex flex-col items-start justify-center">
          <h4 className="text-[1.25rem] font-[600] tracking-wide text-[var(--dark-text)]">
            All products
          </h4>
          <p className="text-[14px] text-[var(--dark-secondary-text)] text-nowrap ">
            {fetchedProducts?.length} entries found
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
                  sortOrder={sortOrder.order}
                  onSelect={handleSelect}
                  sortingOptions={[
                    "Name",
                    "Quantity",
                    "Price",
                    "Orders",
                    "Revenue",
                    "Rating",
                  ]}
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
        <div className="flex items-center justify-start sm:w-auto gap-2 w-full ">
          {" "}
          <form action="" className="relative ">
            <input
              id="search"
              type="search"
              onChange={(event) => debounceSearch(event?.target.value)}
              className=" border placeholder:text-sm placeholder:text-[var(--dark-secondary-text)] outline-none sm:w-[300px] w-full py-2 px-2  border-[var(--dark-secondary-background)] bg-[var(--light-background)] rounded-lg  focus:border-[var(--primary-color)] "
              placeholder="Search for products"
            />
          </form>
          <div className="h-10  w-[1px] bg-gray-300 "></div>
          <DeleteButton
            dataLength={bulkSelectedProduct.length}
            deleteFn={() => setIsBulkDelete(true)}
          />
        </div>
        <div>
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
      </div>

      <FoodTable
        onPageChange={(page: number) =>
          setPagination((prev) => ({ ...prev, currentPage: page }))
        }
        pagination={{
          currentPage: pagination.currentPage,
          perPage: pagination.perPage,
        }}
        selectedData={bulkSelectedProduct}
        products={fetchedProducts}
        actions={{
          delete: (id) => {
            const findProduct = fetchedProducts?.find(
              (product) => product.id === id
            );
            setType(findProduct?.type);
            setId(id);
            setIsDelete(true);
          },
          edit: (id) => {
            const findProduct = fetchedProducts?.find(
              (product) => product.id === id
            );
            setIsEdit(false);
            setModalData(findProduct);
          },
          checkFn: (id: string, isChecked: boolean) =>
            handleBulkSelected(id, isChecked),
          checkAllFn: (isChecked: boolean) => handleAllSelected(isChecked),
        }}
        loading={loading}
      />

      <Modal close={isModalOpen} closeModal={closeModal}>
        <UploadFood />
      </Modal>
      <Modal close={isEdit} closeModal={() => setIsEdit(true)}>
        <UpdateFood
          product={modalData as ArrangedProduct}
          closeModal={() => setIsEdit(true)}
        />
      </Modal>
      {isDelete && (
        <Delete
          closeModal={() => setIsDelete(false)}
          id={id as string}
          type={type}
          isClose={isDelete}
          setDelete={(id: string, type: "specials" | "products") =>
            handleDelete(id, type)
          }
        />
      )}
      {isBulkDelete && (
        <Delete
          closeModal={() => setIsBulkDelete(false)}
          id={id as string}
          isClose={isBulkDelete}
          setDelete={() => handleSelectedDelete()}
        />
      )}
    </div>
  );
};

export default FoodPage;
