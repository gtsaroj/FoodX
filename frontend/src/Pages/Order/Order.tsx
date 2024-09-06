import { OrderHistory } from "./Order.History";
import { PopularProduct } from "../Product/Product.Popular";
import { RecentOrder } from "./Order.Recent";

const Order = () => {
  return (
    <div className="flex  flex-col items-start gap-10 py-5 justify-center w-full h-full ">
      <div className="flex items-center w-full  gap-5 overflow-x-auto ">
        <RecentOrder />
      </div>

      <OrderHistory />


          <div className="w-full h-full flex items-center gap-4 justify-start  ">
            <PopularProduct />
          </div>
        
      
    </div>
  );
};

export default Order;
