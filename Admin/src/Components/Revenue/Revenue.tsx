import React from "react";
import order from "../../assets/order.png";
import orderCancel from "../../assets/ordercancel.png";
import orderRecieved from "../../assets/orderrecieved.png";
import RevenueImg from "../../assets/revenue.png";

export const RevenueData = [
  {
    img: order,
    title: "Total Order",
    total: 450,
    revenueInOneDay: "50% in 1 day",
  },
  {
    img: orderCancel,
    title: "Total Cancelled",
    total: 450,
    revenueInOneDay: "3% in 1 day",
  },
  {
    img: orderRecieved,
    title: "Total Delivered",
    total: 450,
    revenueInOneDay: "47% in 1 day",
  },
  {
    img: RevenueImg,
    title: "Total Revenue",
    total: 450,
    revenueInOneDay: "Rs. 80,000 in 1 day",
  },
];

const Revenue: React.FC = () => {
  return (
    <React.Fragment>
      <div className="flex items-center container justify-center pt-5  gap-10">
        {RevenueData?.map((item, index) => {
          return (
            <div
              key={index}
              className=" flex items-center justify-center gap-4 bg-[#8a849577] px-5 py-2 rounded-md shadow-sm "
            >
              <div className="w-[50px] overflow-hidden object-cover h-[50px] ">
                <img
                  className="w-full h-full scale-[1.9] rounded-full"
                  src={item.img}
                  alt=""
                />
              </div>
              <div>
                <div className=" flex flex-col">
                  <p className="text-[15px] text-[var(--dark-foreground)] ">
                    {item.title}{" "}
                  </p>
                  <p className="text-[17px] text-[var(--dark-foreground)]  font-semibold ">
                    {item.total}{" "}
                  </p>
                  <p className="text-[12px] font-semibold text-[var(--dark-foreground)] ">
                    {item.revenueInOneDay}{" "}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </React.Fragment>
  );
};

export default Revenue;
