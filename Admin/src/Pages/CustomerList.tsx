import { ChevronDown, Eclipse, Ellipsis, Search } from "lucide-react";
import React, { useRef } from "react";

const dummyData = [
  {
    customer: "Saroj GT",
    email: "sarojgt326@gmail.com",
    Location: "Bardiya",
    orders: "45",
    AmountSpent: "$ 150",
  },
  {
    customer: "Kiran Kumar",
    email: "kirankumar@gmail.com",
    Location: "Banke",
    orders: "15",
    AmountSpent: "$ 250",
  },
  {
    customer: "Hari Bangsal",
    email: "Hari@gmail.com",
    Location: "Hetauda",
    orders: "25",
    AmountSpent: "$ 990",
  },
];

const CustomerList: React.FC = () => {
  const searchFormRef = useRef<HTMLButtonElement>(null);
  return (
    <div className="container py-2 px-7 flex flex-col gap-10 items-start justify-center">
      <h1 className="text-[20px]">Customer</h1>
      <div className="w-full flex items-center justify-between">
        <form action="w-full">
          <div className="flex relative items-center justify-center">
            <Search
              className="text-[var(--dark-text)] absolute size-5 left-2 top-2 cursor-pointer"
              onClick={() => searchFormRef?.current?.click()}
            />
            <input
              type="text"
              placeholder="Search Customer"
              className="placeholder:text-end placeholder:pr-8 placeholder:text-[16px] pl-9  w-[250px] py-1.5 px-2 rounded-md border-[1px] outline-none border-[var(--dark-border)] "
            />
          </div>
          <button ref={searchFormRef}></button>
        </form>
        <button className="flex items-center justify-center gap-1 bg-[#8a84956e] rounded-md py-1.5 px-5 shadow-inner shadow-[1]">
          <h1 className="text-[15px] text-[var(--dark-text)]">Add Filter</h1>
          <ChevronDown className="size-4" />
        </button>
      </div>
      <table className="w-full py-1.5 rounded-sm px-2  flex  flex-col justify-center gap-5 items-center">
        <thead className="w-full bg-[var(--light-background)] py-4 rounded-t-md ">
          <tr className="w-full  text-[15px] grid grid-cols-9 gap-5">
            <th className="">
              <input className="cursor-pointer" type="checkbox" />
            </th>
            <th>Customer</th>
            <th className="col-span-2">Email</th>
            <th>Location</th>
            <th>Orders</th>
            <th className="col-span-2">Amount Spent</th>
            <th></th>
          </tr>
        </thead>
        <tbody className="w-full flex flex-col items-center justify-center gap-5">
          {dummyData?.map((data, index) => (
            <tr key={index} className="w-full border-b-[1px] py-4 grid grid-cols-9 gap-5">
              <td className="text-sm text-center">
                <input type="checkbox" />
              </td>
              <td className="text-sm text-center">{data.customer}</td>
              <td className=" text-center  text-sm col-span-2">{data.email}</td>
              <td className=" text-sm text-center">{data.Location}</td>
              <td className="text-sm text-center">{data.orders}</td>
              <td className="text-sm col-span-2 text-center">
                {data.AmountSpent}
              </td>
              <td className="pl-9">
                <Ellipsis />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerList;
