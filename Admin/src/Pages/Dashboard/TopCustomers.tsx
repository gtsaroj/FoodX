import { CustomerCard } from "../../Components/Common/Cards/CustomerCard";

export const TopCustomers = () => {
  return (
    <div className="bg-[var(--body-bg)] flex flex-col justify-center items-start px-2 rounded-md py-3 ">
      <div className="flex items-center justify-between w-full gap-3 px-3 pt-3 pb-5">
        <h4 className="text-xl">Top Customers</h4>
        <button>Filter</button>
      </div>
      <div className="flex flex-col gap-3 max-h-[350px] flex-grow overflow-y-scroll">
        <CustomerCard />
        <CustomerCard />
        <CustomerCard />
        <CustomerCard />
      </div>
    </div>
  );
};
