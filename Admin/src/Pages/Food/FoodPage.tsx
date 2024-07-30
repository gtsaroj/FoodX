import { Filter, Plus, Star, Trash2 } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import UploadFood from "../../Components/Upload/UploadFood";
import Modal from "../../Components/Common/Popup/Popup";
import { DropDown } from "../../Components/Common/DropDown/DropDown";
import { debounce } from "../../Utility/Debounce";
import { ArrangedProduct, ProductType } from "../../models/productMode";
import {
  bulkDeleteOfProduct,
  getProducts,
  getSpecialProducts,
} from "../../Services";
import { deleteProductFromDatabase } from "../../firebase/order";
import { SearchProduct } from "../../Utility/Search";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../Reducer/Store";
import { addProducts } from "../../Reducer/Action";
import { FilterButton } from "../../Components/Common/Sorting/Sorting";
import toast from "react-hot-toast";
import Table from "../../Components/Common/Table/Table";
import { ColumnProps } from "../../models/table.model";
import UpdateFood from "../../Components/Upload/UpdateFood";
import Delete from "../../Components/Common/Delete/Delete";
import { FoodTable } from "./FoodTable";

const FoodPage: React.FC = () => {
  const [isModalOpen, setIsModelOpen] = useState<boolean>(true);
  const [userSearch, setUserSearch] = useState<string>("");
  const [isEdit, setIsEdit] = useState<boolean>(true);
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

  const [fetchedProducts, setFetchedProducts] = useState<ArrangedProduct[]>([]);
  const [sortOrder, setSortOrder] = useState<{ field: string; order: string }>({
    field: "",
    order: "desc",
  });
  const [loading, setLoading] = useState<boolean>(false);

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
      setFetchedProducts(getAllProducts as ArrangedProduct[]);
    } catch (error) {
      throw new Error(`Error while fetching products` + error);
    }
    setLoading(false);
  };

  const dispatch = useDispatch<AppDispatch>();

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
      setIsDelete(false);
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
  }, []);

  // delete products
  const handleDelete = async (id: string) => {
    const toastLoading = toast.loading("Product deleting...");
    const findProduct = fetchedProducts?.find((product) => product.id === id);
    try {
      await bulkDeleteOfProduct({
        category: findProduct?.type as any,
        ids: [id],
      });

      toast.dismiss(toastLoading);
      toast.success("Deleted successfully");
      const refreshProducts = fetchedProducts?.filter(
        (product) => product?.id !== id
      );
      setIsDelete(false);
      setFetchedProducts(refreshProducts);
    } catch (error) {
      setIsDelete(false);
      toast.dismiss(toastLoading);
      toast.error("Failed to delete");
      throw new Error("Unable to delete order");
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
    (async () => {
      if (userSearch?.length > 0) {
        const getAllProducts = await getProducts();
        const filterProducts = SearchProduct(
          getAllProducts.data.products,
          userSearch
        );
        const arrangeProducts = filterProducts?.map((product) => ({
          ID: product.id,
          Product: product.name,
          Image: product.image,
          Quantity: product.quantity,
          Price: product.price,
          Category: product.tag,
        }));
        setFetchedProducts(arrangeProducts as any);
      } else {
        getAllProducts();
      }
    })();
  }, [userSearch]);

  const closeModal = () => setIsModelOpen(true);

  const handleChange = (value: string) => {
    setUserSearch(value);
  };

  const debounceSearch = useCallback(debounce(handleChange, 300), [userSearch]);

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
                  sortingOptions={["Name", "Quantity", "Price"]}
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
        <button
          disabled={bulkSelectedProduct.length >= 1 ? false : true}
          onClick={() => setIsDelete(true)}
        >
          <Trash2 className="size-7" />
        </button>
      </div>

      <FoodTable
        selectedData={bulkSelectedProduct}
        products={fetchedProducts}
        actions={{
          delete: (id) => {
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
          isClose={isDelete}
          setDelete={(id) => handleDelete(id as string)}
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
