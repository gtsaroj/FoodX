import { UploadIcon } from "lucide-react";
import React, {
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { UploadProduct } from "../../models/product.model";
import { nanoid } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { addProducts } from "../../Services/product.services";
import { addLogs } from "../../Services/log.services";

import { Selector } from "../Selector/Selector";
import { storeImageInFirebase } from "../../firebase/storage";
import { getCategories } from "../../Services/category.services";
import { Category } from "../../models/category.model";
import { useMutation, useQueryClient } from "react-query";

interface UploadFoodProp {
  closeModal: () => void;
}
const UploadFood: React.FC<UploadFoodProp> = ({ closeModal }) => {
  const reference = useRef<HTMLDivElement>();
  const [addFood, setAddFood] = useState<UploadProduct>({
    product: {
      id: nanoid(),
      name: "",
      image: "",
      price: "",
      quantity: "",
      tagId: "",
    },
    collection: "products",
  });
  const [initialCategory, setIntitialCategory] = useState<Category[]>([]);

  const categories = async () => {
    try {
      const response = await getCategories();
      setIntitialCategory(response);
    } catch (error) {
      throw new Error("Error while fetching category " + error);
    }
  };

  const fileRef = useRef<HTMLInputElement | null>(null);

  const handleClick = async (event: FormEvent) => {
    event.preventDefault();
    if (!addFood) return toast.error("Product are unavailable");
    const convertOGProduct = {
      collection: addFood.collection,
      product: {
        id: addFood.product.id,
        name: addFood.product.name,
        image: addFood.product.image,
        price: parseInt(addFood.product.price as string),
        quantity: parseInt(addFood.product.quantity as string),
        tagId: addFood.product.tagId,
      },
    };
    try {
      await addProducts(convertOGProduct);
      await addLogs({
        action: "create",
        detail: ` Product :  ${addFood.product.id}`,
        date: new Date(),
      });
      toast.success("Succesfully Added");
    } catch (error) {
      toast.error("Error while adding product ");
      throw new Error("Error while uploading products" + error);
    } finally {
      closeModal();
      setAddFood(() => ({
        collection: "",
        product: {
          id: "",
          image: "",
          name: "",
          price: "",
          quantity: "",
          tagId: "",
        },
      }));
    }
  };

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: handleClick,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addFood.collection });
    },
  });
  useEffect(() => {
    categories();
  }, []);

  return (
    <React.Fragment>
      <div
        ref={reference as any}
        className="relative flex flex-col items-center justify-center w-full h-full gap-5 overflow-auto"
      >
        <h3 className=" h-12 sticky border-[var(--dark-border)] tracking-wider  overflow-hidden  text-center  w-full border-b-[1px] text-[var(--dark-text)] text-[20px]">
          Add an item
        </h3>

        <form
          onSubmit={(event) => mutate(event)}
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
                    product: { ...prev.product, name: event.target.value },
                  }))
                }
                placeholder="Pizza"
                className="w-full border-[var(--dark-border)] border-[1px] text-[var(--dark-text)] bg-[var(--light-foreground)] outline-none placeholder:text-sm py-2 px-4 rounded"
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
                    product: {
                      ...prev.product,
                      price: event.target.value,
                    },
                  }))
                }
                placeholder="Rs. 1,200"
                className="w-full border-[1px] border-[var(--dark-border)] placeholder:text-sm bg-[var(--light-foreground)]  outline-none text-[var(--dark-text)] py-2 px-4 rounded"
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
                categoryOption={initialCategory?.map((category) => ({
                  label: category.name,
                  value: category.id,
                }))}
                setField={(value) =>
                  setAddFood((prev) => ({
                    ...prev,
                    product: { ...prev.product, tagId: value },
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
              <div className="w-full py-1 border-[1px] border-[var(--dark-border)] rounded px-2 bg-[var(--light-foreground)] ">
                <input
                  type="number"
                  onChange={(event) =>
                    setAddFood((prev) => ({
                      ...prev,
                      product: {
                        ...prev.product,
                        quantity: event.target.value,
                      },
                    }))
                  }
                  placeholder="Enter Quantity"
                  className="w-full text-[var(--dark-text)] bg-[var(--light-foreground)] outline-none placeholder:text-sm py-1.5 px-4 rounded"
                />
              </div>
            </div>
          </div>
          {/* Third Row */}
          {addFood.product.image ? (
            <div className="w-full   overflow-hidden transition-all hover:bg-[var(--light-foreground)] cursor-pointer relative border-dotted border-[2px] rounded border-[var(--dark-border)] stroke-[1px]">
              {" "}
              <img
                className="w-full h-[230px] object-fill"
                src={addFood?.product.image as string}
              />
            </div>
          ) : (
            <div
              onClick={() => fileRef.current?.click()}
              className="w-full transition-all hover:bg-[var(--light-foreground)] cursor-pointer relative border-dotted border-[2.5px] rounded border-[var(--dark-border)] stroke-[1px] py-20"
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
                    product: {
                      ...prev.product,
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
              id="1245"
              value={"specials"}
              className="w-[15px] accent-slate-900 cursor-pointer scale-[1.1] h-[15px] "
            />
            <label
              htmlFor="1245"
              className="text-[16px] cursor-pointer text-[var(--dark-text)] "
            >
              {" "}
              Would you like to mark this as a special product ?
            </label>
          </div>
          <button
            type="submit"
            className="w-full text-white transition-all rounded py-2.5 bg-[var(--primary-color)] hover:bg-[var(--primary-dark)] "
          >
            Save
          </button>
        </form>
      </div>
    </React.Fragment>
  );
};

export default UploadFood;
