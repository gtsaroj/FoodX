import { User } from "lucide-react";

// interface OrderCardProps {
//   orderId: string;
//   items: [name: string, quantity: number];
//   price: number;
//   status: string;
//   date: Date;
// }

export const OrderCard = () => {
  return (
    <div className="flex items-center justify-between flex-shrink-0 w-full h-full gap-5 p-3 border border-[var(--light-secondary-background)] rounded-md min-w-[400px]">
      <div className="flex items-center justify-center gap-3">
        <div className="p-1 border rounded-full ">
          <User size={30} />
        </div>
        <div className="flex flex-col items-start justify-center pr-5">
          <p className="text-xs text-[var(--dark-secondary-text)] pb-1">
            #92013waadawa72313sdasdwa
          </p>

          <p className="text-sm text-[var(--dark-secondary-text)] pb-3">
            C.Momo x 2, C.Burger x 4, C.Burger x 4
          </p>
          <p className="text-lg text-[var(--dark-text)] font-semibold tracking-wide">
            Rs <span>1250</span>
          </p>
        </div>
      </div>
      <div className="flex flex-col items-start justify-between gap-3 text-xs">
        <p className="p-2 text-[var(--light-text)] rounded cursor-pointer bg-[var(--green-bg)]">
          Pending
        </p>
        <div className="text-xs text-[var(--dark-secondary-text)] pb-1 flex flex-col items-start justify-center">
          <p>2024-05-02</p>
          <p>
            04:55 <span>PM</span>
          </p>
        </div>
      </div>
    </div>
  );
};
