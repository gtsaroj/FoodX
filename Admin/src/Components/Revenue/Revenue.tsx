import React from "react";
import order from "../../assets/order.png";
import orderCancel from "../../assets/ordercancel.png";
import orderRecieved from "../../assets/orderrecieved.png";
import RevenueImg from "../../assets/revenue.png";

export const RevenueData = [
  {
    img: order,
    title: "Order",
    total: 1245,
    revenueInOneDay: "50% in 1 day",
  },
  {
    img: orderCancel,
    title: "Cancelled",
    total: 80,
    revenueInOneDay: "3% in 1 day",
  },
  {
    img: orderRecieved,
    title: "Delivered",
    total: 1165,
    revenueInOneDay: "47% in 1 day",
  },
  {
    img: RevenueImg,
    title: "Revenue",
    total: 58000,
    revenueInOneDay: "Rs. 80,000 in 1 day",
  },
];

const Revenue: React.FC = () => {
  return (
    <React.Fragment>
      <div className="flex w-full items-center flex-wrap  justify-center sm:justify-start gap-3 sm:gap-10">
        {RevenueData?.map((item, index) => {
          return (
            <div
              key={index}
              className=" flex flex-col sm:w-[200px] w-full sm:h-full h-[150px] items-start justify-center gap-2 bg-[var(--light-background)] px-5 py-2 rounded-md shadow-sm "
            >
              <p className="text-[15px] text-[var(--dark-text)] ">
                {item.title}{" "}
              </p>
              <p className="text-[25px] text-[var(--dark-foreground)]  font-semibold ">
                {item.total}{" "}
              </p>
              <p className="text-[11px] text-[var(--dark-secondary-text)] ">
                {item.revenueInOneDay}{" "}
              </p>
            </div>
          );
        })}
      </div>
    </React.Fragment>
  );
};

export default Revenue;
