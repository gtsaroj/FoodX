/* eslint-disable no-unsafe-optional-chaining */
import { useCallback, useEffect, useState } from "react";
import { FilterButton } from "../../Components/Common/Sorting/Sorting";
import {
  bulkDeleteOfProduct,
  deleteProduct,
  getProducts,
  getSpecialProducts,
} from "../../Services";
import { ArrangedProduct, ProductType } from "../../models/productMode";
import { FoodTable } from "../Food/FoodTable";
import Modal from "../../Components/Common/Popup/Popup";
import UpdateFood from "../../Components/Upload/UpdateFood";
import Delete, { DeleteButton } from "../../Components/Common/Delete/Delete";
import { ChevronUp, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import { debounce } from "../../Utility/Debounce";
import { SearchProduct } from "../../Utility/Search";

const AllProductAnalytics = () => {
  const [fetchedProducts, setFetchedProducts] = useState<ArrangedProduct[]>([]);
  const [originalData, setOriginalData] = useState<ArrangedProduct[]>([]);
  const [sortOrder, setSortOrder] = useState<{ field: string; order: string }>({
    field: "",
    order: "desc",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [id, setId] = useState<string>();
  const [type,setType] = useState<"specials"|"products">();
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(true);
  const [isBulkDelete, setIsBulkDelete] = useState<boolean>(false);
  const [modalData, setModalData] = useState<ArrangedProduct>();
  const [bulkSelectedProduct, setBulkSelectedProduct] = useState<
    {
      category: "specials" | "products";
      id: string;
    }[]
  >([]);

  // get all products
  const getAllProducts = async () => {
    setLoading(true);
    try {
      const products = await getProducts();
      const special = await getSpecialProducts();
      const specialProducts = special.data.products;
      const normalProducts = products.data.products;

      const arrangeNormalProducts: ArrangedProduct[] = normalProducts?.map(
        (product: ProductType) => ({
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
        })
      );
      const arrangeSpecialProducts: ArrangedProduct[] = specialProducts?.map(
        (product: ProductType) => ({
          id: product.id,
          name: product.name,
          image: product.image,
          quantity: product.quantity as number,
          price: product.price as number,
          category: product.tag,
          order: 20,
          rating: 4.3,
          revenue: 15000,
          type: "specials",
        })
      );
      const getAllProducts = [
        ...arrangeNormalProducts,
        ...arrangeSpecialProducts,
      ];
      setOriginalData(getAllProducts);
      setFetchedProducts(getAllProducts as ArrangedProduct[]);
    } catch (error) {
      throw new Error(`Error while fetching products` + error);
    }
    setLoading(false);
  };

  useEffect(() => {
    // call getAllProducts
    getAllProducts();
  }, []);

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

  const handleChange = (value: string) => {
    if (value.length <= 0) return getAllProducts();
    const filterProducts = SearchProduct(fetchedProducts, value);

    if (filterProducts.length <= 0) return setFetchedProducts([]);
    setFetchedProducts(filterProducts);
  };

  const debounceSearch = useCallback(debounce(handleChange, 300), []);

  useEffect(() => {
    if (sortOrder?.field === "") {
      setFetchedProducts(originalData);
    }
  }, [originalData, sortOrder?.field]);

  const handleSelectedDelete = async () => {
    try {
      const toastLoader = toast.loading("Deleting products...");
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
      setIsDelete(false);
      setFetchedProducts(refreshProducts);
      toast.success("Successfully deleted");
    } catch (error) {
      console.error("Error deleting products:", error);
      // Handle the error appropriately, e.g., show a notification to the user
    }
  };

  const handleDelete = async (id: string, type: "specials" | "products") => {
   console.log(id,type)
    const toastLoader = toast.loading("Deleting product...");
    try {
      const response = await deleteProduct({ id: id, type: type });
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

  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-5 px-3 py-5">
      <div className="flex items-center justify-between flex-grow w-full gap-5 px-3 pb-6">
        <div className="flex flex-col items-start justify-center gap-3">
          <p className="text-xl text-nowrap">All products</p>

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
            <div className="h-9  w-[1px] bg-gray-300  "></div>
            <DeleteButton
              dataLength={bulkSelectedProduct.length}
              deleteFn={() => setIsBulkDelete(true)}
            />
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
                <button
                  onClick={() => setSortOrder({ field: "" })}
                  className=" "
                >
                  <X className="text-[var(--danger-text)] " size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
        <div className=" z-[1000]">
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
          />
        </div>
      </div>
      <FoodTable
        selectedData={bulkSelectedProduct}
        actions={{
          checkFn: (id, isChecked) => handleBulkSelected(id, isChecked),
          delete: (id) => {
            const findProduct = fetchedProducts?.find((product)=>product.id === id);
            setId(id);
            setType(findProduct?.type)
            setIsDelete(true);
          },
          edit: (id: string) => {
            const findProduct = fetchedProducts?.find(
              (product) => product?.id === id
            );
            setModalData(findProduct);
            setIsEdit(false);
          },
          checkAllFn: (isChecked: boolean) => handleAllSelected(isChecked),
        }}
        products={fetchedProducts}
        loading={loading}
      />
      <Modal close={isEdit} closeModal={() => setIsEdit(true)}>
        <UpdateFood
          product={modalData as ArrangedProduct}
          closeModal={() => setIsEdit(true)}
        />
      </Modal>
      {isBulkDelete && (
        <Delete
          closeModal={() => setIsDelete(false)}
          id={id as string}
          isClose={isBulkDelete}
          setDelete={() => handleSelectedDelete()}
        />
      )}
      {isDelete && (
        <Delete
          closeModal={() => setIsDelete(false)}
          id={id as string}
          type={type}
          isClose={isDelete}
          setDelete={(id: string, type: "specials"| "products") => handleDelete(id, type)}
        />
      )}
    </div>
  );
};

export default AllProductAnalytics;
