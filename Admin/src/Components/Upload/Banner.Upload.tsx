import { UploadIcon } from "lucide-react";
import React, {
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { storeImageInFirebase } from "../../firebase/storage";
import toast from "react-hot-toast";
import { addBanner } from "../../Services/banner.services";
import { addLogs } from "../../Services/log.services";
import { Selector } from "../Selector/Selector";

interface UploadBannerProp {
  closeModal: () => void;
}
const UploadBanner: React.FC<UploadBannerProp> = () => {
  const reference = useRef<HTMLDivElement>();
  const [name, setName] = useState<string>();
  const [image, setImage] = useState<string>();
  const [banner, setBanner] = useState<"banners" | "sponsors">("banners");

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
  });
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!image && !name) return toast.error("All files are required");
    try {
      if (banner === "banners") {
        await addBanner({
          name: name as string,
          img: image as string,
          path: "banners",
        });
        await addLogs({
          action: "create",
          date: new Date(),
          detail: `Banner : ${name} `,
          
        });
        setImage("");
        setName("");
      }
      if (banner === "sponsors") {
        await addBanner({
          name: name as string,
          img: image as string,
          path: "sponsors",
        });
        await addLogs({
          action: "create",
          date: new Date(),
          detail: `sponsor : ${name} `,
        });
        setImage("");
        setName("");
      }
    } catch (error) {
      throw new Error("Unable to add new banner" + error);
    }
  };

  return (
    <React.Fragment>
      <div
        ref={reference as any}
        className="w-full relative text-[var(--dark-text)] overflow-auto h-full flex-col gap-5 items-center justify-center flex"
      >
        <h3 className=" h-12 sticky  text-[var(--dark-text)] overflow-hidden border-[var(--dark-border)]  text-center  w-full border-b-[1px]  text-[20px]">
          Add an banner
        </h3>

        <form
          onSubmit={(event) => handleSubmit(event)}
          action=""
          className="sm:w-[600px]   w-full px-5 min-w-full py-7 gap-5 flex flex-col items-start justify-center"
        >
          {/* First Row */}
          <Selector
            categoryOption={[
              { label: "Banner", value: "banners" },
              { label: "Sponsor", value: "sponsors" },
            ]}
            setField={(value) => setBanner(value as "banners" | "sponsors")}
          />
          <div className=" w-full flex flex-col items-baseline justify-center gap-0.5">
            <label
              className="font-semibold pl-0.5 text-[15px] text-[var(--dark-text)]"
              htmlFor=""
            >
              Banner Name
            </label>
            <input
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setName(event.target.value)
              }
              type="text"
              placeholder="Pizza"
              className="w-full border-[1px] border-[var(--dark-border)] bg-[var(--light-foreground)] outline-none placeholder:text-sm py-2 px-4 rounded"
            />
          </div>
          {/* Third Row */}
          <div
            onClick={() => fileRef.current?.click()}
            className="w-full h-[300px] transition-all hover:bg-[var(--light-foreground)] cursor-pointer relative border-dotted border-[2.5px] rounded border-[var(--dark-border)]  stroke-[1px] py-20"
          >
            <input
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                const image = event.target.files && event.target.files[0];
                storeImageInFirebase(image as File, {
                  folder: "banners",
                }).then((response) => setImage(response));
              }}
              ref={fileRef as any}
              type="file"
              className="hidden"
            />
            {image ? (
              <div className="w-full   overflow-hidden transition-all hover:bg-[var(--light-secondary-text)] cursor-pointer relative border-dotted border-[2px] rounded border-[var(--dark-border)] stroke-[1px]">
                {" "}
                <img
                  className="w-full h-[230px] object-fill"
                  src={image as string}
                />
              </div>
            ) : (
              <div className="absolute  w-full flex flex-col items-center bottom-24 justify-center gap-1">
                <UploadIcon className="size-7 text-[var(--dark-text)] " />
                <span className="text-sm text-[var(--dark-text)] ">
                  Upload a file or drag and drop
                </span>
                <span className="text-[var(--dark-secondary-text)] text-sm ">
                  jpg,png upto 10 mb
                </span>
              </div>
            )}
          </div>
          <button
            type="submit"
            className="w-full text-white dark:text-[var(--dark-text)] transition-all rounded py-2.5 bg-[var(--primary-color)] hover:bg-[var(--primary-dark)] "
          >
            Save
          </button>
        </form>
      </div>
    </React.Fragment>
  );
};

export default UploadBanner;
