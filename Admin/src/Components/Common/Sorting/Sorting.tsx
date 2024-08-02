import { ArrowDownAZ, ArrowUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface SortValue {
  onSelect: (value: string) => void;
  sortingOptions: string[];
  sortOrder: string;
}

export const FilterButton: React.FC<SortValue> = ({
  onSelect,
  sortingOptions,
  sortOrder,
}) => {
  const [openChild, setOpenChild] = useState<boolean>(false);
  const [index, setIndex] = useState<number>();

  const reference = useRef<HTMLDivElement>();

  useEffect(() => {
    const closeModal = (event: Event) => {
      if (
        reference.current &&
        !reference.current.contains(event.target as any)
      ) {
        setOpenChild(false);
      } else {
        setOpenChild(true);
      }
    };

    window.addEventListener("mousedown", closeModal);

    return () => {
      window.removeEventListener("mousedown", closeModal);
    };
  }, []);

  return (
    <div ref={reference as any} className="relative w-full ">
      <div className="flex w-full p-1.5 hover:bg-[var(--light-secondary-background)] items-center rounded justify-start gap-2">
        <ArrowDownAZ className="size-4" />
        <span className=" text-[15px]">Sort By</span>
      </div>
      {openChild && (
        <div className="w-[200px] bg-[var(--light-background)]  p-0.5 rounded gap-1 flex flex-col items-start justify-center absolute left-[-12.8rem] top-0 border shadow-[#00000015] shadow-sm ">
          {sortingOptions?.map((option, key) => (
            <button
              onClick={() => {
                onSelect(option);
                setIndex(key);
              }}
              className=" text-start flex items-center justify-between hover:bg-[var(--light-secondary-background)] w-full p-2 tracking-wide text-[16px] "
              key={key}
            >
              {option}
              <span>
                <ArrowUp
                  className={` size-4 gap-3 duration-150 ${
                    sortOrder === "desc" && index === key ? "rotate-180" : sortOrder ==="asc" && index === key ? "":"invisible"
                  } `}
                />
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
