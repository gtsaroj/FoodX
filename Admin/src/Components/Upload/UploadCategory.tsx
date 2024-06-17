import { UploadIcon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

const options = [
  {
    label: "Pizza",
    value: 1,
  },
  {
    label: "Cold drinks",
    value: 2,
  },
  {
    label: "Hot drinks",
    value: 3,
  },
  {
    label: "MOMO",
    value: 4,
  },
];

export const UploadCategory: React.FC = () => {
  const reference = useRef<HTMLDivElement>();

  const [Scroll, setScroll] = useState<boolean>(false);

  const scroller = () => {
    if (reference.current && reference.current?.scrollTop > 0) {
      console.log("detected");
    }
  };
  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const currentRef = reference.current;
    if (currentRef) currentRef.addEventListener("scroll", scroller);
    return () => currentRef?.removeEventListener("scroll", scroller);
  },);

  return (
    <React.Fragment>
      <div
        ref={reference as any}
        className="w-full relative overflow-auto h-full flex-col gap-5 items-center justify-center flex"
      >
        <h3 className=" h-12 sticky  overflow-hidden shadow text-center  w-full border-b-[1px] text-black text-[20px]">
          Add an banner
        </h3>

        <form
          action=""
          className="sm:w-[600px]   w-full px-5 min-w-full py-7 gap-16 flex flex-col items-start justify-center"
              >
                  {/* First Row */}
            <div className=" w-full flex flex-col items-baseline justify-center gap-0.5">
              <label
                className="font-semibold pl-0.5 text-[15px] text-[var(--dark-text)]"
                htmlFor=""
              >
                Category Name
              </label>
              <input
                type="text"
                placeholder="Pizza"
                className="w-full outline-none placeholder:text-sm py-2 px-4 rounded"
              />
            </div>
          {/* Third Row */}
          <button className="w-full text-[var(--light-text)] transition-all rounded py-2.5 bg-[var(--primary-color)] hover:bg-[var(--primary-dark)] ">
            Save
          </button>
        </form>
      </div>
    </React.Fragment>
  );
};

