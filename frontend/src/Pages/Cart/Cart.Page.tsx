import { useEffect, useState } from "react";
import { Product } from "../../models/product.model";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Cart from "./Cart";
import { RecentProduct } from "../../Components/Card/Card.Recent.Product";
import Skeleton from "react-loading-skeleton";
import { Frown } from "lucide-react";
import { SpecialCards } from "../../Components/Card/Card.Product";
import { getSpecialProducts } from "../../Services/product.services";
import { RootState } from "../../Store";

export const CartPage = () => {
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

  const authUser = useSelector((state: RootState) => state.root.auth.success);

  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-start  gap-10 w-full h-full py-6 px-3 justify-between ">
      <div className="w-full h-full flex lg:flex-row flex-col gap-[7rem] sm:gap-7  bg-[var(--light-foreground)] px-5 py-8 rounded items-center lg:items-start justify-around">
        <div className="lg:w-[600px] w-full p-2 py-4  px-5 rounded">
          <Cart />
        </div>
        <div className="lg:w-[550px] w-full flex h-full flex-col gap-4 pt-3 px-4 border  rounded-lg">
          <h3 className="w-full text-[25px] pl-4  py-2 font-semibold tracking-wide text-[var(--dark-text)]">
            Recent Products
          </h3>
          <div className="w-full h-full overflow-y-auto scrollbar-custom px-5 ">
            <div className="flex  flex-col w-full items-start h-[530px]  gap-5">
              {authUser ? (
                !loading ? (
                  initialData?.map((data) => (
                    <RecentProduct prop={data} key={data.id} />
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
      </div>

      <div className="w-full mx-4 h-full px-3 py-2 rounded-t-lg flex flex-col gap-3 bg-white ">
        <h1 className="text-[23px] pl-5 pt-4 tracking-wider ">
          Popular products
        </h1>
        <div className="w-full flex flex-col gap-3 bg-white px-5 py-4  overflow-auto  rounded items-start justify-center">
          <div className=" overflow-hidden">
            <div className="w-full h-full flex items-center gap-4 justify-start  ">
              {initialData?.length > 0 ? (
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
    </div>
  );
};
