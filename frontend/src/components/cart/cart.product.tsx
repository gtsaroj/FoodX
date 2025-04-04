import React, { useEffect, useState } from "react";
import { SingleCard, Loader } from "../../components";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../../reducer/index.ts";
import toast from "react-hot-toast";
import { addProductToCart, getProductsOfCart } from "../../services";
import { useQuery } from "react-query";
import { useAllProducts } from "../../hooks/useAllProducts.ts";
import { useAppDispatch, useAppSelector } from "../../hooks/useActions.ts";
import { Icons } from "../../utils/icons.ts";

interface CardProp {
  action?: () => void;
}

export const Cart: React.FC<CardProp> = ({ action }) => {
  const { data: products } = useAllProducts();
  const [loading, setLoading] = useState<boolean>(false);
  const store = useAppSelector();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const Total = () => {
    let total = 0;
    store?.cart?.products?.forEach(
      (singleProduct) => (total += singleProduct.price * singleProduct.quantity)
    );
    return total;
  };

  const addProductToCartFn = async (product: Ui.Product) => {
    const toastLoader = toast.loading("Loading...");

    try {
      if (
        store?.auth?.userInfo?.uid &&
        !store?.cart?.products?.some((data) => data.id === product.id)
      ) {
        await addProductToCart(store?.auth.userInfo?.uid as string, product.id);
      }
      dispatch(
        addToCart({
          id: product.id,
          name: product.name,
          image: product.image,
          price: product.price,
          quantity: 1,
          tagId: product.tagId,
        })
      );
    } catch (error) {
      toast.error(error as string);
    }
    toast.dismiss(toastLoader);
  };

  const fetchProductsOfCartFn = async (): Promise<string[]> => {
    setLoading(true);
    try {
      const response = await getProductsOfCart(
        store?.auth?.userInfo?.uid as string
      );
      return response.data?.products as string[];
    } catch (error) {
      throw new Error("Error while fetching products of cart" + error);
    }
  };

  const { data: productIdsInCart } = useQuery(
    "productsOfCart",
    fetchProductsOfCartFn,
    {
      enabled: store?.auth?.success && !store?.cart?.products,
    }
  );

  useEffect(() => {
    if (productIdsInCart) {
      const filterProducts = products?.filter((product) =>
        productIdsInCart.includes(product.id as string)
      );

      const isProductExist = filterProducts?.filter(
        (product) =>
          !store?.cart?.products.some((data) => product.id === data.id)
      );
      isProductExist?.forEach((product) => {
        dispatch(
          addToCart({
            id: product.id,
            name: product.name,
            image: product.image,
            price: product.price,
            quantity: 1,
            tagId: product.tagId,
          })
        );
      });
    }
  }, [productIdsInCart?.length]);

  const addNewProductToCartFn = async () => {
    const productsId = store?.cart?.products?.map((product) => product.id);
    try {
      const newProductsId = productsId?.filter(
        (id) => !productIdsInCart?.some((data) => data === id)
      );
      if (newProductsId && productIdsInCart && productIdsInCart?.length > 0) {
        newProductsId?.forEach(async (product) => {
          await addProductToCart(store?.auth?.userInfo?.uid as string, product);
        });
      }
    } catch (error) {
      throw new Error("Error while adding new Product id " + error);
    }
  };

  useEffect(() => {
    if (store?.auth?.success) {
      addNewProductToCartFn();
    }
  }, [store?.auth?.userInfo.uid, store?.cart.products, dispatch]);

  return (
    // Desktop
    <div
      onDragOver={(event) => {
        event.preventDefault();
      }}
      onDrop={(event) => {
        const productData = event.dataTransfer.getData("product");
        const product = JSON.parse(productData);
        addProductToCartFn(product);
      }}
      className="flex flex-col w-full justify-between h-full gap-3"
    >
      <div className="flex flex-col items-start ">
        <h3 className="w-full py-2 sm:text-[25px] text-[18px] font-semibold tracking-wide text-[var(--dark-text)]">
          My Cart
        </h3>

        <div
          className={`flex flex-col relative sm:h-[400px] min-h-[200px] h-[300px]  pr-2 items-center gap-2 w-full py-5 scrollbar-custom duration-200   overflow-auto`}
        >
          {store?.cart?.products?.length > 0 ? (
            store?.cart?.products?.map((singleSelectedProduct) => (
              <SingleCard
                prop={singleSelectedProduct}
                key={singleSelectedProduct.id}
              />
            ))
          ) : (
            <div className="flex flex-col h-full   py-16 items-center justify-center gap-6">
              <Icons.shoppingBag className=" text-[var(--dark-text)] cursor-pointer sm:size-20 size-16" />

              <h1 className=" sm:text-[20px] text-[14px] tracking-wider text-[var(--dark-text)] ">
                Your cart is empty
              </h1>
            </div>
          )}
        </div>
      </div>
      <div className="flex border-t-[1px] border-[var(--dark-border)]    flex-col w-full gap-5">
        <div className="flex justify-between p-2  text-[var(--dark-text)]">
          <p className="sm:text-lg text-[16px] font-semibold tracking-wider">
            Total Amount:
          </p>
          <p className="sm:text-[18px] text-[14px] ">
            Rs. <span>{Total()}</span>
          </p>
        </div>
        <button
          disabled={!store?.cart?.products.length}
          onClick={() => {
            action && action();
            setLoading(true);
            navigate("/cart/checkout");
          }}
          className=" py-1.5 rounded-md px-4 w-full flex justify-center items-center bg-[var(--primary-color)] text-center focus:bg-[var(--primary-dark)]    sm:hover:bg-[var(--primary-dark)]  text-white  tracking-wider sm:text-xl text-[16px] font-semibold"
        >
          Checkout
        </button>
        <Loader isLoading={loading} loadingFn={() => setLoading(false)} />
      </div>
    </div>
  );
};
