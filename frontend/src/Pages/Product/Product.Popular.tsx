import { useEffect, useRef, useState } from "react";
import { Product } from "../../models/product.model";
import Skeleton from "react-loading-skeleton";
import { SpecialCards } from "../../Components/Card/Card.Product";
import { getPopularProducts } from "../../Services/product.services";
import { useNavigate } from "react-router-dom";
import Empty from "../../assets/empty.png";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const PopularProduct = () => {
  const [initialData, setInitialData] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const getProducts = async () => {
    setLoading(true);
    try {
      const response = await getPopularProducts();
      setInitialData(response.data);
    } catch (error) {
      throw new Error("Error while getting popular products" + error);
    }
    setLoading(false);
  };

  useEffect(() => {
    getProducts();
  }, []);

  const cardReference = useRef<HTMLDivElement | null>(null);

  return (
    <div className="w-full h-full text-[var(--dark-text)] relative group/popular flex flex-col gap-6 p-8   bg-[var(--light-foreground)]   rounded items-start justify-center ">
      <h1 className="sm:text-[25px] text-[20px] font-semibold  tracking-wider ">
        Popular products
      </h1>
      <div
        ref={cardReference}
        className="w-full  flex flex-col  gap-3  item-scrollbar pb-5 bg    rounded items-start justify-center"
      >
        <div className="  bg overflow-hidden  ">
          <div className="w-full h-full    flex items-center gap-4  justify-center  ">
            {!loading ? (
              initialData?.length > 0 ? (
                initialData?.map((singleObject) => (
                  <SpecialCards prop={singleObject} key={singleObject.id} />
                ))
              ) : (
                <div className="w-full h-full md:pl-48 xl:pl-80 pl-0 flex flex-col items-center justify-center text-center p-4">
                  <img
                    src={Empty}
                    alt="No orders found"
                    className="size-40 mb-4"
                  />
                  <h4 className="text-xl text-[var(--dark-secondary-text)] mb-2">
                    No popular products found
                  </h4>
                  <p className="text-sm text-[var(--dark-secondary-text)] mb-4">
                    It seems there are no popular products at the moment. Check
                    back soon or explore our categories for more options!
                  </p>
                  <button
                    onClick={() => navigate("/#categories")}
                    className="mt-4 bg-[var(--primary-light)] text-white py-2 duration-150 px-4 rounded hover:bg-[var(--primary-dark)]"
                  >
                    Browse other products
                  </button>
                </div>
              )
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
          {
            initialData?.length > 0  &&          <div className="w-full -translate-x-8 invisible group-hover/popular:visible opacity-0 group-hover/popular:opacity-100 duration-200 absolute z-50 top-48 px-1 flex justify-between">
            <button
              onClick={() => {
                cardReference.current?.scrollBy({
                  behavior: "smooth",
                  left: -300,
                });
              }}
              className=" bg-[#99969680] p-2.5 hover:bg-[#94909080] duration-150 text-[var(--dark-text)] rounded-full "
            >
              <ChevronLeft className="sm:size-6 size-5 " />
            </button>
            <button
              onClick={() => {
                cardReference.current?.scrollBy({
                  behavior: "smooth",
                  left: 300,
                });
              }}
              className=" bg-[#99969680] p-2.5 hover:bg-[#94909080] duration-150  text-[var(--dark-text)] rounded-full "
            >
              <ChevronRight className="sm:size-6 size-5 " />
            </button>
          </div>
  }
        </div>
      </div>
    </div>
  );
};
