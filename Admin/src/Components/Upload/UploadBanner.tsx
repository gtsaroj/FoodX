import { UploadIcon } from "lucide-react";
import React, { useEffect, useRef } from "react";

const UploadBanner: React.FC = () => {
  const reference = useRef<HTMLDivElement>();

  // const [Scroll, setScroll] = useState<boolean>(false);

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
          className="sm:w-[600px]   w-full px-5 min-w-full py-7 gap-5 flex flex-col items-start justify-center"
              >
                  {/* First Row */}
            <div className=" w-full flex flex-col items-baseline justify-center gap-0.5">
              <label
                className="font-semibold pl-0.5 text-[15px] text-[var(--dark-text)]"
                htmlFor=""
              >
                Banner Name
              </label>
              <input
                type="text"
                placeholder="Pizza"
                className="w-full outline-none placeholder:text-sm py-2 px-4 rounded"
              />
            </div>
          {/* Third Row */}
          <div
            onClick={() => fileRef.current?.click()}
            className="w-full h-[300px] transition-all hover:bg-[var(--light-secondary-text)] cursor-pointer relative border-dotted border-[2px] rounded border-[var(--dark-secondary-text)] stroke-[1px] py-20"
          >
            <input ref={fileRef as any} type="file" className="hidden" />
            <div className="absolute w-full flex flex-col items-center bottom-24 justify-center gap-1">
              <UploadIcon className="size-7 text-[var(--dark-text)] " />
              <span className="text-sm text-[var(--dark-text)] ">
                Upload a file or drag and drop
              </span>
              <span className="text-[var(--dark-secondary-text)] text-sm ">
                jpg,png upto 10 mb
              </span>
            </div>
          </div>
          <button className="w-full text-[var(--light-text)] transition-all rounded py-2.5 bg-[var(--primary-color)] hover:bg-[var(--primary-dark)] ">
            Save
          </button>
        </form>
      </div>
    </React.Fragment>
  );
};

export default UploadBanner;
