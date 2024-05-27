import { ChevronDown } from "lucide-react";
import React from "react";

const FoodTable: React.FC = () => {
  return (
    <table
      border={1}
      className="container flex  flex-col items-center justify-center"
    >
      <thead className="w-full bg-[var(--light-background)] ">
        <tr className=" w-full py-3 grid grid-cols-5 px-6 gap-16 ">
          <th>
            <input type="checkbox" />
          </th>
          <th>title</th>
          <th>Img</th>
          <th>Categories</th>
          <th className="flex items-center justify-center gap-1">Status <ChevronDown className="size-5"/></th>
        </tr>
      </thead>
      <tbody className="w-full flex flex-col py-4 items-center justify-center gap-4 border-t-[1px] ">
        <tr className="w-full border-b-[1px] border-[#3e3b4554] py-4 grid items-center grid-cols-5 px-6 gap-16">
          <td className="text-center">
            <input type="checkbox" />
          </td>
          <td className="text-[15px] text-center ">MoMo</td>
          <td className=" flex items-center justify-center ">
            {" "}
            <img
              className="w-[50px] h-[30px] rounded-md "
              src="https://t3.ftcdn.net/jpg/06/16/85/60/360_F_616856040_zCvPMQkPFOWsVb3Hxo7mQUYzlzciFCZs.jpg"
            ></img>
          </td>
          <td className="text-[15px]  text-center">MoMo</td>
          <td className="text-[15px] flex items-center justify-center border-[1px] rounded-md font-semibold text-[#32a852] py-4 px-2 shadow-inner bg-[#8a84957e] ">
            Published
          </td>
        </tr>
        <tr className="w-full border-b-[1px] border-[#3e3b4554] py-4 grid items-center grid-cols-5 px-6 gap-16">
          <td className="text-center">
            <input type="checkbox" />
          </td>
          <td className="text-[15px] text-center ">MoMo</td>
          <td className=" flex items-center justify-center ">
            {" "}
            <img
              className="w-[50px] h-[30px] rounded-md "
              src="https://t3.ftcdn.net/jpg/06/16/85/60/360_F_616856040_zCvPMQkPFOWsVb3Hxo7mQUYzlzciFCZs.jpg"
            ></img>
          </td>
          <td className="text-[15px] text-center ">MoMo</td>
          <td className="text-[15px] border-[1px] rounded-md font-semibold text-[#32a852] py-4 px-2 bg-[#8a84957e] shadow-inner ">
            Published
          </td>
        </tr>
        <tr className="w-full border-b-[1px] border-[#3e3b4554] py-4 grid items-center grid-cols-5 px-6 gap-16">
          <td className="text-center">
            <input type="checkbox" />
          </td>
          <td className="text-[15px] text-center ">MoMo</td>
          <td className=" flex items-center justify-center ">
            {" "}
            <img
              className="w-[50px] h-[30px] rounded-md "
              src="https://t3.ftcdn.net/jpg/06/16/85/60/360_F_616856040_zCvPMQkPFOWsVb3Hxo7mQUYzlzciFCZs.jpg"
            ></img>
          </td>
          <td className="text-[15px] text-center ">MoMo</td>
          <td className="text-[15px] text-center border-[1px] rounded-md font-semibold text-[#3283a8] py-4 px-2 bg-[#8a84957e] shadow-inner ">
            Draft
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default FoodTable;
