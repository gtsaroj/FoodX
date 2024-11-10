import Carousel from "../../Components/Carousel/Carousel";
import { getBanners } from "../../Services/banner.services";
import Skeleton from "react-loading-skeleton";
import { Banner as BannerModal } from "../../models/banner.model";
import { useQuery } from "react-query";

const Banner: React.FC = () => {
  const getBanner = async (): Promise<BannerModal[]> => {
    try {
      const response = await getBanners("banners");
      return response.data.banners;
    } catch (error) {
      throw new Error("Error while fetching banners" + error);
    }
  };

  const { data, isLoading } = useQuery("banner", getBanner, {
    staleTime: 1 * 60 * 1000,
  });

  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="lg:h-[600px] lg:min-w-[700px] flex items-center min-w-[300px] w-[400px] h-[300px] sm:w-[600px] sm:h-[350px] md:w-[500px] md:h-[450px] duration-500 xl:w-[1000px] flex-grow">
        {isLoading ? (
          <div className="flex w-full h-full items-center justify-center gap-4 rounded-xl ">
            <Skeleton
              borderRadius={"13px"}
              className="w-full h-full"
              containerClassName="w-[900px] h-[300px] h-[220px] md:h-[400px] lg:h-[600px] "

              baseColor="var(--light-background)"
              highlightColor="var(--light-foreground)"
              count={1}
            />
          </div>
        ) : (
          data &&
          data.length > 0 && (
            <Carousel props={data as BannerModal[]} time={5000} />
          )
        )}
      </div>
    </div>
  );
};

export const Sponsor: React.FC = () => {
  const getBanner = async (): Promise<BannerModal[]> => {
    try {
      const response = await getBanners("sponsors");
      return response.data.banners;
    } catch (error) {
      throw new Error("Error while fetching banners" + error);
    }
  };

  const { data, isLoading } = useQuery("sponsor", getBanner, {
    staleTime: 60 * 1000,
  });

  return (
    <div className="items-center justify-center hidden w-full h-full lg:flex">
      <div className="lg:h-[602px]  h-[300px] max-w-md sm:h-[350px] md:h-[382px] duration-500  flex-grow">
        {isLoading ? (
          <div className="lg:flex hidden w-full gap-4 rounded-xl ">
            <Skeleton
              borderRadius={"13px"}
              className="w-full h-full"
              containerClassName="w-[400px] h-[600px] "
              baseColor="var(--light-background)"
              highlightColor="var(--light-foreground)"
              count={1}
            />
          </div>
        ) : (
          data &&
          data.length > 0 && (
            <div className="w-full h-full">
              <Carousel
                actions={false}
                props={data as BannerModal[]}
                time={25000}
              />
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Banner;
