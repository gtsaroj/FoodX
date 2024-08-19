import Banner, { Sponsor } from "./Banner";
import Specials from "./Specials";
import PrivateRoute from "../../PrivateRoute";
import { MenuType } from "../../Components/Category/MenuType";
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
          <MenuType />
        </div>
      </div>
    </div>
  );
};

export default Home;
