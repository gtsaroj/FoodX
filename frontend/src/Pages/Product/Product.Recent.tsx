import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { Product } from "../../models/product.model";
import { getSpecialProducts } from "../../Services/product.services";
import { useSelector } from "react-redux";
import { RootState } from "../../Store";
import { Frown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { RecentProductCard } from "../../Components/Card/Card.Recent.Product";

export const RecentProduct = () => {
  const [initialData, setInitialData] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const authUser = useSelector((state: RootState) => state.root.auth.success);

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

  const navigate = useNavigate();

  return (
    <div className="lg:w-[550px] text-[var(--dark-text)] w-full flex h-full flex-col gap-4 pt-3 px-4 border border-[var(--dark-border)]  rounded-lg">
      <h3 className="w-full text-[25px] pl-4  py-2 font-semibold tracking-wide text-[var(--dark-text)]">
        Recent Products
      </h3>
      <div className="w-full h-full overflow-y-auto scrollbar-custom px-5 ">
        <div className="flex  flex-col w-full items-start h-[530px]  gap-5">
          {authUser ? (
            !loading ? (
             initialData &&   initialData?.map((data) => (
                <RecentProductCard prop={data} key={data.id} />
              ))
            ) : (
              <div className="w-full ">
                <Skeleton
                  height={90}
                  baseColor="var(--light-background)"
                  highlightColor="var(--light-foreground)"
                  count={5}
                />
              </div>
            )
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-center p-4">
              <Frown className="size-32 text-[var(--dark-secondary-text)] " />
              <p className="text-lg text-[var(--dark-secondary-text)] mb-4">
                You are not logged in!
              </p>
              <button
                onClick={() => navigate("/login")}
                className="bg-[var(--primary-light)] text-white py-2 px-4 rounded hover:bg-[var(--primary-color)] "
              >
                Log in to see your products
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
