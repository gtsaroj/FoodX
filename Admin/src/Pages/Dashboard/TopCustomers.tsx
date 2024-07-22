import { useEffect, useState } from "react";
import { CustomerCard } from "../../Components/Common/Cards/CustomerCard";
import { TopCustomerType } from "../../models/user.model";
import { getTopCustomers } from "../../Utility/CustomerUtils";

export const TopCustomers = () => {
  const [TopCustomer, setTopCustomer] = useState<TopCustomerType[]>();

  useEffect(() => {
    (async () => {
      const customers = await getTopCustomers();
    
      if (customers) setTopCustomer(customers as any);
    })();
  }, []);
  
  return (
    <div className="bg-[var(--body-bg)] flex flex-col justify-center items-start px-2 rounded-md py-3 ">
      <div className="flex items-center justify-between w-full gap-3 px-3 pt-3 pb-5">
        <h4 className="text-xl">Top Customers</h4>
        <button>Filter</button>
      </div>
      <div className="flex flex-col gap-3 max-h-[350px] flex-grow overflow-y-scroll">
        {
          TopCustomer?.map((customer, index) => (
            <CustomerCard key={customer.id} prop={customer} index={index} />
          ))
      }

      </div>
    </div>
  );
};
