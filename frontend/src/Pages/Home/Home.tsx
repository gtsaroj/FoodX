import  { Toaster } from "react-hot-toast";
import Banner, { Sponsor } from "./Banner";
import Category from "./Category";
import Specials from "./Specials";
import PrivateRoute from "../../PrivateRoute";
const Home = () => {
  console.log(PrivateRoute({userRole: ["customers"]}))
  return (
    <div className="flex items-center justify-center w-full h-full px-3 py-6 ">
      <div className="w-full max-w-[1500px] h-full flex flex-col gap-5 flex-grow">
        <div className=" flex items-center md:flex-row flex-col  gap-2 justify-center">
          <Banner />
          <Sponsor/>
        </div>
        <div>
          <Specials />
        </div>
        <div className="w-full flex items-center justify-center">
          <Category />
        </div>
      </div>
      <Toaster/>
    </div>
  );
};

export default Home;
