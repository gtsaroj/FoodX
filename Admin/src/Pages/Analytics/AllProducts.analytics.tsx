/* eslint-disable no-unsafe-optional-chaining */
import { useCallback, useEffect, useState } from "react";
import {
  addLogs,
  bulkDeleteOfProduct,
  deleteProduct,
  getProducts,
} from "../../Services";
import {
  ArrangedProduct,
  GetProductModal,
  ProductType,
} from "../../models/productMode";
import { FoodTable } from "../Food/FoodTable";
import Modal from "../../Components/Common/Popup/Popup";
import UpdateFood from "../../Components/Upload/UpdateFood";
import Delete, { DeleteButton } from "../../Components/Common/Delete/Delete";
import { ChevronUp, Filter, X } from "lucide-react";
import toast from "react-hot-toast";
import { debounce } from "../../Utility/Debounce";
import { SearchProduct } from "../../Utility/Search";
import { Button } from "../../Components/Common/Button/Button";
const AllProductAnalytics = () => {
  const [fetchedProducts, setFetchedProducts] = useState<ArrangedProduct[]>([]);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [loading, setLoading] = useState<boolean>(false);
  const [id, setId] = useState<string>();
  const [type, setType] = useState<"specials" | "products">();
  const [isFilter, setIsFiltered] = useState<
    "products" | "specials" | undefined
  >();
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(true);
  const [isBulkDelete, setIsBulkDelete] = useState<boolean>(false);
  const [modalData, setModalData] = useState<ArrangedProduct>();
  const [pagination, setPagination] = useState<{
    currentPage: number;
    perPage: number;
  }>({ currentPage: 1, perPage: 5 });
  const [currentDoc, setCurrentDoc] = useState<{
    currentFirstDoc: string;
    currentLastDoc: string;
  }>();
  const [totalData, setTotalData] = useState<number>();
  const [bulkSelectedProduct, setBulkSelectedProduct] = useState<
    {
      category: "specials" | "products";
      id: string;
    }[]
  >([]);
  // get all products
  const getAllProducts = async (data: GetProductModal) => {
    setLoading(true);
    try {
      const products = await getProducts({
        path: data.path,
        pageSize: data.pageSize,
        direction: data.direction,
        filter: data.filter,
        sort: data.sort,
        currentFirstDoc: data?.currentFirstDoc || null,
        currentLastDoc: data?.currentLastDoc || null,
      });

      const specialProducts = products.data as {
        currentFirstDoc: string;
        currentLastDoc: string;
        products: ProductType[];
        length: number;
      };
      setCurrentDoc({
        currentFirstDoc: specialProducts.currentFirstDoc,
        currentLastDoc: specialProducts.currentLastDoc,
      });
      const arrangeNormalProducts: ArrangedProduct[] =
        specialProducts.products?.map((product: ProductType) => ({
          id: product.id,
          name: product.name,
          image: product.image,
          quantity: product.quantity as number,
          price: product.price as number,
          category: product.tag,
          order: 20,
          rating: 4.3,
          revenue: 15000,
          type: data.path,
        }));
      setTotalData(specialProducts.length);
      setFetchedProducts(arrangeNormalProducts as ArrangedProduct[]);
    } catch (error) {
      throw new Error(`Error while fetching products` + error);
    }
    setLoading(false);
  };

  console.log(fetchedProducts, currentDoc);

  useEffect(() => {
    // call getAllProducts
    if (fetchedProducts?.length <= 0) {
      // setCurrentDoc({ currentFirstDoc: "", currentLastDoc: "" });
      getAllProducts({
        path: "products",
        pageSize: pagination.perPage,
        currentFirstDoc: currentDoc?.currentFirstDoc || null,
        currentLastDoc: currentDoc?.currentLastDoc || null,
        direction: "next",
        filter: "name",
        sort: "asc",
      });
    }
  }, [
    pagination.perPage,
    currentDoc?.currentFirstDoc,
    currentDoc?.currentLastDoc,
    fetchedProducts.length,
    isFilter?.length,
  ]);

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
            path:
              isFilter === "products" || isFilter === "specials"
                ? isFilter
                : "products",
            pageSize: pagination.perPage,
            direction: "next",
            filter: "name",
            sort: sortOrder,
            currentFirstDoc: currentDoc.currentFirstDoc,
            currentLastDoc: currentDoc.currentLastDoc,
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
            type: isFilter,
          }));
          setCurrentDoc({
            currentFirstDoc: normalProducts.currentFirstDoc,
            currentLastDoc: normalProducts.currentLastDoc,
          });
          setFetchedProducts((prev) => {
            return [
              ...prev,
              ...newProducts.filter(
                (product) => !prev.some((p) => p.id === product.id)
              ),
            ];
          });
        } catch (error) {
          throw new Error("Error fetching next page:" + error);
        }
        setLoading(false);
      };

      fetchNextPage();
    }
  }, [
    pagination.currentPage,
    currentDoc?.currentFirstDoc,
    pagination.perPage,
    isFilter,
    sortOrder,
  ]);

  //Sorting
  const handleSelect = async (
    isChecked: boolean,
    value: "specials" | "products" | "price" | "orders" | "revenue"
  ) => {
    setIsFiltered(value as any);
    if (!isChecked) setIsFiltered(undefined);
    try {
      if (value === "specials") {
        await getAllProducts({
          pageSize: pagination.perPage,
          path: "specials",
          currentFirstDoc: null,
          currentLastDoc: null,
          direction: "next",
          filter: "name",
          sort: "asc",
        });
      }
      if (value === "products") {
        await getAllProducts({
          pageSize: pagination.perPage,
          path: "products",
          currentFirstDoc: null,
          currentLastDoc: null,
          direction: "next",
          filter: "name",
          sort: "asc",
        });
      }
      if (value === "orders") {
        setCurrentDoc({ currentFirstDoc: "", currentLastDoc: "" });
        await getAllProducts({
          pageSize: pagination.perPage,
          path: "specials",
          currentFirstDoc: currentDoc?.currentFirstDoc || null,
          currentLastDoc: currentDoc?.currentLastDoc || null,
          direction: "next",
          filter: "name",
          sort: "asc",
        });
      }
      if (value === "revenue") {
        await getAllProducts({
          pageSize: pagination.perPage,
          path: "specials",
          currentFirstDoc: null,
          currentLastDoc: null,
          direction: "next",
          filter: "name",
          sort: "asc",
        });
      }
    } catch (error) {
      throw new Error("Unable to filter data" + error);
    }
  };

  const handleChange = (value: string) => {
    if (value.length <= 0) return getAllProducts();
    const filterProducts = SearchProduct(fetchedProducts, value);

    if (filterProducts.length <= 0) return setFetchedProducts([]);
    setFetchedProducts(filterProducts);
  };

  const debounceSearch = useCallback(debounce(handleChange, 300), []);

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
      await addLogs({
        action: "delete",
        date: new Date(),
        detail: `Delete Product : specials:${JSON.stringify(
          specials
        )}, products : ${JSON.stringify(products)} `,
      });
      const refreshProducts = fetchedProducts?.filter((product) => {
        return !specials.includes(product.id) && !products.includes(product.id);
      });

      setFetchedProducts(refreshProducts);
      toast.success("Successfully deleted");
    } catch (error) {
      toast.dismiss(toastLoader);
      toast.error("Unable to delete...");

      throw new Error("Error deleting products:" + error);
      // Handle the error appropriately, e.g., show a notification to the user
    }
    setIsBulkDelete(false);
  };

  const handleDelete = async (id: string, type: "specials" | "products") => {
    const toastLoader = toast.loading("Deleting product...");
    try {
      await deleteProduct({ id: id, type: type });
      toast.dismiss(toastLoader);
      toast.success("Successfully deleted");
      await addLogs({
        action: "delete",
        date: new Date(),
        detail: `Product : ${id} `,
      });
      const refreshProducts = fetchedProducts?.filter(
        (product) => product.id !== id
      );
      setFetchedProducts(refreshProducts);
    } catch (error) {
      toast.dismiss(toastLoader);
      toast.error("Error while deleting...");

      throw new Error("Error while deleting product" + error);
    }
    setIsDelete(false);
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
      <div className="flex sm:items-center justify-between  sm:flex-row flex-col items-start flex-grow w-full gap-5 px-3 pb-6">
        <div className="flex flex-col w-full items-start justify-center gap-3">
          <p className="text-xl text-nowrap">All products</p>

          <div className="flex items-center justify-start sm:w-auto gap-2 w-full ">
            {" "}
            <form action="" className="relative w-full ">
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
            {isFilter && (
              <div className="flex w-[150px]  items-center rounded-lg border  justify-between p-2">
                <div className="flex gap-1 items-center justify-center">
                  <span className="  text-sm ">{isFilter.toLowerCase()}</span>
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
                <button onClick={() => setIsFiltered(undefined)} className=" ">
                  <X className="text-[var(--danger-text)] " size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
        <div className=" z-[1000]">
          <Button
            sortFn={(value) => setSortOrder(value)}
            bodyStyle={{
              width: "400px",
              top: "3rem",
              left: "-18rem",
            }}
            parent={
              <div className="flex border px-4 py-2 rounded items-center justify-start gap-3">
                <Filter className="size-5 text-[var(--dark-secondary-text)]" />
                <span className=" text-[17px] tracking-wide text-[var(--dark-secondary-text)]">
                  Filter
                </span>
              </div>
            }
            types={[
              { label: "Specials", value: "specials", id: "fklsdjf" },
              { label: "products", value: "products", id: "fkjdls" },
            ]}
            sort={[
              { label: "Price", value: "price", id: "jfhkdj" },
              { label: "Orders", value: "orders", id: "fkdsj" },
              { label: "Revenue", value: "revenue", id: "flkjdsf" },
            ]}
            checkFn={(isChecked: boolean, value: any) =>
              handleSelect(isChecked, value)
            }
          />
        </div>
      </div>
      <FoodTable
        totalData={totalData as number}
        pagination={{
          currentPage: pagination.currentPage,
          perPage: pagination.perPage,
        }}
        onPageChange={(page: number) =>
          setPagination((prev) => ({ ...prev, currentPage: page }))
        }
        selectedData={bulkSelectedProduct}
        actions={{
          checkFn: (id, isChecked) => handleBulkSelected(id, isChecked),
          delete: (id) => {
            const findProduct = fetchedProducts?.find(
              (product) => product.id === id
            );
            setId(id);
            setType(findProduct?.type);
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
          closeModal={() => setIsBulkDelete(false)}
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
          setDelete={(id: string, type: "specials" | "products") =>
            handleDelete(id, type)
          }
        />
      )}
    </div>
  );
};

export default AllProductAnalytics;
