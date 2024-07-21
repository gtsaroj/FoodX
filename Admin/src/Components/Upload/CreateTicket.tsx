import React, { FormEvent, useEffect, useRef, useState } from "react";
import Select from "react-select";
import { requestSelectOption } from "../LineChart/D";
import { HashLoader } from "react-spinners";
import { TicketType } from "../../models/ticket.model";
import { useSelector } from "react-redux";
import { RootState } from "../../Reducer/Store";
import { stat } from "fs";
import toast from "react-hot-toast";
import { createTicket } from "../../Services";

const CreateTicket: React.FC = () => {
  const reference = useRef<HTMLDivElement>();
  const user = useSelector((state: RootState) => state.root.auth.userInfo);

  const [loading, setLoading] = useState<boolean>(false);
  const [initialTicket, setInitialTicket] = useState<TicketType>({
    title: "",
    category: "",
    description: "",
    date: new Date().toISOString().split("T") as any,
    status: "Pending",
    uid: user.uid,
  });

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (
      !initialTicket.category &&
      initialTicket.category &&
      !initialTicket.description
    )
      return toast.error("All fields are required");

    setLoading(true);
    try {
      const response = await createTicket({ ...initialTicket });
      setLoading(false);
      return toast.success("Ticket success");
    } catch (error) {
      toast.error("Unable to create ticket");
      setLoading(false);
      return console.log("Unable to create ticket" + error);
    }

  };

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
          onSubmit={(event) => handleSubmit(event)}
          action=""
          className="sm:w-[600px]   w-full px-5 min-w-full py-7 gap-5 flex flex-col items-start justify-center"
        >
          {/* First Row */}
          <div className=" w-full flex flex-col items-baseline justify-center gap-0.5">
            <label
              className="font-semibold pl-0.5 text-[15px] text-[var(--dark-text)]"
              htmlFor=""
            >
              Category
            </label>
            <Select
              onChange={(event) =>
                setInitialTicket((prev) => ({
                  ...prev,
                  category: event.value,
                }))
              }
              className="w-full"
              options={requestSelectOption}
            />
          </div>
          {/* Second Row */}
          <div className=" w-full flex flex-col items-baseline justify-center gap-0.5">
            <label
              className="font-semibold pl-0.5 text-[15px] text-[var(--dark-text)]"
              htmlFor=""
            >
              Title
            </label>
            <input
              value={initialTicket.title}
              onChange={(event) =>
                setInitialTicket((prev) => ({
                  ...prev,
                  title: event.target.value,
                }))
              }
              type="text"
              className="w-full outline-none placeholder:text-sm py-2 px-4 rounded"
            />
          </div>
          {/* Third Row */}
          <div className=" w-full flex flex-col items-baseline justify-center gap-0.5">
            <label
              className="font-semibold pl-0.5 text-[15px] text-[var(--dark-text)]"
              htmlFor=""
            >
              Description
            </label>
            <textarea
              value={initialTicket.description}
              onChange={(event) =>
                setInitialTicket((prev) => ({
                  ...prev,
                  description: event.target.value,
                }))
              }
              placeholder="Describe your request"
              className="w-full h-[200px] resize-none  outline-none placeholder:text-sm py-2 px-4 rounded"
            />
          </div>

          <button className="w-full text-[var(--light-text)] transition-all rounded py-2.5 bg-[var(--primary-color)] hover:bg-[var(--primary-dark)] ">
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                Sending <HashLoader color="white" size={"20px"} />
              </div>
            ) : (
              "Save"
            )}
          </button>
        </form>
      </div>
    </React.Fragment>
  );
};

export default CreateTicket;
