import React, { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { updateComponentProp } from "../../models/table.model";
import { updateOrderStatus } from "../../Services";

interface UpdateCategoryType {
  label: string;
  value: string;
}

const UpdateCategoryOption: UpdateCategoryType[] = [
  { label: "Status", value: "status" },
];
const statusOptions: UpdateCategoryType[] = [
  {
    label: "Canceled",
    value: "canceled",
  },
  {
    label: "Recieved",
    value: "recieved",
  },
  {
    label: "Delivered",
    value: "delivered",
  },
  {
    label: "Preparing",
    value: "preparing",
  },
];

const UpdateOrder: React.FC<updateComponentProp> = ({
  id,
  closeModal,
  status,
}) => {
  const [newData, setNewData] = useState<string>("");
  const [field, setField] = useState<"status">("status");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!id) return toast.error("Order id not found");
    const toastLoader = toast.loading("Updating...");
    try {
      await updateOrderStatus({
        id: id,
        status: status as string,
      });
      toast.dismiss(toastLoader);
      toast.success("Successfully updated");
      if (!closeModal) return;
      closeModal(false);
    } catch (error) {
      toast.dismiss(toastLoader);
      throw new Error("Unable to update order" + error);
    }
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
        <div className="w-full py-1 border-[1px] rounded px-2 bg-[var(--light-foreground)]">
          {" "}
          <select
            className="rounded bg-[var(--light-foreground)] w-full pr-40 text-[14px] py-2 text-[var(--dark-text)] pointer outline-none"
            name=""
            id=""
            onClick={(event: any) => setField(event.target.value)}
          >
            {UpdateCategoryOption?.map((category) => (
              <option className="px-2" value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        {field === "status" ? (
          <div className="w-full py-1 border-[1px] rounded px-2 bg-[var(--light-foreground)]">
            {" "}
            <select
              className="rounded bg-[var(--light-foreground)] w-full pr-40 text-[14px] py-2 text-[var(--dark-text)] pointer outline-none"
              name=""
              id=""
              onClick={(event: any) => setNewData(event.target.value)}
            >
              {statusOptions?.map((status) => (
                <option className="px-2" value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
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

export default UpdateOrder;
