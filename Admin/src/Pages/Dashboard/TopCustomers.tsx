import { useEffect, useState } from "react";
import { CustomerCard } from "../../Components/Common/Cards/CustomerCard";
import { CustomerType, TopCustomerType } from "../../models/user.model";
import { getTopCustomers } from "../../Utility/CustomerUtils";
import { FilterButton } from "../../Components/Common/Sorting/Sorting";
import { CategoryType } from "../../models/category.model";

export const TopCustomers = () => {
  const [TopCustomer, setTopCustomer] = useState<TopCustomerType[]>();
  const [sortOrder, setSortOrder] = useState({ field: "", order: "desc" });

  const handleSelect = async (value: string) => {
    const newOrder = sortOrder.order === "asc" ? "desc" : "asc";

    let sortedCustomers;
    if (value === "Total order") {
      sortedCustomers = [...(TopCustomer as CustomerType[])].sort(
        (a: CustomerType, b: CustomerType) =>
          newOrder === "desc"
            ? (((b.totalOrder as number) - a.totalOrder) as number)
            : (((a.totalOrder as number) - b.totalOrder) as number)
      );
    }
    if (value === "Total spent") {
      sortedCustomers = [...(TopCustomer as CustomerType[])].sort(
        (a: CustomerType, b: CustomerType) =>
          newOrder === "desc"
            ? (((b.amountSpent as number) - a.amountSpent) as number)
            : (((a.amountSpent as number) - b.amountSpent) as number)
      );
    }

    setSortOrder({ field: value, order: newOrder });
    setTopCustomer(sortedCustomers as CustomerType[]);
  };

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
        <div>
          {" "}
          <FilterButton
            border = {true}
            onSelect={handleSelect}
            sortOrder={sortOrder.order}
            sortingOptions={["Total order", "Total spent"]}
          />
        </div>
      </div>
      <div className="flex flex-col gap-3 max-h-[350px] flex-grow overflow-y-scroll">
        {TopCustomer?.map((customer, index) => (
          <CustomerCard key={customer.id} prop={customer} index={index} />
        ))}
      </div>
    </div>
  );
};
