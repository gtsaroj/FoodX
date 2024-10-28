import dayjs from "dayjs";
import React, { useState } from "react";
import { TicketStatus } from "../../models/ticket.model";
import Avatar from "../../assets/logo/avatar.png";
import { getRemainingTime } from "../../Utility/date.utility";
import { useQueryClient } from "react-query";
import { User } from "../../models/user.model";
import { getChefByUid } from "../../Utility/user.utils";
import toast from "react-hot-toast";
import { updateTicket } from "../../Services/ticket.services";

interface TicketProp {
  date: string;
  uid?: string;
  description: string;
  title?: string;
  category: string;
  id?: string;
  status?: TicketStatus["status"];
}

export const RecentTicketCard: React.FC<TicketProp> = ({
  category,
  description,
  date,
  uid,
  status,
  id: t_id,
}) => {
  const queryClient = useQueryClient();
  const [isUpdate, setIsUpdate] = React.useState<boolean>(false);
  const [id, setId] = useState<string>("");

  const [cachedUser, setCachedUser] = useState<User | null>(null);

  React.useEffect(() => {
    const fetchUser = async () => {
      const user = queryClient.getQueryData<User>(["user", uid]);
      if (!user && uid) {
        const fetchedUser = await queryClient.fetchQuery(["user", uid], () =>
          getChefByUid(uid)
        );
        setCachedUser(fetchedUser);
      } else {
        setCachedUser(user as User);
      }
    };
    fetchUser();
  }, [uid, queryClient]);

  const ticketUpdate = async (
    uid: string,
    newStatus: TicketStatus["status"]
  ) => {
    if (!uid) toast.error("Some thing went wrong");
    const toastLoader = toast.loading("Loading...");

    try {
      await updateTicket({ id: uid, newStatus: newStatus });
      toast.dismiss(toastLoader);
    } catch (error) {
      throw new Error("Error while updating recent ticket " + error);
    } finally {
      toast.dismiss(toastLoader);
    }
  };

  return (
    <div className="w-full bg-[var(--light-foreground)] p-3 gap rounded-lg border-[1px] border-[var(--dark-border)] flex flex-col items-start justify-center gap-3">
      <div className="w-full flex justify-between items-center">
        <div className="flex items-center justify-center gap-2">
          <img
            className="w-12 h-12 rounded-full"
            loading="lazy"
            src={cachedUser?.avatar || Avatar}
            alt="user"
          />
          <h1 className=" text-[17px] text-[var(--dark-text)] tracking-wide ">
            {cachedUser?.fullName || "user"}
          </h1>
        </div>
        <span className=" text-gray-400 text-xs ">
          {getRemainingTime(dayjs(date))}
        </span>
      </div>
      <p className="w-full text-[var(--dark-secondary-text)] tracking-wide text-sm ">
        {description?.length > 130
          ? description.substring(0, 80) + "..."
          : description}
      </p>
      <div className="w-full flex-wrap flex items-center sm:gap-0 justify-start gap-5 sm:justify-evenly">
        <p className=" text-[var(--green-text)] bg-[#41d6410c] text-sm p-1 rounded-full px-2 ">
     
          New
        </p>
        <p
          onClick={() => {
            setIsUpdate(!isUpdate);
            setId(t_id as string);
          }}
          className={`relative `}
        >
          <button
            className=" tracking-wider  px-2 text-sm text-[var(--primary-color)] bg-[#0000ff0c]
             p-1 rounded-full"
          >
            {" "}
            {status && status?.charAt(0).toUpperCase() + status?.slice(1)}
          </button>
          <div
            className={` z-[100] top-4 bg-[var(--light-foreground)] absolute ${
              isUpdate && id.includes(t_id as string)
                ? "visible opacity-100 translate-x-0 "
                : "invisible opacity-0 translate-x-9 "
            }`}
          >
            <UpdateTiket
              isChangeStatus={() => setIsUpdate(false)}
              status={status as TicketStatus["status"]}
              action={(newStatus) => ticketUpdate(uid as string, newStatus)}
            />
          </div>
        </p>
        <p
          className={` p-1 bg-[#ffa60007] text-[#ff971f] px-2 tracking-wide rounded-full text-sm  `}
        >
          {category}
        </p>
      </div>
    </div>
  );
};

interface UpdateTiketProp {
  status: TicketStatus["status"];
  action: (newStatus: TicketStatus["status"]) => Promise<void>;
  isChangeStatus: () => void;
}

export const UpdateTiket: React.FC<UpdateTiketProp> = ({
  action,
  isChangeStatus,
  status,
}) => {
  const reference = React.useRef<HTMLDivElement | null>(null);
  const Status: TicketStatus["status"][] = [
    "pending",
    "progress",
    "rejected",
    "resolved",
  ];
  const updateStatus = Status.filter((sts) => sts !== status);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        reference.current &&
        !reference.current.contains(event.target as Node)
      ) {
        isChangeStatus(); // Close the modal
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isChangeStatus]);

  return (
    <div
      ref={reference}
      className={` flex p-1 duration-200 flex-col bg-[var(--light-foreground)] border-[1px] border-[var(--dark-border)] shadow rounded-lg items-center  `}
    >
      {updateStatus.map((status, index) => (
        <button
          className={`w-[150px] flex items-center tracking-wider gap-3 justify-start py-1.5 px-5 duration-150 hover:bg-[var(--light-background)] rounded-lg `}
          onClick={() => action(status)}
          key={index}
        >
          <span
            className={` w-2 rounded-full h-2 ${
              status === "pending"
                ? "bg-[var(--prepared)] "
                : status === "progress"
                ? "bg-[var(--pending)] "
                : status === "rejected"
                ? "bg-[var(--cancelled)]"
                : status === "resolved"
                ? "bg-[var(--completed)] "
                : ""
            } `}
          ></span>
          <span> {status.charAt(0).toUpperCase() + status.slice(1)}</span>
        </button>
      ))}
    </div>
  );
};
