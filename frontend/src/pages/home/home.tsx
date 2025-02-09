import { MenuType } from "../../components/category/category";
import FeedbackForm from "../../components/feedback/feedback";
import { OrderNotification } from "../../features";
import { PopularProduct } from "../../components";
import { Banner, Sponsor, Specials } from "../home";


export const Home = () => {
  return (
    <div className="flex items-center justify-center w-full h-full px-3 py-6 ">
      <div className="w-full max-w-[1500px] h-full flex flex-col gap-20 flex-grow">
        <div className="">
          <OrderNotification />
          <div className="flex flex-col items-center justify-center gap-5 px-3 md:flex-row">
            <Banner />
            <Sponsor />
          </div>
        </div>
        <div>
          <Specials />
        </div>
        <PopularProduct />
        <div
          id="categories"
          className="flex items-center justify-center w-full"
        >
          <MenuType />
        </div>
        <FeedbackForm />
      </div>
    </div>
  );
};
