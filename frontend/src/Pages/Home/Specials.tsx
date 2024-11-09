import React, { useRef } from "react";
import { SpecialCards } from "../../Components/Card/Card.Product";
import Cart from "../Cart/Cart";
import { Product } from "../../models/product.model";
import Skeleton from "react-loading-skeleton";

import { specialProducts } from "../../Hooks/useAllProducts";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Specials: React.FC = () => {
  const { data } = specialProducts();

  const specialsRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="flex flex-col bg-[var(--light-foreground)] w-full h-full gap-8 px-8 py-8 rounded">
      <div className="w-full py-5">
        <h2 className="text-xl md:text-3xl font-bold tracking-wide text-[var(--dark-text)]">
          Today's Specials 🎉
        </h2>
      </div>
      <div className="flex justify-between gap-8 group/data" id="specials">
        <div className=" min-w-[300px] w-[2000px] relative ">
          <div
            ref={specialsRef}
            className="relative flex flex-col items-center justify-between w-full col-span-5 overflow-x-auto overflow-y-hidden rounded-md item-scrollbar gap-9 lg:col-span-3"
          >
            <div className="w-full h-full ">
              <SpecialCardsContainer products={data ? data?.slice(0, 4) : []} />
            </div>
            <div className={`w-full h-full `}>
              <SpecialCardsContainer1 products={data ? data?.slice(4) : []} />
            </div>
          </div>
          {data && data?.length > 0 && (
            <div className="w-full invisible group-hover/data:visible opacity-0 group-hover/data:opacity-100 duration-200 absolute z-50 sm:top-[17.87rem] top-[11rem] flex justify-between">
              <button
                onClick={() => {
                  specialsRef.current?.scrollBy({
                    behavior: "smooth",
                    left: -300,
                  });
                }}
                className=" p-2 hover:bg-[#68656541] duration-150 text-[var(--dark-text)] rounded-full "
              >
                <ChevronLeft className="sm:size-6 size-5 " />
              </button>
              <button
                onClick={() => {
                  specialsRef.current?.scrollBy({
                    behavior: "smooth",
                    left: 300,
                  });
                }}
                className=" p-2 hover:bg-[#68656541] duration-150  text-[var(--dark-text)] rounded-full "
              >
                <ChevronRight className="sm:size-6 size-5 " />
              </button>
            </div>
          )}
        </div>
        <div className="bg-[var(--light-background)] h-full  min-w-[400px] hidden lg:flex lg:col-span-2 w-full px-5 py-5 rounded-md">
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
      <div className="flex gap-5 pr-5 overflow-x-scroll justify-evenly w-fit">
        {products.length > 0 ? (
          products.map((item) => <SpecialCards prop={item} key={item.id} />)
        ) : (
          <div className="flex w-full gap-4 ">
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
      <div className="flex gap-5 pr-5 overflow-x-scroll justify-evenly w-fit">
        {products.length > 0 ? (
          products.map((item) => <SpecialCards prop={item} key={item.id} />)
        ) : (
          <div className="flex w-full gap-4">
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
