import { useEffect, useState } from "react";
import { Product } from "../../models/product.model";
import Skeleton from "react-loading-skeleton";
import { SpecialCards } from "../../Components/Card/Card.Product";
import { getSpecialProducts } from "../../Services/product.services";

export const PopularProduct = () => {
  const [initialData, setInitialData] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const getProducts = async () => {
    setLoading(true);
    try {
      const response = await getSpecialProducts();
      setInitialData(response.data);
    } catch (error) {
      throw new Error("Error while getting popular products" + error);
    }
    setLoading(false);
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div className="w-full h-full text-[var(--dark-text)] flex flex-col gap-6 px-5   py-3   bg-[var(--light-foreground)]   rounded items-start justify-center ">
      <h1 className="text-[25px] font-semibold  tracking-wider ">
        Popular products
      </h1>
      <div className="w-full flex flex-col gap-3     overflow-auto  rounded items-start justify-center">
        <div className=" overflow-hidden">
          <div className="w-full h-full flex items-center gap-4  justify-start  ">
            {!loading ? (
              initialData?.map((singleObject) => (
                <SpecialCards prop={singleObject} key={singleObject.id} />
              ))
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
        </div>
      </div>
    </div>
  );
};
