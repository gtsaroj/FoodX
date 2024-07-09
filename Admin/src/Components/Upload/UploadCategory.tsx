import { UploadIcon } from "lucide-react";
import React, { SetStateAction, useEffect, useRef, useState } from "react";
import { addCategory } from "../../firebase/db";
import { storeImageInFirebase } from "../../firebase/storage";

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
interface UploadCategoryProp {
  categories: React.Dispatch<
    React.SetStateAction<{ [key: string]: string } | undefined>
  >;
}

export const UploadCategory: React.FC<UploadCategoryProp> = ({
  categories,
}) => {
  const reference = useRef<HTMLDivElement>();
  const [Scroll, setScroll] = useState<boolean>(false);
  const [categoryName, setCategoryName] = useState<string>("");
  const [imageURL, setImageURL] = useState<string>("");

  const scroller = () => {
    if (reference.current && reference.current?.scrollTop > 0) {
      console.log("detected");
    }
  };
  const fileRef = useRef<HTMLInputElement | null>(null);

  const handleSave = async () => {
    if (categoryName && imageURL) {
      try {
        const response = await addCategory("bnw", categoryName, imageURL);
        console.log(response.icons)
        categories(response.icons as any);
      } catch (error) {
        console.error("Error adding category:", error);
        alert("Failed to add category");
      }
    } else {
      alert("Please fill in all fields");
    }
  };

 

  useEffect(() => {
    const currentRef = reference.current;
    if (currentRef) currentRef.addEventListener("scroll", scroller);
    return () => currentRef?.removeEventListener("scroll", scroller);
  });

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
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
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
              onChange={(e) => setCategoryName(e.target.value)}
              type="text"
              placeholder="Pizza"
              className="w-full outline-none placeholder:text-sm py-2 px-4 rounded"
            />
          </div>
          {/* second row */}
          {imageURL ? (
            <div className="w-full   overflow-hidden transition-all hover:bg-[var(--light-secondary-text)] cursor-pointer relative border-dotted border-[2px] rounded border-[var(--dark-secondary-text)] stroke-[1px]">
              {" "}
              <img className="w-full h-[230px] object-fill" src={imageURL} />
            </div>
          ) : (
            <div
              onClick={() => fileRef.current?.click()}
              className="w-full transition-all hover:bg-[var(--light-secondary-text)] cursor-pointer relative border-dotted border-[2px] rounded border-[var(--dark-secondary-text)] stroke-[1px] py-20"
            >
              <input
                ref={fileRef as any}
                onChange={(event) => {
                  if (event.target.files)
                    storeImageInFirebase(
                      event.target.files[0],
                      "products" as any
                    ).then((res) => {
                      setImageURL(res);
                    });
                }}
                type="file"
                className="hidden"
              />
              <div className=" w-full flex flex-col items-center bottom-10 justify-center gap-1">
                <UploadIcon className="size-7 text-[var(--dark-text)] " />
                <span className="text-sm text-[var(--dark-text)] ">
                  Upload a file or drag and drop
                </span>
                <span className="text-[var(--dark-secondary-text)] text-sm ">
                  jpg,png upto 10 mb
                </span>
              </div>
            </div>
          )}
          {/* Third Row */}
          <button
            type="submit"
            className="w-full text-[var(--light-text)] transition-all rounded py-2.5 bg-[var(--primary-color)] hover:bg-[var(--primary-dark)] "
          >
            Save
          </button>
        </form>
      </div>
    </React.Fragment>
  );
};
