import React from "react";

export const RevenueData = [
  {
    title: "Total Order",
    total: 450,
    revenueInOneDay: "50% in 1 day",
  },
  {
    title: "Total Order",
    total: 450,
    revenueInOneDay: "50% in 1 day",
  },
  {
    title: "Total Order",
    total: 450,
    revenueInOneDay: "50% in 1 day",
  },
];

const Revenue: React.FC = () => {
  return (
    <div className="flex items-center justify-evenly  gap-5">
      {RevenueData?.map((item, index) => {
        return (
          <div key={index} className=" flex items-center justify-center gap-2 ">
            <div className="w-[50px] h-[50px] ">
              <img className="w-full h-full rounded-full" src="" alt="" />
            </div>
            <div>
              <div  className=" flex flex-col">
                <p className="tex-[15px] ">{item.title} </p>
                <p className="text-[20px] font-semibold ">{item.total} </p>
                <p className="text-sm ">{item.revenueInOneDay} </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Revenue;
