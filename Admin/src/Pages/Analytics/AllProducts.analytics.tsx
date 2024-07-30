/* eslint-disable no-unsafe-optional-chaining */
import { useEffect, useState } from "react";
import { FilterButton } from "../../Components/Common/Sorting/Sorting";
import {
  bulkDeleteOfProduct,
  getProducts,
  getSpecialProducts,
} from "../../Services";
import { ArrangedProduct, ProductType } from "../../models/productMode";
import { FoodTable } from "../Food/FoodTable";
import Modal from "../../Components/Common/Popup/Popup";
import UpdateFood from "../../Components/Upload/UpdateFood";
import Delete from "../../Components/Common/Delete/Delete";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const AllProductAnalytics = () => {
  const [fetchedProducts, setFetchedProducts] = useState<ArrangedProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [id, setId] = useState<string>();
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(true);
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
        <div className="flex items-center justify-center gap-3">
          <p className="text-xl text-nowrap">All products</p>
          <div className="h-5  w-[1px] bg-gray-300 "></div>
          <div>
            <Trash2
              onClick={() => {
                setIsDelete(true);
              }}
              className="size-7"
            />
          </div>
        </div>
        <div>
          <FilterButton
            sortOrder=""
            onSelect={() => {}}
            sortingOptions={["Asc", "Desc"]}
          />
        </div>
      </div>
      <FoodTable
        selectedData={bulkSelectedProduct}
        actions={{
          checkFn: (id, isChecked) => handleBulkSelected(id, isChecked),
          delete: (id) => {
            setId(id);
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
      {isDelete && (
        <Delete
          closeModal={() => setIsDelete(false)}
          id={id as string}
          isClose={isDelete}
          setDelete={() => handleSelectedDelete()}
        />
      )}
      {isDelete && (
        <Delete
          closeModal={() => setIsDelete(false)}
          id={id as string}
          isClose={isDelete}
          setDelete={(id: string) => id}
        />
      )}
    </div>
  );
};

export default AllProductAnalytics;
