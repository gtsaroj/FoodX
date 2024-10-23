import { Heart, Minus, Plus, ShoppingCart } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeCart } from "../../Reducer/product.reducer";
import { RootState } from "../../Store";
import { Product } from "../../models/product.model";
import Modal from "../Common/Popup/Popup";
import { LoginContainer } from "../Login/Login";
import {
  addFavourite,
  removeFavourites,
} from "../../Services/favourite.services";
import toast from "react-hot-toast";
import {
  addToFavourite,
  removeFavourite,
} from "../../Reducer/favourite.reducer";
import {
  addProductToCart,
  removeProductFromCart,
} from "../../Services/cart.services";
import { getPopularProducts } from "../../Services/product.services";
import { useQuery } from "react-query";

interface MenuProp {
  prop: Product;
  style?: boolean;
}
export const SpecialCards: React.FC<MenuProp> = ({ prop, style }: MenuProp) => {
  const [activeCart, setActiveCart] = useState<boolean>(false);
  const [cartQuantity, setCartQuantity] = useState<number>(1);
  const [isNotAuthenticated, setIsNotAuthenticated] = useState<boolean>(true);

  const dispatch = useDispatch();

  // const authUser = useSelector((state: RootState) => state.root.auth.userInfo);
  // const favourites = useSelector(
  //   (state: RootState) => state.root.favourite.favourite
  // );
  // const selectedProductsQuantity = useSelector(
  //   (state: RootState) => state.root.cart.products
  // );

  const store = useSelector((state: RootState) => state.root);
  const addFavouriteProduct = async () => {
    const toastId = toast.loading("Processing, please wait...");
    try {
      await addFavourite({
        uid: store?.auth?.userInfo?.uid as string,
        productId: prop.id,
      });
      dispatch(addToFavourite(prop.id));
      toast.dismiss(toastId);
      toast.success("Item added!");
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Failed to add the item. Please try again.");
      throw new Error("Error while adding favourite products" + error);
    }
  };

  const removeFavouriteProduct = async () => {
    const toastId = toast.loading("Processing, please wait...");

    try {
      await removeFavourites({
        uid: store?.auth?.userInfo?.uid as string,
        productId: prop.id,
      });
      toast.dismiss(toastId);
      toast.success("Item removed ");
      dispatch(removeFavourite(prop.id));
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Failed to remove the item. Please try again.");
      throw new Error("Error while removing favourite cart product" + error);
    }
  };

  const isFavourite = (id: string) => {
    return store?.favourite?.favourite?.some(
      (singleProduct) => singleProduct === id
    );
  };
  const isAuthUser = useSelector((state: RootState) => state.root.auth.success);

  const heartColor = isFavourite(prop.id)
    ? "fill-red-600 text-red-600 "
    : "fill-transparent";

  const handleClick = (productId?: string) => {
    setCartQuantity((prev) => (prev <= 1 ? 1 : prev - 1));

    const findQuantity = store?.cart?.products?.find(
      (singleProduct) => singleProduct.id == productId
    );
    if (findQuantity?.quantity && findQuantity?.quantity <= 1) {
      removeProductFromCart(
        store?.auth.userInfo?.uid as string,
        productId as string
      );
      dispatch(removeCart(productId));
    } else {
      dispatch(
        addToCart({
          id: productId,
          quantity: -1,
        })
      );
    }
  };

  const addProductToCartFn = async () => {
    const toastLoader = toast.loading("Loading...");
    const isProductExistInCart = store?.cart?.products?.some(
      (product) => product.id === prop.id
    );

    try {
      if (store?.auth?.userInfo?.uid && !isProductExistInCart) {
        await addProductToCart(store?.auth?.userInfo?.uid as string, prop.id);
      }
      setActiveCart((prevValue) => !prevValue);
      dispatch(
        addToCart({
          id: prop.id,
          name: prop.name,
          image: prop.image,
          price: prop.price,
          quantity: 1,
          tagId: prop.tagId,
        })
      );
    } catch (error) {
      toast.error(error as string);
    }
    toast.dismiss(toastLoader);
  };

  const getProducts = async (): Promise<Product[]> => {
    try {
      const response = await getPopularProducts();
      return response.data;
    } catch (error) {
      throw new Error("Error while getting popular products" + error);
    }
  };

  const { data } = useQuery("topProducts", getProducts, {
    staleTime: 3 * 60 * 1000,
  });

  useEffect(() => {
    const findQuantity = store?.cart?.products?.find(
      (singleProduct) => singleProduct.id === prop.id
    );
    if (findQuantity) {
      setCartQuantity(findQuantity.quantity);
    }
    if (findQuantity?.quantity === undefined || null) {
      setActiveCart(false);
    }
    if (isAuthUser) {
      setIsNotAuthenticated(true);
    }
  }, [store?.cart.products, isAuthUser]);

  return (
    <>
      <div
        onDragEnd={(event) => {
          event.preventDefault();
          const target = event.target as HTMLElement;
          target.classList.remove("dragged");
        }}
        draggable
        onDragStart={(event: React.DragEvent<HTMLDivElement>) => {
          const element = event.target as HTMLDivElement;
          element.classList.add("dragged");
          event.dataTransfer.setData("product", JSON.stringify(prop));
        }}
        className={`flex flex-col  ${
          style
            ? "  w-full md:w-[250px]"
            : "sm:h-[280px]  w-[220px] h-[170px]  sm:w-[250px]"
        }  group/heart  cursor-pointer rounded-xl border border-[var(--dark-border)] pb-3 overflow-hidden  relative snap-start
          `}
      >
        <div className="w-full h-[100px] sm:h-[180px] ">
          <img
            src={prop?.image}
            className="w-full h-full object-cover rounded-t-md"
          />
        </div>
        <div className="flex  items-center text-[var(--dark-text)] justify-between gap-1 px-5 pt-2 sm:pt-4 pb-2">
          <div className="flex flex-col gap-1 pt-2">
            <h4 className="font-semibold tracking-wide text-[14px] sm:text-[16px] ">
              {prop.name}
            </h4>
            <p className="flex gap-2 tracking-wider text-[12px] sm:text-[14px] ">
              Rs <span className="tracking-wide ">{prop.price}</span>
            </p>
          </div>
        </div>

        <div
          className={`p-1.5 ${
            activeCart
              ? ""
              : "duration-200 cursor-pointer hover:bg-[var(--primary-color)] hover:text-[var(--dark-text)]"
          }   bg-[var(--light-foreground)] rounded-full text-[var(--primary-color)]   shadow-sm flex justify-between items-center absolute top-[80px] sm:top-[165px] right-1 border border-[var(--dark-border)]  `}
        >
          {activeCart ? (
            <div className="flex items-center gap-2 px-1 text-xs select-none ">
              <button onClick={() => handleClick(prop.id)}>
                <Minus
                  className={` sm:size-5 size-3 hover:text-[var(--secondary-color)]`}
                  aria-disabled={"true"}
                />
              </button>

              <p className="px-1">{cartQuantity ? cartQuantity : "Add"}</p>
              <Plus
                className=" sm:size-5 size-3 cursor-pointer hover:text-[var(--secondary-color)]"
                onClick={() => {
                  setCartQuantity((prevValue) => prevValue + 1);
                  dispatch(
                    addToCart({
                      id: prop.id,
                      quantity: +1,
                    })
                  );
                }}
              />
            </div>
          ) : (
            <ShoppingCart
              className="sm:size-6 size-5 "
              onClick={() => addProductToCartFn()}
            />
          )}
        </div>
        <div className="w-full">
          <div
            className={` ${
              data?.findIndex((product) => product.id === prop.id) !== -1
                ? "visible"
                : "invisible"
            } absolute bg-[var(--light-background)] rounded-full p-1.5 shadow-sm cursor-pointer  text-[var(--dark-text)] left-0 top-2`}
          >
            <p className={`text-[var(--dark-text)] text-sm tracking-`}>
              #
              {data && data?.findIndex((product) => product.id === prop.id) + 1}{" "}
              🔥
            </p>
          </div>
          <div
            onClick={() => {
              if (isAuthUser) {
                isFavourite(prop.id)
                  ? removeFavouriteProduct()
                  : addFavouriteProduct();
              } else {
                setIsNotAuthenticated(false);
              }
            }}
            className="absolute bg-[var(--light-background)] rounded-full p-1.5 shadow-sm cursor-pointer group-hover/heart:visible invisible duration-150 group-hover/heart:opacity-100 opacity-0 text-[var(--dark-text)] right-2 top-2"
          >
            <Heart
              className={`size-6 hover:scale-[1.05] duration-150 hover:text-[var(--danger-bg)]  text-[var(--dark-text)] ${
                isAuthUser ? heartColor : ""
              } `}
            />
          </div>
        </div>
      </div>
      <Modal
        close={isNotAuthenticated}
        closeModal={() => setIsNotAuthenticated(true)}
      >
        <LoginContainer />
      </Modal>
    </>
  );
};
