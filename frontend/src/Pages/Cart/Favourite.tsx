import React, { useEffect, useState } from "react";
import { AppDispatch, RootState } from "../../Store";
import { useDispatch, useSelector } from "react-redux";
import { ShoppingBag } from "lucide-react";
import { addToCart } from "../../Reducer/product.reducer";
import toast from "react-hot-toast";
import { FavouriteCard } from "../../Components/Card/Card.Favourite";
import {
  getNormalProducts,
  getSpecialProducts,
} from "../../Services/product.services";
import { Product } from "../../models/product.model";
import { resetFavourite } from "../../Reducer/favourite.reducer";
import { addProductToCart } from "../../Services/cart.services";

const Favourite: React.FC = () => {
  const store = useSelector((state: RootState) => state.root);
  const [initialProducts, setInitialProducts] = useState<Product[]>([]);

  const dispatch = useDispatch<AppDispatch>();

  const addProductToCartFn = () => {
    const toastLoader = toast.loading("Loading...");
    try {
      const products = store?.cart?.products;
      const unExistProductInCart = initialProducts?.filter(
        (product) => !products.some((id) => id.id === product.id)
      );
      if (unExistProductInCart.length <= 0) {
        toast.dismiss(toastLoader);
        toast.success("Product already exist.");

        return;
      }

      if (unExistProductInCart?.length > 0) {
        unExistProductInCart?.forEach(
          async (product) =>
            await addProductToCart(
              store?.auth?.userInfo?.uid as string,
              product.id
            )
        );
      }
      unExistProductInCart?.forEach((prop) => {
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
      });
      toast.dismiss(toastLoader);
      toast.success("Succesfully added!");
    } catch (error) {
      toast.dismiss(toastLoader);
      throw new Error("Error while adding product to cart " + error);
    }
  };

  const getAllProducts = async () => {
    try {
      const [response, specialsProduct] = [
        await getNormalProducts(),
        await getSpecialProducts(),
      ];

      const products = [...response.data, ...specialsProduct.data] as Product[];

      const aggregateProducts = products?.filter((data) =>
        store?.favourite?.favourite?.includes(data.id)
      );
      setInitialProducts(aggregateProducts);
    } catch (error) {
      throw new Error("Error while fetching  all products" + error);
    }
  };

  useEffect(() => {
    getAllProducts();
  }, [store.favourite.favourite]);

  return (
    <div className="flex flex-col  h-[580px]  rounded-lg  w-[350px]   pb-7 justify-between    bg-[var(--light-foreground)] sm:w-[450px]    ">
      <div className="flex flex-col items-start ">
        <h3 className="w-full border-b-[1px] border-[var(--dark-border)]  text-2xl px-3 py-5 font-semibold tracking-wide text-[var(--dark-text)]">
          My Favourite
        </h3>
      </div>
      <div className="flex h-full px-4 flex-col duration-500 items-center gap-6 w-full py-5 overflow-y-scroll">
        {initialProducts.length > 0 ? (
          initialProducts?.map((singleSelectedProduct) => (
            <FavouriteCard
              prop={singleSelectedProduct}
              key={singleSelectedProduct.id}
            />
          ))
        ) : (
          <div className="flex flex-col items-center py-16 justify-center gap-2">
            <ShoppingBag className=" cursor-pointer size-16" />

            <h1 className="text-[25px]">Your Favourite is empty</h1>
          </div>
        )}
      </div>

      <div
        onClick={() => {
          addProductToCartFn();
        }}
        className="sm:py-3 py-2 cursor-pointer rounded-md px-4 w-full flex justify-center items-center bg-[var(--primary-color)] text-center hover:bg-[var(--primary-dark)]  "
      >
        <button className="text-white tracking-wider text-lg sm:text-xl font-semibold">
          Add to cart
        </button>
      </div>
    </div>
  );
};

export default Favourite;
