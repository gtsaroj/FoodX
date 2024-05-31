import {
  ArrowDownWideNarrow,
  ChevronDown,
  Download,
  Search,
} from "lucide-react";
import { useState } from "react";

export const orderData = [
  {
    orderID: "#4321",
    customer: "Saroj GT",
    product: "Samosa, Momo",
    date: "2081/01/20",
    status: "Received",
  },
  {
    orderID: "#4321",
    customer: "Saroj GT",
    product: "Samosa, Momo",
    date: "2081/01/20",
    status: "Preparing",
  },
  {
    orderID: "#4321",
    customer: "Rajan Chaudhary",
    product: "Samosa, Momo",
    date: "2081/01/20",
    status: "Completed",
  },
  {
    orderID: "#4321",
    customer: "Sandesh Paudel",
    product: "Samosa, Momo",
    date: "2081/01/20",
    status: "Canceled",
  },
];

const OrderList = () => {
  const [changeStatus, setChangeStatus] = useState<boolean>(false);
  const [currentIndex, setIndex] = useState<number>();
  return (
    <div className="w-full sm:px-5  py-2 flex flex-col items-start justify-center gap-8">
      <h1 className="text-[20px] font-semibold">Order</h1>
      <div className="w-full py-6 flex rounded-sm  flex-col gap-5 items-start justify-center px-4">
        <div className="border-b-[4px] w-full hidden sm:flex items-center justify-between  py-4 border-[#8a8495be]">
          <ul className="relative text-[var(--dark-text)] text-[16px]  flex items-center justify-start gap-8">
            <li className="group/orderstatus  cursor-pointer">
              All Order
              <div className="w-[50px] invisible bottom-[-20px] translate-x-[-20px] group-hover/orderstatus:translate-x-0 duration-200 opacity-0 group-hover/orderstatus:opacity-100  absolute group-hover/orderstatus:visible bg-[var(--primary-color)] h-[4px]"></div>
            </li>
            <li className="group/orderstatus cursor-pointer">
              Recieved
              <div className="w-[50px] invisible bottom-[-20px] translate-x-[-20px] group-hover/orderstatus:translate-x-0 duration-200 opacity-0 group-hover/orderstatus:opacity-100  absolute group-hover/orderstatus:visible bg-[var(--primary-color)] h-[4px]"></div>
            </li>
            <li className="group/orderstatus cursor-pointer">
              Preparing
              <div className="w-[50px] invisible bottom-[-20px] translate-x-[-20px] group-hover/orderstatus:translate-x-0 duration-200 opacity-0 group-hover/orderstatus:opacity-100  absolute group-hover/orderstatus:visible bg-[var(--primary-color)] h-[4px]"></div>
            </li>
            <li className="group/orderstatus cursor-pointer">
              Completed
              <div className="w-[50px] invisible bottom-[-20px] translate-x-[-20px] group-hover/orderstatus:translate-x-0 duration-200 opacity-0 group-hover/orderstatus:opacity-100  absolute group-hover/orderstatus:visible bg-[var(--primary-color)] h-[4px]"></div>
            </li>
            <li className="group/orderstatus cursor-pointer">
              Cancel
              <div className="w-[50px] invisible bottom-[-20px] translate-x-[-20px] group-hover/orderstatus:translate-x-0 duration-200 opacity-0 group-hover/orderstatus:opacity-100  absolute group-hover/orderstatus:visible bg-[var(--primary-color)] h-[4px]"></div>
            </li>
          </ul>
          <h2 className="md:flex hidden text-[var(--dark-text)] text-[13px] ">
            Showing 8-10 of 84 results
          </h2>
        </div>
        <div className="flex sm:flex-row flex-col-reverse items-start gap-5 sm:gap-2 sm:items-center justify-between  w-full">
          <form action="" className="relative w-full">
            <Search className="absolute top-4 size-5 left-2" />
            <input
              type="search"
              className=" pl-9 placeholder:text-sm outline-none w-full sm:w-[350px] rounded-md py-4 px-8 border-[var(--dark-border)] "
              placeholder="Search for orderID, customer, orderstatus or something"
            />
          </form>
          <div className="flex items-center justify-center gap-4">
            <button className="flex gap-1 text-[var(--light-text)] bg-[var(--dark-text)] px-5 py-3 rounded-md items-center justify-center">
              <ArrowDownWideNarrow className="size-4" />
              <span className="text-[14px] ">Filter</span>
            </button>
            <button className="flex gap-1 text-[var(--light-text)] bg-[var(--dark-text)] px-5 py-3 rounded-md items-center justify-center">
              <Download className="size-4" />
              <span className="text-[14px] ">Export</span>
            </button>
          </div>
        </div>
        <div className="w-full shadow-lime-300 rounded-t-md  shadow-inner overflow-auto">
        <table className="sm:w-full w-[888px] flex flex-col items-start justify-center">
          <tr className="w-full grid grid-cols-10 gap-2  bg-[var(--light-background)] py-3 rounded-t-md justify-between">
            <th className=" col-span-2 flex text-[12px] sm:text-[15px] gap-1 items-center justify-center ">
              ORDERID <ChevronDown className="size-4" />
            </th>
            <th className=" col-span-2 flex text-[12px] sm:text-[15px]  gap-1 items-center justify-center">
              CUSTOMER <ChevronDown className="size-4" />
            </th>
            <th className=" col-span-2 flex text-[12px] sm:text-[15px] gap-1 items-center justify-center ">
              PRODUCT <ChevronDown className="size-4" />
            </th>
            <th className=" col-span-2 flex text-[12px] sm:text-[15px] gap-1 items-center justify-center ">
              DATE <ChevronDown className="size-4" />
            </th>
            <th className=" col-span-2 flex text-[12px] sm:items-center justify-center gap-1 sm:text-[15px] ">
              STATUS <ChevronDown className="size-4" />
            </th>
          </tr>
          <tbody className="py-3  w-full flex flex-col items-start justify-center gap-4">
            {orderData.map((data, index) => (
              <tr
                key={index}
                className="w-full border-[#3e3b4554] items-center justify-center border-b-[1px] py-4 text-[14px] grid grid-cols-5 gap-10 "
              >
                <td className="text-center">{data.orderID}</td>
                <td className=" text-center">{data.customer}</td>
                <td className=" text-center">{data.product}</td>
                <td className=" text-center">{data.date}</td>
                <td
                  onClick={() => {
                    setChangeStatus(!changeStatus);
                    setIndex(index);
                  }}
                  className={`relative flex items-center justify-center gap-1 text-center rounded-md py-3 font-semibold text-[var(--light-text)] 
    ${
      data.status.includes("Received")
        ? "bg-[#5df764] hover:bg-[#49b94f] duration-150"
        : data.status.includes("Preparing")
        ? "bg-[#f1cd55] hover:bg-[#ceae47]  duration-150"
        : data.status.includes("Completed")
        ? "bg-[#3b76ff] hover:bg-[#3862c4] duration-150 "
        : data.status.includes("Canceled")
        ? "bg-[#ff5a5a] hover:bg-[#b64141] duration-150 "
        : "bg-white"
    }`}
                >
                  {data.status}
                  <ChevronDown className="size-5 " />
                  <div
                    className={`opacity-0 z-10 duration-200 top-0 w-[150px] flex absolute gap-1 flex-col items-center justify-center rounded-sm bg-[#8a849549] ${
                      changeStatus
                        ? index === currentIndex
                          ? "opacity-100 "
                          : ""
                        : " z-0 top-[-40px]"
                    } `}
                  >
                    <button className="text-[15px] w-full  font-semibold py-1 px-2 rounded-sm bg-[#5df764] hover:bg-[#49b94f]">
                      Received
                    </button>
                    <button className="text-[15px]  w-full font-semibold py-1 px-2 rounded-sm bg-[#f1cd55] hover:bg-[#ceae47] ">
                      Preparing
                    </button>
                    <button className="text-[15px] w-full  font-semibold py-1 px-2 rounded-sm bg-[#3b76ff] hover:bg-[#3862c4] ">
                      Completed
                    </button>
                    <button className="text-[15px] w-full  font-semibold py-1 px-2 rounded-sm bg-[#ff5a5a] hover:bg-[#b64141] ">
                      Canceled
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
    </div>
  );
};

export default OrderList;
