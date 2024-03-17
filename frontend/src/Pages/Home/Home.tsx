import  { Toaster } from "react-hot-toast";
import Banner from "./Banner";
import Category from "./Category";
import Specials from "./Specials";
const Home = () => {
  return (
    <div className="flex items-center justify-center w-full h-full px-3 py-6 ">
      <div className="w-full max-w-[1500px] h-full flex flex-col gap-5 flex-grow">
        <div className="flex-grow">
          <Banner />
        </div>
        <div>
          <Specials />
        </div>
        <div>
          <Category />
        </div>
      </div>
      <Toaster/>
    </div>
  );
};

export default Home;
