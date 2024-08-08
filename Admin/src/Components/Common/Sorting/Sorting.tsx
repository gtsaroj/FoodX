import { ArrowDownAZ, ArrowUp, Key } from "lucide-react";
import { ReactNode, useEffect, useRef, useState } from "react";

interface SortValue {
  parent?: React.ReactNode;
  bodyStyle?: React.CSSProperties;
  onSelect?: (value: string) => void;
  sortOrder?: string;
  children?: { label: string | ReactNode; value: string }[];
}

export const FilterButton: React.FC<SortValue> = ({
  onSelect,
  data,
  sortOrder,
  bodyStyle,
  parent,
  children,
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
 console.log(index)
  return (
    <div ref={reference as any} className="relative w-full ">
      {parent ? (
        parent
      ) : (
        <div className={` flex py-1.5 px-2  items-center justify-start gap-2 `}>
          <ArrowDownAZ className="size-5" />
          <span className=" text-[17px] tracking-wide">Sort By</span>
        </div>
      )}
      {openChild && (
        <div
          style={bodyStyle}
          className={`  bg-[var(--light-foreground)] p-1 rounded gap-1 flex flex-col items-start justify-center absolute  top-0 border shadow-[#00000009] shadow-sm`}
        >
          {children?.map((option, key) => (
            <button
              onClick={() => {
                if (!onSelect) return;
                onSelect(option.value);
                setIndex(key);
              }}
              className={`text-start ${key ===index ?"ring-1 ring-[var(--orange-bg)] bg-yellow-50 ":""} duration-150 cursor-pointer flex items-center justify-between hover:bg-gray-100  w-full rounded py-1.5 px-2  tracking-wide text-[16px]`}
              key={key}
            >
              {option.label}
              {sortOrder && (
                <span>
                  <ArrowUp
                    className={` size-4 gap-3 duration-150 ${
                      sortOrder === "desc" && index === key
                        ? "rotate-180"
                        : sortOrder === "asc" && index === key
                        ? ""
                        : "invisible"
                    } `}
                  />
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
