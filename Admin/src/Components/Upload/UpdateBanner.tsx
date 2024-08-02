import React, { ChangeEvent, FormEvent, useRef, useState } from "react";
import { storeImageInFirebase } from "../../firebase/storage";
import toast from "react-hot-toast";
import { ChevronDown, UploadIcon } from "lucide-react";
import { updateComponentProp } from "../../models/table.model";

interface UpdateCategoryType {
  label: string;
  value: string;
}

const UpdateCategoryOption: UpdateCategoryType[] = [
  { label: "Banner", value: "name" },
  {
    label: "Image",
    value: "image",
  },
];

const UpdateBanner: React.FC<updateComponentProp> = ({ id }) => {
  const [newData, setNewData] = useState<string>("");
  const [field, setField] = useState<"image" | "name">();
  const [show, setShow] = useState<boolean>(false);
  const [showField, setShowField] = useState<string>();
  const fileRef = useRef<HTMLImageElement>();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!id) return toast.error("Banner id not found");
    try {
      console.log("dk");
    } catch (error) {
      throw new Error("Unable to update category" + error);
    }
  };
  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const image = event.target.files[0];
    const imageUrl = await storeImageInFirebase(image, { folder: "banners" });
    setNewData(imageUrl);
  };
  return (
    <div className="flex flex-col items-start justify-center gap-5">
      <h3 className=" h-12 sticky  overflow-hidden shadow text-center  w-full border-b-[1px] text-black text-[20px]">
        Update Category
      </h3>
      <form
        action=""
        className="flex py-5 px-10 flex-col items-start justify-start gap-5 w-full"
        onSubmit={(event) => handleSubmit(event)}
      >
        <div className="w-full relative group/selector py-1 gap-2 border-[1px] rounded px-2 bg-[var(--light-foreground)]">
          <div
            onClick={() => setShow(!show)}
            className="flex items-center  justify-between"
          >
            <input
              type="text"
              className="w-full py-2  outline-none cursor-pointer "
              readOnly
              value={showField}
              placeholder="Select option"
            />
            <ChevronDown />
          </div>
          <div
            className={`flex bg-[var(--light-foreground)] left-0 top-14 z-[1000] shadow shadow-[#0000003a] rounded-b-lg absolute flex-col  gap-1  w-full transition-all duration-300 overflow-auto ${
              show
                ? "max-h-64 opacity-100"
                : "max-h-0 opacity-0 transform -translate-y-2"
            }`}
          >
            {UpdateCategoryOption?.map((option) => (
              <p
                onClick={() => {
                  setField(option.value as any);
                  setShowField(option.label);
                  setShow(false);
                }}
                key={option.label}
                className="text-[var(--dark-text)] text-start text-[16px] p-2 hover:bg-slate-200 w-full rounded"
              >
                {option.label}
              </p>
            ))}
          </div>
        </div>

        {field === "image" ? (
          newData ? (
            <div className="w-full   overflow-hidden transition-all hover:bg-[var(--light-secondary-text)] cursor-pointer relative border-dotted border-[2px] rounded border-[var(--dark-secondary-text)] stroke-[1px]">
              {" "}
              <img className="w-full h-[230px] object-fill" src={newData} />
            </div>
          ) : (
            <div
              onClick={() => fileRef.current?.click()}
              className="w-full transition-all hover:bg-[var(--light-secondary-text)] cursor-pointer relative border-dotted border-[2px] rounded border-[var(--dark-secondary-text)] stroke-[1px] py-20"
            >
              <input
                ref={fileRef as any}
                onChange={(event: ChangeEvent<any>) => handleChange(event)}
                type="file"
                className="hidden"
              />
              <div className="flex flex-col items-center justify-center w-full gap-1 bottom-10">
                <UploadIcon className="size-7 text-[var(--dark-text)] " />
                <span className="text-sm text-[var(--dark-text)] ">
                  Upload a file or drag and drop
                </span>
                <span className="text-[var(--dark-secondary-text)] text-sm ">
                  jpg,png upto 10 mb
                </span>
              </div>
            </div>
          )
        ) : field === "name" ? (
          <div className="w-full py-1 border-[1px] rounded px-2 bg-[var(--light-foreground)]">
            <input
              className="w-full text-[var(--dark-text)] outline-none placeholder:text-sm py-1.5 px-4 rounded "
              type="text"
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setNewData(event.target.value)
              }
            />
          </div>
        ) : (
          ""
        )}
        <button className="w-full text-[var(--light-text)] transition-all rounded py-2.5 bg-[var(--primary-color)] hover:bg-[var(--primary-dark)] ">
          Submit
        </button>
      </form>
    </div>
  );
};

export default UpdateBanner;
