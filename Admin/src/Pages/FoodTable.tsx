import { ChevronDown } from "lucide-react";
import React from "react";

const foodData = [
  {
    title: "Fry Momo",
    img: "https://t3.ftcdn.net/jpg/06/16/85/60/360_F_616856040_zCvPMQkPFOWsVb3Hxo7mQUYzlzciFCZs.jpg",
    category: "Momo",
    status: "Published",
  },
  {
    title: "Fry Momo",
    img: "https://t3.ftcdn.net/jpg/06/16/85/60/360_F_616856040_zCvPMQkPFOWsVb3Hxo7mQUYzlzciFCZs.jpg",
    category: "Momo",
    status: "Published",
  },
  {
    title: "Fry Momo",
    img: "https://t3.ftcdn.net/jpg/06/16/85/60/360_F_616856040_zCvPMQkPFOWsVb3Hxo7mQUYzlzciFCZs.jpg",
    category: "Momo",
    status: "Published",
  },
  {
    title: "Fry Momo",
    img: "https://t3.ftcdn.net/jpg/06/16/85/60/360_F_616856040_zCvPMQkPFOWsVb3Hxo7mQUYzlzciFCZs.jpg",
    category: "Momo",
    status: "Published",
  },
  {
    title: "Fry Momo",
    img: "https://t3.ftcdn.net/jpg/06/16/85/60/360_F_616856040_zCvPMQkPFOWsVb3Hxo7mQUYzlzciFCZs.jpg",
    category: "Momo",
    status: "Published",
  },
];

const FoodTable: React.FC = () => {
  return (
    <table
      border={1}
      className="w-full flex  flex-col items-center justify-center"
    >
      <thead className="w-full bg-[var(--light-background)] ">
        <tr className=" items-center justify-center w-full py-3 grid grid-cols-6 sm:px-6 px-3 gap-1 sm:gap-16 ">
          <th className="col-span-1">
            <input type="checkbox" />
          </th>
          <th className=" col-span-1 sm:text-[17px] text-[14px]">title</th>
          <th className=" col-span-1 sm:text-[17px] text-[14px]">Img</th>
          <th className=" col-span-1 sm:text-[17px] text-[14px]">Categories</th>
          <th className=" col-span-2  text-end  sm:text-[17px] text-[14px] gap-1">
            Status
          </th>
        </tr>
      </thead>
      <tbody className="w-full flex flex-col py-4 items-center justify-center gap-4 border-t-[1px] ">
        {foodData?.map((item, index) => (
          <tr
            key={index}
            className="w-full border-b-[1px] border-[#3e3b4554] py-4 grid items-center grid-cols-6  justify-center sm:px-6 px-3 gap-1 sm:gap-16"
          >
            <td className="text-center">
              <input type="checkbox" />
            </td>
            <td className=" col-span-1 text-[15px] text-center ">{item.title}</td>
            <td className=" col-span-1  ">
              {" "}
              <img
                className="w-[50px] h-[30px] rounded-md "
                src={item.img}
              ></img>
            </td>
            <td className=" col-span-1 text-[15px]  text-center">{item.category}</td>
            <td className="sm:text-[15px] text-[13px] text-center  col-span-2  border-[1px] rounded-md font-semibold text-[#32a852] py-2 sm:py-4 px-2 shadow-inner bg-[#8a84957e] ">
              {item.status}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default FoodTable;
