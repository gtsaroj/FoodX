import React, { ChangeEvent, FormEvent, useRef, useState } from "react";
import { storeImageInFirebase } from "../../firebase/storage";
import toast from "react-hot-toast";
import { ChevronDown, UploadIcon } from "lucide-react";
import { CustomerType } from "../../models/user.model";
import { Selector } from "../Selector/Selector";
import { addLogs, updateRole, updateUser } from "../../Services";

interface UpdateCategoryType {
  label: string;
  value: string;
}

const UpdateCategoryOption: UpdateCategoryType[] = [
  { label: "Name", value: "name" },
  {
    label: "Image",
    value: "image",
  },
  {
    label: "Role",
    value: "role",
  },
];
const roleOptions: UpdateCategoryType[] = [
  {
    label: "Admin",
    value: "admin",
  },
  {
    label: "Customer",
    value: "customer",
  },
  {
    label: "Chef",
    value: "chef",
  },
];

interface UpdateCustomerProp {
  customerInfo: CustomerType;
  closeModal: () => void;
}

const UpdateCustomer: React.FC<UpdateCustomerProp> = ({
  closeModal,
  customerInfo,
}) => {
  const [newData, setNewData] = useState<string>("");
  const [field, setField] = useState<"image" | "name" | "role">("name");
  const [showField, setShowField] = useState<string>();
  const [show, setShow] = useState<boolean>(false);

  const fileRef = useRef<HTMLImageElement>();
  console.log(field, newData);
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!customerInfo.id && !newData && !field)
      return toast.error(`All field required`);
    const toastLoader = toast.loading("Updating user role...");
    try {
      if (field == "role") {
        await updateRole({
          id: customerInfo.id as string,
          role: customerInfo.role,
          newRole: newData,
        });
        await addLogs({
          action: "update",
          date: new Date(),
          detail: `${customerInfo.name} was update from ${customerInfo.role} to ${newData} by me. `,
        });
        toast.dismiss(toastLoader);
        toast.success("User update successfully");
        return;
      }
      await updateUser({
        id: customerInfo.id as string,
        role: customerInfo.role,
        field: field,
        newData: newData,
      });

      await addLogs({
        action: "update",
        date: new Date(),
        detail: `${customerInfo.name} was updated of ${field} : ${newData} by me. `,
      });
      toast.dismiss(toastLoader);
      toast.success("User update successfully");
    } catch (error) {
      toast.dismiss(toastLoader);
      toast.error("User not updated");
      throw new Error("Unable to update category" + error);
    }
  };
  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const image = event.target.files[0];
    const imageUrl = await storeImageInFirebase(image, { folder: "users" });
    setNewData(imageUrl);
  };
  return (
    <div className="flex flex-col  items-start justify-center gap-7">
      <h3 className=" h-12 tracking-wider  text-center  w-full border-b-[1px] text-black text-[22px]">
        Update Customer
      </h3>
      <form
        action=""
        className="flex text-[var(--dark-text)] py-5 sm:px-16 px-5 flex-col items-start justify-start gap-7 w-full"
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
            className={`flex bg-[var(--light-foreground)] left-0 top-14 z-[1000] shadow shadow-[#0000003a] rounded-b-lg absolute flex-col items-start justify-center gap-1 w-full transition-all duration-300 overflow-hidden ${
              show
                ? "max-h-64 opacity-100"
                : "max-h-0 opacity-0 transform -translate-y-2"
            }`}
          >
            {UpdateCategoryOption?.map((option) => (
              <p
                onClick={() => {
                  setField(option.value as "image" | "name" | "role");

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
              placeholder="Eg. Saroj GT"
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setNewData(event.target.value)
              }
            />
          </div>
        ) : field === "role" ? (
          <Selector
            categoryOption={roleOptions}
            setField={(value) => setNewData(value as string)}
          />
        ) : (
          ""
        )}
        <button className="w-full text-[18px] tracking-wider text-[var(--light-text)] transition-all rounded py-2.5 bg-[var(--primary-color)] hover:bg-[var(--primary-dark)] ">
          Submit
        </button>
      </form>
    </div>
  );
};

export default UpdateCustomer;
