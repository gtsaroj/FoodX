import React from "react";

const FoodTable: React.FC = () => {
  return (
    <table
      border={1}
      className="container flex bg-[#8a849559] flex-col items-center justify-center"
    >
      <thead className="w-full">
        <tr className=" w-full py-3 flex items-center justify-between px-6 gap-16 ">
          <th>
            <input type="checkbox" />
          </th>
          <th>title</th>
          <th>Img</th>
          <th>Categories</th>
          <th></th>
        </tr>
      </thead>
      <tbody className="w-full border-t-[1px] ">
        <tr className="w-full flex items-center py-3 justify-between px-6 gap-16">
          <td>
            <input type="checkbox" />
          </td>
          <td className="text-[15px] ">MoMo</td>
          <td className="aspect-[2/1] w-[50px] ">
            {" "}
            <img
              className="w-full h-full rounded-md "
              src="https://t3.ftcdn.net/jpg/06/16/85/60/360_F_616856040_zCvPMQkPFOWsVb3Hxo7mQUYzlzciFCZs.jpg"
            ></img>{" "}
          </td>
          <td className="text-[15px] ">MoMo</td>
          <td className="text-[15px] border-[1px] rounded-md font-semibold text-[#32a852] py-1 px-2 bg-[#8a84957e] shadow-inner ">
            Published
          </td>
        </tr>
        <tr className="w-full flex items-center py-3 justify-between px-6 gap-16">
          <td>
            <input type="checkbox" />
          </td>
          <td className="text-[15px] ">MoMo</td>
          <td className="aspect-[2/1] w-[50px] ">
            {" "}
            <img
              className="w-full h-full rounded-md "
              src="https://t3.ftcdn.net/jpg/06/16/85/60/360_F_616856040_zCvPMQkPFOWsVb3Hxo7mQUYzlzciFCZs.jpg"
            ></img>{" "}
          </td>
          <td className="text-[15px] ">MoMo</td>
          <td className="text-[15px] w-[90px] border-[1px] rounded-md font-semibold text-[#32a852] py-1 px-2 bg-[#8a84957e] shadow-inner ">
            Published
          </td>
        </tr>
        <tr className="w-full flex items-center py-3 justify-between px-6 gap-16">
          <td>
            <input type="checkbox" />
          </td>
          <td className="text-[15px] ">MoMo</td>
          <td className="aspect-[2/1] w-[50px] ">
            {" "}
            <img
              className="w-full h-full rounded-md "
              src="https://t3.ftcdn.net/jpg/06/16/85/60/360_F_616856040_zCvPMQkPFOWsVb3Hxo7mQUYzlzciFCZs.jpg"
            ></img>{" "}
          </td>
          <td className="text-[15px] ">MoMo</td>
          <td className="text-[15px] w-[90px] text-center border-[1px] rounded-md font-semibold text-[#3283a8] py-1 px-2 bg-[#8a84957e] shadow-inner ">
            Draft
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default FoodTable;
