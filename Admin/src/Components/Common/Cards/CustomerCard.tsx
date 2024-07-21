import { TopCustomerType } from "../../../models/user.model";

interface CustomerCardProp {
  prop: TopCustomerType;
  index: number;
}

export const CustomerCard: React.FC<CustomerCardProp> = ({ prop, index }) => {
  return (
    <div className="flex items-center justify-start w-full h-full gap-2 px-2 py-3 bg-[var(--light-foreground)] rounded-lg">
      <div className="w-[50px] h-[50px] ">
        <img
          className="w-full h-full rounded-full"
          src={prop.image}
          alt="img"
        ></img>
      </div>
      <div className="flex flex-col items-start justify-center gap-3 pl-2 pr-3">
        <div className="flex flex-col gap-1">
          <p className="text-[var(--dark-text)] text-nowrap">{prop.name}</p>
          <p className="text-xs text-[var(--dark-secondary-text)]">
            {prop.email}
          </p>
        </div>
        <div className="flex flex-col gap-1 text-[var(--dark-secondary-text)]">
          <p className="text-xs">
            Total Orders:{" "}
            <span className="text-[var(--dark-text)] text-sm font-medium">
              {prop.totalOrder}{" "}
            </span>
          </p>
          <p className="text-xs">
            Total Spent:{" "}
            <span className="text-[var(--dark-text)] text-sm font-medium">
              {prop.amountSpent}
            </span>
          </p>
        </div>
      </div>
      <p className="p-3 text-3xl font-semibold">
        #<span>{index + 1}</span>
      </p>
    </div>
  );
};
