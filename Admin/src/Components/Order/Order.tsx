import { ChevronRight } from "lucide-react";
import { OrderCard } from "../Common/Cards/ OrderCard";

export const RecentOrders = () => {
  return (
    <div className="flex flex-col px-2 py-4 w-full h-full  lg:max-w-[600px]">
      <div className="flex items-center justify-between pb-7">
        <h2 className="text-2xl tracking-wide text-nowrap">Recent Orders</h2>
        <p className="flex items-center justify-center text-[12px] cursor-pointer hover:underline text-[var(--primary-color)] flex-nowrap">
          <span className="text-nowrap">View More</span>
          <ChevronRight size={15} />
        </p>
      </div>
      <div className="max-h-[550px] overflow-y-scroll ">
        <div className="flex flex-col items-center justify-center gap-2 py-2 scroll-smooth ">
          <OrderCard />
          <OrderCard />
          <OrderCard />
          <OrderCard />
          <OrderCard />
          <OrderCard />
        </div>
      </div>
    </div>
  );
};
