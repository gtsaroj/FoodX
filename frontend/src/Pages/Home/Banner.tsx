import Carousel from "../../Components/Carousel/Carousel";

const slides: SlideProp[] = [
  {
    url: "https://i.pinimg.com/564x/d2/3d/27/d23d2716820f2677e2821f6c7d9a5f0c.jpg",
  },
  {
    url: "https://i.pinimg.com/564x/d7/0f/79/d70f799bd5e21dfa6e4221d65a32d879.jpg",
  },
  {
    url: "https://i.pinimg.com/564x/1d/e9/d5/1de9d598830dc618cad0b1b6e3392a4e.jpg",
  },
  {
    url: "https://i.pinimg.com/564x/fb/7e/e2/fb7ee207a563136bd0610376c5572a3e.jpg",
  },
];

const Banner: React.FC = () => {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="lg:h-[600px] lg:w-[800px] min-w-[300px] w-[400px] h-[300px] sm:w-[600px] sm:h-[350px] md:w-[500px] md:h-[450px] duration-500 xl:w-[1000px] flex-grow">
        <Carousel slides={slides} />
      </div>
    </div>
  );
};

export const Sponsor: React.FC = () => {
  return (
    <div className="md:flex hidden items-center justify-center w-full h-full">
      <div className="lg:h-[540px]  h-[300px] w-[300px] sm:h-[350px] md:h-[382px] duration-500  flex-grow">
      <img src={slides[0].url} className="w-full rounded-xl h-full" alt="" />
    </div>
     </div>
  );
};

export default Banner;
