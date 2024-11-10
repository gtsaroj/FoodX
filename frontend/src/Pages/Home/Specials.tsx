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
    <div className="flex flex-col bg-[var(--light-foreground)] w-full h-full gap-8 px-3 sm:px-8 py-8 rounded">
      <div className="w-full flex justify-start items-center gap-1  ">
        <h2 className=" font-semibold sm:text-[22px] text-[16px] sm:min-w-[350px] w-[340px] tracking-wide text-[var(--dark-text)]">
          Don’t Miss Today’s Treats! 🎉
        </h2>
        <h3 className="h-[1px] w-full  bg-gradient-to-r from-black/100 dark:from-white/100  to-black/0 dark:to-white/0"></h3>
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
              <button aria-label="prev"
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
              <button aria-label="next"
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
              className="w-full flex h-full"
              containerClassName="lg:w-[1024px] lg:min-w-[1000px]  lg:h-[200px] flex gap-2 lg:w-[280px] sm:w-[800px] w-[600px] h-[120px] sm:h-[160px]"
              baseColor="var(--light-background)"
              highlightColor="var(--light-foreground)"
              count={3}
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
              className="w-full lg:w-[1000px] flex h-full"
              containerClassName="lg:w-[1024px] lg:min-w-[1000px] lg:h-[200px] flex gap-2 lg:w-[280px] sm:w-[800px] w-[600px] h-[120px] sm:h-[160px]"
              baseColor="var(--light-background)"
              highlightColor="var(--light-foreground)"
              count={3}
            />
          </div>
        )}
      </div>
    </div>
  );
};
