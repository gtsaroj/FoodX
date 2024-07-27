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

const FoodPage: React.FC = () => {
  const [isModalOpen, setIsModelOpen] = useState<boolean>(true);
  const [userSearch, setUserSearch] = useState<string>("");
  const [isEdit, setIsEdit] = useState<boolean>(true);
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [modalData, setModalData] = useState<ArrangedProduct>();
  const [id, setId] = useState<string>();

  const [fetchedProducts, setFetchedProducts] = useState<ArrangedProduct[]>([]);
  const [sortOrder, setSortOrder] = useState<{ field: string; order: string }>({
    field: "",
    order: "desc",
  });
  const [loading, setLoading] = useState<boolean>(false);

  const Columns: ColumnProps[] = [
    {
      fieldName: (
        <div className=" w-[30px] flex items-center ">
          <input className="w-4 h-4 cursor-pointer" type="checkbox" />
        </div>
      ),
      render: () => (
        <div className="w-[30px] ">
          <input className="w-4 h-4 cursor-pointer" type="checkbox" />
        </div>
      ),
    },
    {
      fieldName: "Name",
      colStyle: { width: "200px", justifyContent: "start", textAlign:"start" },
      render: (value: ArrangedProduct) => (
        <div className="w-[200px] text-[var(--dark-text)] tracking-wide  flex items-center justify-start gap-3 ">
          <div className="w-[50px] h-[48px]">
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
      fieldName: "Unit price",
      colStyle: { width: "120px", justifyContent: "start",textAlign:"start", padding :"0px 15px 0px 0px" },
      render: (value: ArrangedProduct) => (
        <div className=" text-[var(--dark-text)] tracking-wide w-[120px] ">
          <p>Rs {value.price}</p>
        </div>
      ),
    },
    {
      fieldName: "Orders",
      colStyle: { width: "120px", justifyContent: "start",textAlign:"start" },
      render: (value: ArrangedProduct) => (
        <div className=" text-[var(--dark-text)] tracking-wide w-[120px] ">
          <p>{value.order}</p>
        </div>
      ),
    },
    {
      fieldName: "Revenue",
      colStyle: { width: "120px" , textAlign:"start"},
      render: (value: ArrangedProduct) => (
        <div className=" text-[var(--dark-text)] tracking-wide w-[120px]   text-start ">
          <p>Rs {value.revenue}</p>
        </div>
      ),
    },
    {
      fieldName: "Rating",
      colStyle: { width: "100px", justifyContent: "start", textAlign:"start" },
      render: (value: ArrangedProduct) => (
        <div className=" text-[var(--dark-text)] tracking-wide w-[100px] flex  gap-2 items-center justify-start ">
          <div className="">{value.rating}</div>
          <div className="scale-[1.1]">
          ⭐
          </div>
        </div>
      ),
    },
  ];

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
      sortedCustomers = [...fetchedProducts].sort((a: any, b: any) =>
        newOrder === "desc"
          ? b.Name.localeCompare(a.Name)
          : a.Name.localeCompare(b.Name)
      );
    }
    if (value === "Quantity") {
      sortedCustomers = [...fetchedProducts].sort((a: any, b: any) =>
        newOrder === "desc" ? b.Quantity - a.Quantity : a.Quantity - b.Quantity
      );
    }
    if (value === "Price") {
      sortedCustomers = [...fetchedProducts].sort((a: any, b: any) =>
        newOrder === "desc" ? b.Price - a.Price : a.Price - b.Price
      );
    }

    setSortOrder({ field: value, order: newOrder });
    setFetchedProducts(sortedCustomers as ArrangedProduct[]);
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
      setFetchedProducts(refreshProducts);
    } catch (error) {
      toast.dismiss(toastLoading);
      toast.error("Failed to delete");
      throw new Error("Unable to delete order");
    }
  };

  // headers buttons
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
        <div>
          <Trash2 className="size-7"/>
         </div>
      </div>

      <Table
        data={fetchedProducts}
        columns={Columns as any}
        actionIconColor="red"
        actions={{
          deleteFn: (value) => {
            setIsDelete(true);
            setId(value);
          },
          editFn: (value) => {
            setIsEdit(false);
            const findProduct = fetchedProducts?.find((product)=>product.id === value)
             setModalData(findProduct)
          },
        }}
        disableActions={false}
        loading={loading}
        bodyHeight={400}
        pagination={{ currentPage: 1, perPage: 5 }}
        onPageChange={(pageNumber) => console.log(pageNumber)}
        disableNoData={fetchedProducts?.length < 1 ? true : false}
        headStyle={{ width: "100%" }}
      />

      <Modal close={isModalOpen} closeModal={closeModal}>
        <UploadFood />
      </Modal>
      <Modal close={isEdit} closeModal={() => setIsEdit(true)}>
        <UpdateFood product={modalData as ArrangedProduct} closeModal={() => setIsEdit(true)} />
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

export default FoodPage;
