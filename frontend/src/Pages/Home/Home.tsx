import Banner, { Sponsor } from "./Banner";
import Specials from "./Specials";
import { MenuType } from "../../Components/Category/MenuType";
import OrderNotification from "../Order/Order.Notification";
const Home = () => {
  return (
    <div className="flex items-center justify-center w-full h-full px-3 py-6 ">
      <div className="w-full max-w-[1500px] h-full flex flex-col gap-5 flex-grow">
        <div className="">
          <OrderNotification />
          <div className=" flex items-center md:flex-row flex-col  gap-2 justify-center">
            <Banner />
            <Sponsor />
          </div>
        </div>
        <div>
          <Specials />
        </div>
        <div
          id="categories"
          className="w-full flex items-center justify-center"
        >
          <MenuType />
        </div>
      </div>
    </div>
  );
};

export default Home;
