import React, { useEffect, useState } from "react";
import { SpecialCards } from "../../Components/Card/Card.Product";
import Cart from "../Cart/Cart";
import { getSpecialProducts } from "../../Services/product.services";
import { Product } from "../../models/product.model";
import Skeleton from "react-loading-skeleton";

const Specials: React.FC = () => {
  const [initalProducts, setInitialProducts] = useState<Product[]>([]);
  const specialProducts = async () => {
    try {
      const response = await getSpecialProducts();
      const products = response.data as Product[];
      setInitialProducts(products);
    } catch (error) {
      setInitialProducts;
      throw new Error("Error while getting special products" + error);
    }
  };

  useEffect(() => {
    specialProducts();
  }, []);

  return (
    <div className="flex flex-col bg-[var(--light-foreground)] w-full h-full gap-8 px-8 py-8 rounded">
      <div className="w-full  py-5">
        <h2 className="text-xl md:text-3xl font-bold tracking-wide text-[var(--dark-text)]">
          Today's Specials 🎉
        </h2>
      </div>
      <div className="grid grid-cols-5 gap-8 " id="specials">
        <div className="  flex overflow-x-auto overflow-y-hidden scrollbar-custom flex-col gap-9 items-center justify-between rounded-md   col-span-5 lg:col-span-3">
          <div className="w-full  h-full  ">
            <SpecialCardsContainer
              products={
                initalProducts?.length > 0 ? initalProducts?.slice(0, 4) : []
              }
            />
          </div>
          <div className={`w-full h-full `}>
            <SpecialCardsContainer1
              products={
                initalProducts?.length > 0 ? initalProducts?.slice(4) : []
              }
            />
          </div>
        </div>
        <div className="bg-[var(--light-background)] h-full hidden lg:flex lg:col-span-2 w-full px-5 py-5 rounded-md">
          <Cart />
        </div>
      </div>
    </div>
  );
};

export default Specials;

interface SpecialProductProp {
  products: Product[];
}

const SpecialCardsContainer: React.FC<SpecialProductProp> = ({ products }) => {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex gap-5  pr-5 overflow-x-scroll justify-evenly w-fit">
        {products.length > 0 ? (
          products.map((item) => <SpecialCards prop={item} key={item.id} />)
        ) : (
          <div className="w-full gap-4 flex ">
            <Skeleton
              height={230}
              width={330}
              baseColor="var(--light-background)"
              highlightColor="var(--light-foreground)"
              count={1}
            />
            <Skeleton
              height={230}
              width={330}
              baseColor="var(--light-background)"
              highlightColor="var(--light-foreground)"
              count={1}
            />
            <Skeleton
              height={230}
              width={330}
              baseColor="var(--light-background)"
              highlightColor="var(--light-foreground)"
              count={1}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export const SpecialCardsContainer1: React.FC<SpecialProductProp> = ({
  products,
}) => {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex  gap-5  pr-5 overflow-x-scroll justify-evenly w-fit">
        {products.length > 0 ? (
          products.map((item) => <SpecialCards prop={item} key={item.id} />)
        ) : (
          <div className="w-full flex gap-4">
            <Skeleton
              height={230}
              width={330}
              baseColor="var(--light-background)"
              highlightColor="var(--light-foreground)"
              count={1}
            />
            <Skeleton
              height={230}
              width={330}
              baseColor="var(--light-background)"
              highlightColor="var(--light-foreground)"
              count={1}
            />
            <Skeleton
              height={230}
              width={330}
              baseColor="var(--light-background)"
              highlightColor="var(--light-foreground)"
              count={1}
            />
          </div>
        )}
      </div>
    </div>
  );
};
