import { UploadIcon } from "lucide-react";
import React, { ChangeEvent, FormEvent, useRef, useState } from "react";
import { UploadProductType } from "../../models/productMode";
import { nanoid } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { addLogs, addProducts } from "../../Services";
import { useSelector } from "react-redux";
import { RootState } from "../../Reducer/Store";
import { Selector } from "../Selector/Selector";
import { storeImageInFirebase } from "../../firebase/storage";

const UploadFood: React.FC = () => {
  const reference = useRef<HTMLDivElement>();
  const [addFood, setAddFood] = useState<UploadProductType>({
    products: {
      id: nanoid(),
      name: "",
      image: "",
      price: NaN,
      quantity: NaN,
      tag: undefined,
    },
    collection: "products",
  });
  const categories = useSelector(
    (state: RootState) => state.root.category.categories
  );

  const fileRef = useRef<HTMLInputElement | null>(null);

  const handleClick = async (event: FormEvent, data: UploadProductType) => {
    event.preventDefault();
    if (!data) return toast.error("Product are unavailable");
    try {
      const addProduct = await addProducts(data);
      await addLogs({
        action: "create",
        detail: ` Product :  ${data.products.id}`,
        date: new Date(),
      });
      if (addProduct) return toast.success("Succesfully Added");
      addFood.products.image = "";
    } catch (error) {
      return toast.error("Unable to add product");
    }
  };

  return (
    <React.Fragment>
      <div
        ref={reference as any}
        className="relative flex flex-col items-center justify-center w-full h-full gap-5 overflow-auto"
      >
        <h3 className=" h-12 sticky tracking-wider  overflow-hidden  text-center  w-full border-b-[1px] text-black text-[20px]">
          Add an item
        </h3>

        <form
          onSubmit={(event) => handleClick(event, addFood)}
          action=""
          className="sm:w-[600px]   w-full px-5 min-w-full py-7 gap-5 flex flex-col items-start justify-center"
        >
          {/* First Row */}
          <div className="flex flex-col items-center justify-start w-full gap-5 sm:flex-row ">
            {" "}
            <div className=" w-full flex flex-col items-baseline justify-center gap-0.5">
              <label
                className="font-semibold pl-0.5 text-[15px] text-[var(--dark-text)]"
                htmlFor=""
              >
                Item Name
              </label>
              <input
                type="text"
                onChange={(event) =>
                  setAddFood((prev) => ({
                    ...prev,
                    products: { ...prev.products, name: event.target.value },
                  }))
                }
                placeholder="Pizza"
                className="w-full text-[var(--dark-text)] outline-none placeholder:text-sm py-2 px-4 rounded"
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
                type="number"
                onChange={(event) =>
                  setAddFood((prev) => ({
                    ...prev,
                    products: { ...prev.products, price: event.target.value },
                  }))
                }
                placeholder="Rs. 1,200"
                className="w-full placeholder:text-sm  outline-none text-[var(--dark-text)] py-2 px-4 rounded"
              />
            </div>
          </div>
          {/* Second Row */}
          <div className="flex flex-col items-center justify-start w-full gap-5 sm:flex-row">
            <div className="w-full flex flex-col items-baseline justify-center gap-0.5">
              <label
                className="font-semibold pl-0.5 text-[15px] text-[var(--dark-text)]"
                htmlFor=""
              >
                Category
              </label>
              <Selector
                categoryOption={categories.map((category) => ({
                  label: category,
                  value: category,
                }))}
                setField={(value) =>
                  setAddFood((prev) => ({
                    ...prev,
                    products: { ...prev.products, tag: value },
                  }))
                }
              />
            </div>
            <div className="w-full flex flex-col items-baseline justify-center gap-0.5">
              <label
                className="font-semibold pl-0.5 text-[15px] text-[var(--dark-text)]"
                htmlFor=""
              >
                Quantity
              </label>
              <div className="w-full py-1 border-[1px] rounded px-2 bg-[var(--light-foreground)] ">
                <input
                  type="number"
                  onChange={(event) =>
                    setAddFood((prev) => ({
                      ...prev,
                      products: {
                        ...prev.products,
                        quantity: event.target.value,
                      },
                    }))
                  }
                  placeholder="Enter Quantity"
                  className="w-full text-[var(--dark-text)] outline-none placeholder:text-sm py-1.5 px-4 rounded"
                />
              </div>
            </div>
          </div>
          {/* Third Row */}
          {addFood.products.image ? (
            <div className="w-full   overflow-hidden transition-all hover:bg-[var(--light-secondary-text)] cursor-pointer relative border-dotted border-[2px] rounded border-[var(--dark-secondary-text)] stroke-[1px]">
              {" "}
              <img
                className="w-full h-[230px] object-fill"
                src={addFood?.products.image as string}
              />
            </div>
          ) : (
            <div
              onClick={() => fileRef.current?.click()}
              className="w-full transition-all hover:bg-[var(--light-secondary-text)] cursor-pointer relative border-dotted border-[2px] rounded border-[var(--dark-secondary-text)] stroke-[1px] py-20"
            >
              <input
                ref={fileRef as any}
                onChange={async (event: ChangeEvent<HTMLInputElement>) => {
                  if (!event.target.files) return;

                  const imageUrl = await storeImageInFirebase(
                    event.target.files[0],
                    { folder: "products" }
                  );
                  setAddFood((prev) => ({
                    ...prev,
                    products: {
                      ...prev.products,
                      image: imageUrl,
                    },
                  }));
                }}
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
          )}
          <div className="flex items-center justify-center gap-4 pl-2 ">
            <input
              onChange={(event) => {
                if (event.target.checked)
                  setAddFood((prev) => ({ ...prev, collection: "specials" }));
                else
                  setAddFood((prev) => ({ ...prev, collection: "products" }));
              }}
              type="checkbox"
              value={"specials"}
              className="w-[15px] cursor-pointer scale-[1.1] h-[15px] "
            />
            <p className="text-[16px] text-[var(--dark-text)] ">
              {" "}
              Would you like to mark this as a special product ?
            </p>
          </div>
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

export default UploadFood;
