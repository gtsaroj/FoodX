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
      const response = await getBanners("banners");
      setInitialData(response.data.banners);
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
            "https://scontent.fktm17-1.fna.fbcdn.net/v/t39.30808-6/457438715_904198338413450_2795824119028535313_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=833d8c&_nc_ohc=iSmoNyk59TIQ7kNvgGk2IIf&_nc_ht=scontent.fktm17-1.fna&oh=00_AYCS92pmjytDovvbjVgii_2LEgA0l-j-izFIiJNAV1cEcw&oe=66E5EB18"
          }
          className="w-full rounded-xl h-full"
          alt="Hello"
        />
      </div>
    </div>
  );
};

export default Banner;
