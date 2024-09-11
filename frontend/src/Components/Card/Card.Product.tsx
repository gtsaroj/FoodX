import { Heart, Minus, Plus, ShoppingCart } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../Reducer/product.reducer";
import { RootState } from "../../Store";
import { LoadingText } from "../Loader/Loader";
import { addToFavourite } from "../../Reducer/favourite.reducer";
import { Product } from "../../models/product.model";
import Modal from "../Common/Popup/Popup";
import { LoginContainer } from "../Login/Login";
import { addFavourite, getFavourites } from "../../Services/favourite.services";
import toast from "react-hot-toast";
import { Favourite } from "../../models/favourite.model";

interface MenuProp {
  prop: Product;
}
export const SpecialCards: React.FC<MenuProp> = ({ prop }: MenuProp) => {
  const [activeCart, setActiveCart] = useState<boolean>(false);
  const [cartQuantity, setCartQuantity] = useState<number>(1);
  const [loader, setLoader] = useState<boolean>(false);
  const [isNotAuthenticated, setIsNotAuthenticated] = useState<boolean>(true);
  const [isDragging, setIsDragging] = useState(false);
  const [favourites, setFavourites] = useState<Favourite[]>([]);
  const dispatch = useDispatch();

  const authUser = useSelector((state: RootState) => state.root.auth.userInfo);

  const addFavouriteProduct = async () => {
    try {
      await addFavourite({ uid: authUser.uid as string, productId: prop.id });
      toast.success("Product added succussfully!");
    } catch (error) {
      toast.error("Error while adding products");
      throw new Error("Error while adding favourite products" + error);
    }
  };

  const selectedProductsQuantity = useSelector(
    (state: RootState) => state.root.cart.products
  );

  const getFavouireProducts = async () => {
    try {
      const response = await getFavourites(authUser.uid as string);
      setFavourites(response.data.favourites);
    } catch (error) {
      throw new Error("Error while adding favourite products" + error);
    }
  };

  useEffect(() => {
    if(!authUser.uid) return;
    getFavouireProducts();
  }, []);

  const isFavourite = (id: string) => {
    return favourites?.some((singleProduct) => singleProduct.id === id);
  };
  const isAuthUser = useSelector((state: RootState) => state.root.auth.success);

  const heartColor = isFavourite(prop.id)
    ? "fill-red-600 text-red-600 "
    : "fill-transparent";

  const handleClick = () => {
    setCartQuantity((prev) => (prev <= 1 ? 1 : prev - 1));

    const findQuantity = selectedProductsQuantity?.find(
      (singleProduct) => singleProduct.id == prop.id
    );
    if (findQuantity?.quantity) {
      dispatch(
        addToCart({
          id: prop.id,
          quantity: findQuantity.quantity <= 1 ? 1 : -1,
        })
      );
    }
  };


  useEffect(() => {
    const findQuantity = selectedProductsQuantity?.find(
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
  }, [selectedProductsQuantity, isAuthUser]);

  const closeLoader = () => {
    setLoader(false);
    return false;
  };

  return (
    <>
      <div
        onDragEnd={(event) => {
          event.preventDefault();
          setIsDragging(false);
          const target = event.target as HTMLElement;
          target.classList.remove("dragged");
        }}
        draggable
        onDragStart={(event: React.DragEvent<HTMLDivElement>) => {
          const element = event.target as HTMLDivElement;
          element.classList.add("dragged");
          event.dataTransfer.setData("product", JSON.stringify(prop));
        }}
        className={
          " card h-full  w-[250px] group/heart  cursor-pointer rounded-xl border border-[var(--dark-border)] pb-3 overflow-hidden  relative snap-start"
        }
      >
        <div className="">
          <img
            src={prop?.image}
            className="w-full h-[180px] object-cover object-center rounded-t-md"
          />
        </div>
        <div className="flex items-center text-[var(--dark-text)] justify-between gap-1 px-5 pt-4 pb-2">
          <div className="flex flex-col gap-1 pt-2">
            <h4 className="font-semibold tracking-wide">{prop.name}</h4>
            <p className="flex gap-2 tracking-wider">
              Rs <span className="tracking-wide">{prop.price}</span>
            </p>
          </div>
        </div>

        <div
          className={`p-2 ${
            activeCart
              ? ""
              : "duration-200 cursor-pointer hover:bg-[var(--primary-color)] hover:text-[var(--dark-text)]"
          }   bg-[var(--light-foreground)] rounded-full text-[var(--primary-color)]   shadow-sm flex justify-between items-center absolute top-[165px] right-1 border border-[var(--dark-border)]  `}
        >
          {activeCart ? (
            <div className="flex items-center gap-2 px-1 text-xs select-none ">
              <button
                onClick={() => handleClick()}
                disabled={cartQuantity <= 1 ? true : false}
              >
                <Minus
                  size={20}
                  className={` hover:text-[var(--secondary-color)]`}
                  aria-disabled={"true"}
                />
              </button>

              <p className="px-1">{cartQuantity ? cartQuantity : "Add"}</p>
              <Plus
                size={20}
                className=" cursor-pointer hover:text-[var(--secondary-color)]"
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
              className=""
              onClick={() => {
                setActiveCart((prevValue) => !prevValue);
                dispatch(
                  addToCart({
                    id: prop.id,
                    name: prop.name,
                    image: prop.image,
                    price: prop.price,
                    quantity: 1,
                    tag: prop.tag,
                  })
                );
              }}
            />
          )}
        </div>
        <div
          onClick={() => {
            if (isAuthUser) {
              setLoader(true);
              addFavouriteProduct();
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
      <LoadingText isLoading={loader} loadingFn={() => closeLoader()} />
      <Modal
        close={isNotAuthenticated}
        closeModal={() => setIsNotAuthenticated(true)}
      >
        <LoginContainer />
      </Modal>
    </>
  );
};
