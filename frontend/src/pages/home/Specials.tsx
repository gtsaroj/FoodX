import React, { useRef } from "react";
import { specialProducts } from "@/hooks";
import { SpecialProduct } from "@/components";
import { Skeleton } from "@/helpers";

export const Specials: React.FC = () => {
  const { data, isLoading } = specialProducts();

  const specialsRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="flex flex-col w-full h-full gap-8 py-8 rounded">
      <h1 className="sm:text-[25px]  text-[18px] tracking-wide font-semibold    ">
        TODAY'S SPECIAL
      </h1>
      <div className="flex justify-between gap-8 group/data" id="specials">
        {isLoading ? (
          <Skeleton
            children={{
              className:
                "md:min-w-[250px] rounded-md sm:min-w-[200px] min-w-[200px] sm:h-[180px] h-[130px] ",
            }}
            count={6}
            className="w-screen h-full overflow-auto flex items-center justify-start gap-10"
          />
        ) : (
          <div
            ref={specialsRef}
            className="w-full gap-5 flex items-start justify-start overflow-auto "
          >
            {data?.map((product) => (
              <SpecialProduct
                key={product.id}
                {...product}
                discountPrice={45}
              />
            ))}
          </div>
        )}

        {/* <div className="bg-[var(--light-background)] h-full  min-w-[400px] hidden lg:flex lg:col-span-2 w-full px-5 py-5 rounded-md">
          <Cart />
        </div> */}
      </div>
    </div>
  );
};

// const SpecialCardsContainer: React.FC<SpecialProductProp> = ({ products }) => {
//   return (
//     <div className="flex flex-col gap-5">
//       <div className="flex gap-5 pr-5 overflow-x-scroll justify-evenly w-fit">
//         {products.length > 0 ? (
//           products.map((item) => <SpecialCards prop={item} key={item.id} />)
//         ) : (
//           <div className="flex w-full gap-4 ">
//             <Skeleton
//               className="w-full flex h-full"
//               containerClassName="lg:w-[1024px] lg:min-w-[1000px]  lg:h-[200px] flex gap-2 lg:w-[280px] sm:w-[800px] w-[600px] h-[120px] sm:h-[160px]"
//               baseColor="var(--light-background)"
//               highlightColor="var(--light-foreground)"
//               count={3}
//             />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export const SpecialCardsContainer1: React.FC<SpecialProductProp> = ({
//   products,
// }) => {
//   return (
//     <div className="flex flex-col gap-5">
//       <div className="flex gap-5 pr-5 overflow-x-scroll justify-evenly w-fit">
//         {products.length > 0 ? (
//           products.map((item) => <SpecialCard  key={item.id} />)
//         ) : (
//           <div className="flex w-full gap-4">
//             <Skeleton
//               className="w-full lg:w-[1000px] flex h-full"
//               containerClassName="lg:w-[1024px] lg:min-w-[1000px] lg:h-[200px] flex gap-2 lg:w-[280px] sm:w-[800px] w-[600px] h-[120px] sm:h-[160px]"
//               baseColor="var(--light-background)"
//               highlightColor="var(--light-foreground)"
//               count={3}
//             />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };
