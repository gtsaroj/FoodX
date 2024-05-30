import { ChevronDown,  Ellipsis, Search } from "lucide-react";
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
    <div className="2xl:container w-full py-2  flex flex-col gap-10 items-start justify-center">
      <h1 className="text-[20px]">Customer</h1>
      <div className="w-full flex sm:flex-row flex-col-reverse items-start sm:items-center justify-between">
          <form action="" className="relative w-full">
            <Search className="absolute top-4 size-5 left-2" />
            <input
              type="search"
              className=" pl-9 placeholder:text-sm outline-none w-full sm:w-[350px] rounded-md py-4 px-8 border-[var(--dark-border)] "
              placeholder="Search for customer"
            />
          </form>
          <button className="flex sm:w-full w-[200px] gap-1 text-[var(--light-text)] bg-[var(--dark-text)] px-5 py-3 rounded-md items-center justify-start sm:justify-center">
              <ChevronDown className="size-4" />
              <span className="text-[14px] ">Add filter</span>
            </button>
      </div>
      <div className="w-full shadow-green-500 rounded-t-md shadow-inner overflow-auto">
        <table className="md:w-full w-[880px] rounded-sm  flex  flex-col justify-center gap-5 items-center">
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
      </table></div>
    </div>
  );
};

export default CustomerList;
