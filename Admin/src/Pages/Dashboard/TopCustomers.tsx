import { useEffect, useState } from "react";
import { CustomerCard } from "../../Components/Common/Cards/CustomerCard";
import { CustomerType } from "../../models/user.model";
import { getTopCustomers } from "../../Utility/CustomerUtils";
import { FilterButton } from "../../Components/Common/Sorting/Sorting";
import Skeleton from "react-loading-skeleton";
import { Filter } from "lucide-react";
import { Button } from "../../Components/Common/Button/Button";

export const TopCustomers = () => {
  const [TopCustomer, setTopCustomer] = useState<CustomerType[]>([]);
  const [originalData, setOriginalData] = useState<CustomerType[]>([]);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const handleSelect = async (value: string | undefined) => {
    console.log(value);
    let sortedCustomers;
    if (value === "totalOrders") {
      sortedCustomers = TopCustomer?.sort((a: CustomerType, b: CustomerType) =>
        sortOrder === "desc"
          ? (((b.totalOrder as number) - a.totalOrder) as number)
          : (((a.totalOrder as number) - b.totalOrder) as number)
      );
    }
    if (value === "totalSpent") {
      sortedCustomers = TopCustomer?.sort((a: CustomerType, b: CustomerType) =>
        sortOrder === "desc"
          ? (((b.amountSpent as number) - a.amountSpent) as number)
          : (((a.amountSpent as number) - b.amountSpent) as number)
      );
    }
    if (value === undefined) {
      return setTopCustomer(originalData);
    }
    setTopCustomer(sortedCustomers as CustomerType[]);
  };

  useEffect(() => {
    (async () => {
      const customers = await getTopCustomers();
      setOriginalData(customers as CustomerType[]);
      if (customers) setTopCustomer(customers as CustomerType[]);
    })();
  }, []);
  console.log(originalData);

  return (
    <div className="bg-[var(--body-bg)] flex flex-col justify-center items-start px-2 rounded-md py-3 ">
      <div className="flex items-center justify-between w-full gap-3 px-3 pt-3 pb-5">
        <h4 className="text-xl">Top Customers</h4>
        <div>
          <Button
            bodyStyle={{
              width: "400px",
              top: "3.5rem",
              left: "-18rem",
            }}
            parent={
              <div className="flex border px-4 py-2 rounded items-center justify-start gap-2">
                <Filter
                  strokeWidth={2.5}
                  className="size-5 text-[var(--dark-secondary-text)]"
                />
                <p className="text-[16px] text-[var(--dark-secondary-text)] tracking-widest ">
                  Filter
                </p>
              </div>
            }
            checkFn={{
              checkSortFn: (isChecked: boolean, value: string) => {
                if (!isChecked) {
                  return handleSelect((value = undefined));
                }
                handleSelect(value);
              },
            }}
            sort={[
              { label: "Orders", value: "totalOrders", id: "flkiogrgaiosjd" },
              { label: "Amount", value: "totalSpent", id: "lfwrtpokjds" },
            ]}
            sortFn={(type: "asc" | "desc") =>
              setSortOrder(type as "asc" | "desc")
            }
          />
        </div>
      </div>
      <div className="flex flex-col gap-3 max-h-[350px] flex-grow overflow-y-scroll">
        {TopCustomer?.length > 0 ? (
          TopCustomer?.map((customer, index) => (
            <CustomerCard key={customer.id} prop={customer} index={index} />
          ))
        ) : (
          <div className="w-full ">
            <Skeleton className="mb-1" height={100} />
            <Skeleton height={70} count={4} />
          </div>
        )}
      </div>
    </div>
  );
};
