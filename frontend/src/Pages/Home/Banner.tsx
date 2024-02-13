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
      <Carousel slides={slides} />
    </div>
  );
};

export default Banner;
