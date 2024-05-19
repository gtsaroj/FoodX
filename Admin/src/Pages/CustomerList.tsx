import { ChevronDown, Ellipsis, Search } from "lucide-react";
import React, { useRef } from "react";

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
      <table className="w-full py-1.5 rounded-sm px-2 bg-[#8a849544] flex  flex-col justify-center gap-5 items-center">
        <thead className="w-full">
          <tr className="w-full text-[15px] text-[var(--dark-text)] flex items-center justify-between">
            <th>
              <input className="cursor-pointer" type="checkbox" />
            </th>
            <th>Customer</th>
            <th>Email</th>
            <th>Location</th>
            <th>Orders</th>
            <th>Amount Spent</th>
            <th></th>
          </tr>
        </thead>
        <tbody className="w-full flex flex-col items-center justify-center gap-2">
          <tr className="w-full  text-[var(--dark-foreground)] text-[15px] bg-[var(--light-foreground)] p-1  rounded-md flex items-center justify-between">
            <td>
              <input className="cursor-pointer" type="checkbox" />
            </td>
            <td>Saroj GT</td>
            <td>sarojgt326@gmail.com</td>
            <td>Jorpati,Kathmandu</td>
            <td>12</td>
            <td>$ 920</td>
            <td className="cursor-pointer hover:text-[red] duration-200">
              <Ellipsis size={20} />
            </td>
          </tr>
          <tr className="w-full text-[var(--dark-foreground)]  text-[15px] bg-[var(--light-foreground)] p-1  rounded-md flex items-center justify-between">
            <td>
              <input className="cursor-pointer" type="checkbox" />
            </td>
            <td>Kiran GT</td>
            <td>kirangt@gmail.com</td>
            <td>Narayantaar,Kathmandu</td>
            <td>9</td>
            <td>$ 550</td>
            <td className="cursor-pointer hover:text-[red] duration-200">
              <Ellipsis
                size={20} />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default CustomerList;
