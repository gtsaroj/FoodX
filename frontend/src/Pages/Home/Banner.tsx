import { useEffect, useState } from "react";
import Carousel from "../../Components/Carousel/Carousel";
import { getBanners } from "../../Services/banner.services";
import Skeleton from "react-loading-skeleton";
import { Banner as BannerModal } from "../../models/banner.model";

const Banner: React.FC = () => {
  const [initialData, setInitialData] = useState<BannerModal[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const getBanner = async () => {
    setLoading(true);
    try {
      const response = await getBanners();

      setInitialData(response.data);
    } catch (error) {
      throw new Error("Error while fetching banners" + error);
    }
    setLoading(false);
  };
  useEffect(() => {
    getBanner();
  }, []);

  console.log(initialData);

  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="lg:h-[600px] lg:w-[800px] flex items-center min-w-[300px] w-[400px] h-[300px] sm:w-[600px] sm:h-[350px] md:w-[500px] md:h-[450px] duration-500 xl:w-[1000px] flex-grow">
        {loading ? (
          <div className="w-full rounded-xl  gap-4 flex ">
            <Skeleton
              borderRadius={"13px"}
              width="980px"
              height="545px"
              baseColor="var(--light-background)"
              highlightColor="var(--light-foreground)"
              count={1}
            />
          </div>
        ) : (
          <Carousel props={initialData} />
        )}
      </div>
    </div>
  );
};

export const Sponsor: React.FC = () => {
  return (
    <div className="md:flex hidden items-center justify-center w-full h-full">
      <div className="lg:h-[540px]  h-[300px] w-[300px] sm:h-[350px] md:h-[382px] duration-500  flex-grow">
        <img
          src={
            "https://scontent.fktm17-1.fna.fbcdn.net/v/t39.30808-6/455241091_891604229672861_3450889822564373310_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeH7biGgMeg0Mk9nGglRrphEWCxh4ht_9g1YLGHiG3_2DUA657J3JJ42ixga20HbzZrH_ABDPoFG_XnjBhmHRCFH&_nc_ohc=dWpUA191YpcQ7kNvgHFs1p2&_nc_ht=scontent.fktm17-1.fna&oh=00_AYDHoo9D3Ou-y5R3yoYPNbnupVnycvxUebmJmMFCS2UHNQ&oe=66DF5207"
          }
          className="w-full rounded-xl h-full"
          alt=""
        />
      </div>
    </div>
  );
};

export default Banner;
