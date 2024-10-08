import React, { ChangeEvent, FormEvent, useRef, useState } from "react";
import { storeImageInFirebase } from "../../firebase/storage";
import toast from "react-hot-toast";
import { UploadIcon } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../../Store";
import { updateProduct } from "../../Services/product.services";
import { addLogs } from "../../Services/log.services";
import { Product } from "../../models/product.model";
import { Selector } from "../Selector/Selector";

const UpdateCategoryOption: { label: string; value: string }[] = [
  { label: "Product Name", value: "name" },
  {
    label: "Image",
    value: "image",
  },
  {
    label: "Price",
    value: "price",
  },
  {
    label: "Quantity",
    value: "quantity",
  },
  { label: "Category", value: "category" },
];

interface updateProductProp {
  product: Product;
  closeModal: () => void;
}

const UpdateFood: React.FC<updateProductProp> = ({ product, closeModal }) => {
  const [newData, setNewData] = useState<string | number>();
  const [field, setField] = useState<
    "image" | "name" | "price" | "category" | "quantity"
  >("name");
  const options = useSelector(
    (state: RootState) => state.root.category.categories
  ) as [];

  const fileRef = useRef<HTMLImageElement>();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!product.id) return toast.error("food id not found");
    const toastLoading = toast.loading("Updating...");
    try {
      await updateProduct({
        category: product.type,
        field: field,
        id: product.id,
        newData: newData as any,
      });
      await addLogs({
        action: "update",
        date: new Date(),
        detail: `Product : ${product.id} `,
      });
      toast.dismiss(toastLoading);
      toast.success("Successfully updated...");
      closeModal();
      setNewData("");
      closeModal();
    } catch (error) {
      toast.dismiss(toastLoading);
      closeModal();
      toast.error("Failed to delete");
      throw new Error("Unable to update category" + error);
    }
  };
  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const image = event.target.files[0];
    const imageUrl = await storeImageInFirebase(image, { folder: "products" });
    console.log(imageUrl);
    setNewData(imageUrl);
  };
  return (
    <div className="flex z-[100] flex-col items-start justify-center gap-5">
      <h3 className=" h-12 sticky  overflow-hidden  text-center  w-full border-b-[1px] border-[var(--dark-border)] text-[var(--dark-text)] text-[20px]">
        Update Food
      </h3>
      <form
        action=""
        className="flex py-5 px-10 flex-col items-start justify-start gap-5 w-full"
        onSubmit={(event) => handleSubmit(event)}
      >
        <Selector
          setField={(value) => setField(value as any)}
          categoryOption={UpdateCategoryOption}
        />

        {field === "image" ? (
          newData ? (
            <div className="w-full   overflow-hidden transition-all hover:bg-[var(--light-background)] cursor-pointer relative border-dotted border-[2px] rounded border-[var(--dark-border)] stroke-[1px]">
              {" "}
              <img
                className="w-full h-[230px] object-fill"
                src={newData as string}
              />
            </div>
          ) : (
            <div
              onClick={() => fileRef.current?.click()}
              className="w-full transition-all hover:bg-[var(--light-background)] cursor-pointer relative border-dotted border-[2.5px] rounded border-[var(--dark-border)] stroke-[1px] py-20"
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
          <div className="w-full py-1 border-[var(--dark-border)] border-[1px]  rounded px-2 bg-[var(--light-foreground)]">
            <input
              className="w-full text-[var(--dark-text)] bg-[var(--light-foreground)]  outline-none placeholder:text-sm py-1.5 px-4 rounded "
              type="text"
              value={newData as string}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setNewData(event.target.value)
              }
            />
          </div>
        ) : field === "price" ? (
          <input
            value={newData as number}
            type="text"
            onChange={(event) => setNewData(parseInt(event.target.value))}
            placeholder="1200"
            className="w-full placeholder:text-sm  border-[var(--dark-border)] border-[1px] bg-[var(--light-foreground)] outline-none text-[var(--dark-text)] py-2 px-4 rounded"
          />
        ) : field === "quantity" ? (
          <input
            value={newData as number}
            onChange={(event) => setNewData(parseInt(event.target.value))}
            type="text"
            className="w-full border-[var(--dark-border)] border-[1px] bg-[var(--light-foreground)] text-[var(--dark-text)] outline-none placeholder:text-sm py-1.5 px-4 rounded"
          />
        ) : field === "category" ? (
          <Selector
            categoryOption={options}
            setField={(value) => setNewData(value)}
          />
        ) : (
          ""
        )}
        <button className="w-full dark:text-[var(--dark-text)] text-[var(--light-text)] transition-all rounded py-2.5 bg-[var(--primary-color)] hover:bg-[var(--primary-dark)] ">
          Submit
        </button>
      </form>
    </div>
  );
};

export default UpdateFood;
