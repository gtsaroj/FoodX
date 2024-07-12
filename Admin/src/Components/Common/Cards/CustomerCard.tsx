import { User } from "lucide-react";

export const CustomerCard = () => {
  return (
    <div className="flex items-center justify-start w-full h-full gap-2 px-2 py-3 bg-[var(--light-foreground)] rounded-lg">
      <div className="p-2 border rounded-full">
        <User size={35} />
      </div>
      <div className="flex flex-col items-start justify-center gap-3 pl-2 pr-3">
        <div className="flex flex-col gap-1">
          <p className="text-[var(--dark-text)] text-nowrap">
            Aayush Lamichhane
          </p>
          <p className="text-xs text-[var(--dark-secondary-text)]">
            22f-bit.06@texascollege.edu.np
          </p>
        </div>
        <div className="flex flex-col gap-1 text-[var(--dark-secondary-text)]">
          <p className="text-xs">
            Total Orders:{" "}
            <span className="text-[var(--dark-text)] text-sm font-medium">
              2000
            </span>
          </p>
          <p className="text-xs">
            Total Spent:{" "}
            <span className="text-[var(--dark-text)] text-sm font-medium">
              Rs 20000
            </span>
          </p>
        </div>
      </div>
      <p className="p-3 text-3xl font-semibold">
        #<span>1</span>
      </p>
    </div>
  );
};
