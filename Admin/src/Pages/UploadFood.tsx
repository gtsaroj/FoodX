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

const UploadFood: React.FC = () => {
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
          Add an item
        </h3>

        <form
          action=""
          className="sm:w-[600px]   w-full px-5 min-w-full py-7 gap-3 flex flex-col items-start justify-center"
        >
          {/* First Row */}
          <div
            className="flex sm:flex-row flex-col

          w-full items-center gap-5  justify-start "
          >
            {" "}
            <div className=" w-full flex flex-col items-baseline justify-center gap-0.5">
              <label
                className="font-semibold pl-0.5 text-[15px] text-[var(--dark-text)]"
                htmlFor=""
              >
                Food Name
              </label>
              <input
                type="text"
                placeholder="Pizza"
                className="w-full placeholder:text-sm py-2 px-4 rounded-md"
              />
            </div>
            <div className=" w-full flex flex-col items-baseline justify-center gap-0.5">
              <label
                className="font-semibold pl-0.5  text-[15px] text-[var(--dark-text)]"
                htmlFor=""
              >
                Price
              </label>
              <input
                type="text"
                placeholder="Rs. 1,200"
                className="w-full placeholder:text-sm py-2 px-4 rounded-md"
              />
            </div>
          </div>
          {/* Second Row */}
          <div className="flex w-full flex-col items-start justify-center gap-0.5">
            <label
              className="font-semibold pl-0.5 text-[15px] text-[var(--dark-text)]"
              htmlFor=""
            >
              Category
            </label>
            <div className="w-full py-1 border-[1px] rounded-md px-2 bg-[var(--light-foreground)] ">
              {" "}
              <select
                className=" rounded-md bg-[var(--light-foreground)] w-full pr-40 text-[14px] py-2 text-[var(--dark-text)] pointer outline-none"
                name=""
                id=""
              >
                {options.map((opt) => (
                  <option className="" value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* Third Row */}
          <div
            onClick={() => fileRef.current?.click()}
            className="w-full transition-all hover:bg-[var(--light-secondary-text)] cursor-pointer relative border-dotted border-[2px] rounded-md border-[var(--dark-secondary-text)] stroke-[1px] py-20"
          >
            <input ref={fileRef as any} type="file" className="hidden" />
            <div className="absolute w-full flex flex-col items-center bottom-10 justify-center gap-1">
              <UploadIcon className="size-7 text-[var(--dark-text)] " />
              <span className="text-sm text-[var(--dark-text)] ">
                Upload a file or drag and drop
              </span>
              <span className="text-[var(--dark-secondary-text)] text-sm ">
                jpg,png upto 10 mb
              </span>
            </div>
          </div>
          <div className="  pl-2 flex items-center justify-center gap-4">
            <input
              type="checkbox"
              className="w-[15px] cursor-pointer scale-[1.1] h-[15px] "
            />
            <p className="text-[16px] text-[var(--dark-text)] ">
              {" "}
              Would you like to mark this as a special product ?
            </p>
          </div>
          <button className="w-full text-[var(--light-text)] transition-all rounded py-2.5 bg-[var(--primary-color)] hover:bg-[var(--primary-dark)] ">
            Save
          </button>
        </form>
      </div>
    </React.Fragment>
  );
};

export default UploadFood;
