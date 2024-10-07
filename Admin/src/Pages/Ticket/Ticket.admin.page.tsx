import React, { useEffect, useRef, useState } from "react";
import {
  GetTicketModal,
  TicketModel,
  TicketStatus,
  TicketType,
} from "../../models/ticket.model";
import Table from "../../Components/Common/Table/Table";
import { ColumnProps } from "../../models/table.model";
import { getTickets, updateTicket } from "../../Services/ticket.services";
import { aggregateTickets } from "./ticket";
import { Filter, X } from "lucide-react";
import { Button } from "../../Components/Common/Button/Button";
import Modal from "../../Components/Common/Popup/Popup";
import TicketView from "../../Components/Tickets/Ticket.view";

const TicketAdminPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [tickets, setTickets] = useState<TicketModel[]>([]);
  const [totalData, setTotalData] = useState<number>();
  const [pagination, setPagination] = useState<{
    currentPage: number;
    perPage: number;
  }>({ currentPage: 1, perPage: 7 });
  const [filter, setFilter] = useState<{
    sort?: "asc" | "desc";
    status?: TicketStatus["status"];
  }>({ sort: "asc" });
  const [currentDoc, setCurrentDoc] = useState<{
    currentFirstDoc: string;
    currentLastDoc: string;
  }>();
  const [id, setId] = useState<string>();
  const [isView, setIsView] = useState<boolean>(true);
  const [isChangeStatus, setIsChangeStatus] = useState<boolean>(false);

  const Columns: ColumnProps[] = [
    {
      fieldName: "Name",
      colStyle: { width: "200px", justifyContent: "start", textAlign: "start" },
      render: (value: TicketModel) => (
        <div className="w-[200px] text-[var(--dark-text)] tracking-wide  flex items-center justify-start gap-3 ">
          <span> {value.name}</span>
        </div>
      ),
    },
    {
      fieldName: "Category",
      colStyle: {
        width: "200px",
        justifyContent: "start",
        textAlign: "start",
        padding: "0px 15px 0px 0px",
      },
      render: (value: TicketType) => (
        <div className=" text-[var(--dark-text)] tracking-wide w-[200px] ">
          <p>{value.category}</p>
        </div>
      ),
    },
    {
      fieldName: "Created At",
      colStyle: { width: "180px", justifyContent: "start", textAlign: "start" },
      render: (value: TicketType) => (
        <div className=" text-[var(--dark-text)] tracking-wide w-[180px] ">
          <p>{value.date}</p>
        </div>
      ),
    },
    {
      fieldName: "Status",
      colStyle: { width: "150px", textAlign: "start" },
      render: (item: TicketType) => (
        <div
          onClick={() => {
            setId(item.id);
            setIsChangeStatus(true);
          }}
          className={`text-[var(--dark-text)] cursor-pointer flex items-center justify-center gap-2 tracking-wide w-[150px]   text-start `}
        >
          <div
            className={`w-2 h-2 rounded-full ${
              item.status === "pending"
                ? "bg-[var(--pending)] "
                : item.status === "progress"
                ? "bg-[var(--preparing)] "
                : item.status === "rejected"
                ? "bg-[var(--cancelled)]"
                : item.status === "resolved"
                ? "bg-[var(--completed)] "
                : ""
            } `}
          ></div>
          <p>{item.status?.charAt(0).toUpperCase() + item.status!.slice(1)}</p>
          <div className="absolute lg:left-[45rem] md:left-[30rem] left-[15rem] sm:left-[30rem] z-[1000]">
            {" "}
            {isChangeStatus && id === item.id && (
              <TicketStautusChanger
                isChangeStatus={() => setIsChangeStatus(false)}
                status={item.status!}
                statusFn={(newStatus: TicketStatus["status"]) =>
                  updateTicketFn(newStatus)
                }
              />
            )}
          </div>
        </div>
      ),
    },
  ];

  const updateTicketFn = async (newStatus: TicketStatus["status"]) => {
    await updateTicket({ id: id as string, newStatus: newStatus });
    const updateTickets = tickets?.map((ticket) => {
      if (ticket.id === id) {
        return { ...ticket, status: newStatus };
      }
    });
    setTickets(updateTickets as TicketModel[]);
    return;
  };

  const fetchTickets = async ({
    direction,
    pageSize,
    sort,
    currentFirstDoc,
    currentLastDoc,
    status,
  }: GetTicketModal) => {
    setLoading(true);
    try {
      const response = (await getTickets({
        direction: direction,
        pageSize: pageSize,
        sort: sort,
        currentFirstDoc: currentFirstDoc,
        currentLastDoc: currentLastDoc,
        status: status,
      })) as {
        tickets: TicketType[];
        currentFirstDoc: string;
        currentLastDoc: string;
        length: number;
      };

      setCurrentDoc({
        currentFirstDoc: response.currentFirstDoc,
        currentLastDoc: response.currentLastDoc,
      });
      setTotalData(response.length);
      const allTicket = await aggregateTickets(response.tickets);
      setTickets(allTicket);
    } catch (error) {
      setTickets([]);
      console.log(`Error while fetching tickets => admin-ticket` + error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTickets({
      pageSize: pagination.perPage,
      sort: (filter.sort as "asc" | "desc") || "asc",
      direction: "next",
      currentFirstDoc: null,
      currentLastDoc: null,
      status: filter.status || undefined,
    });
  }, [filter.sort, filter.status, pagination.perPage]);

  useEffect(() => {
    if (pagination.currentPage > 1 && currentDoc?.currentLastDoc) {
      const fetchNextPage = async () => {
        setLoading(true);
        try {
          const response = (await getTickets({
            pageSize: pagination.perPage,
            sort: (filter.sort as "asc" | "desc") || "asc",
            direction: "next",
            currentFirstDoc: currentDoc?.currentFirstDoc || null,
            currentLastDoc: currentDoc?.currentLastDoc || null,
            status: filter.status || undefined,
          })) as {
            tickets: TicketType[];
            currentFirstDoc: string;
            currentLastDoc: string;
            length: number;
          };
          setCurrentDoc({
            currentFirstDoc: response.currentFirstDoc,
            currentLastDoc: response.currentLastDoc,
          });
          setTotalData(response.length);
          const allTicket = await aggregateTickets(response.tickets);
          setTickets(allTicket);
        } catch (error) {
          setTickets([]);
          console.log(`Error while fetching tickets => admin-ticket` + error);
        }
        setLoading(false);
      };
      fetchNextPage();
    }
  }, [pagination.currentPage, pagination.perPage, filter.sort, filter.status]);

  const findTicket =
    !isView && id && tickets?.find((ticket) => ticket.id === id);

  return (
    <div className="w-full px-3 py-10">
      <div className="w-full flex items-start justify-between">
        <div className="flex items-end justify-center gap-10">
          <div className="flex flex-col -space-y-1.5 items-start justify-center gap-1">
            <h4 className="text-[1.25rem] font-[600] tracking-wider text-[var(--dark-text)]">
              All Tickets
            </h4>
            <p className="text-[15px] tracking-wider text-[var(--dark-secondary-text)] text-nowrap ">
              {totalData || 0} entries found
            </p>
          </div>
          <div className="flex items-center justify-start gap-2">
            {filter?.status && (
              <div className="flex px-2 py-0.5  gap-3 border-[var(--dark-secondary-text)]  items-center rounded border  justify-start">
                <div className="flex gap-1 items-center justify-center">
                  <span className="  text-[15px] text-[var(--dark-secondary-text)] ">
                    {filter.status && filter.status.toLowerCase()}
                  </span>
                </div>
                <button
                  onClick={() =>
                    setFilter((prev) => ({ ...prev, status: undefined }))
                  }
                  className=" "
                >
                  <X className="text-[var(--danger-text)] " size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
        <Button
          sortFn={(value: "asc" | "desc") =>
            setFilter((prev) => ({ ...prev, sort: value }))
          }
          bodyStyle={{
            width: "400px",
            top: "3.5rem",
            left: "-18rem",
          }}
          parent={
            <div className="flex border-[1px] border-[var(--dark-border)] px-4 py-2 rounded items-center justify-start gap-2">
              <Filter
                strokeWidth={2.5}
                className="size-5 text-[var(--dark-secondary-text)]"
              />
              <p className="text-[16px] text-[var(--dark-secondary-text)] tracking-widest ">
                Filter
              </p>
            </div>
          }
          sort={[
            { label: "Pending", value: "pending", id: "fklsdjf" },
            { label: "Progress", value: "progress", id: "fkjdls" },
            {
              label: "Resolved",
              value: "resolved",
              id: "sarojgtkxwkhabar",
            },
            {
              label: "Rejected",
              value: "rejected",
              id: "kirangt3owijf",
            },
          ]}
          checkFn={{
            checkSortFn: (isChecked, value) => {
              if (!isChecked)
                setFilter((prev) => ({ ...prev, status: undefined }));
              if (isChecked && value)
                setFilter((prev) => ({ ...prev, status: value }));
            },
          }}
        />
      </div>

      <div className=" py-6">
        <Table
          loading={loading}
          columns={Columns}
          data={tickets as TicketModel[]}
          totalData={totalData as number}
          actions={{
            viewFn: (id: string) => {
              setId(id);
              setIsView(false);
            },
          }}
          pagination={{
            perPage: pagination.perPage,
            currentPage: pagination.currentPage,
          }}
          onPageChange={(value) =>
            setPagination((prev) => ({ ...prev, currentPage: value }))
          }
          bodyHeight={400}
          headStyle={{ width: "100%" }}
        />
      </div>
      {!isView && id && (
        <Modal
          children={<TicketView item={findTicket as TicketModel} />}
          close={isView}
          closeModal={() => setIsView(!isView)}
        />
      )}
    </div>
  );
};

export default TicketAdminPage;

interface StatusChangerProp {
  status: TicketStatus["status"];
  statusFn: (status: TicketStatus["status"], id?: string) => void;
  isChangeStatus: () => void;
}

export const TicketStautusChanger: React.FC<StatusChangerProp> = ({
  status,
  statusFn,
  isChangeStatus,
}) => {
  const [showModal, setShowModal] = useState(true);

  const reference = useRef<HTMLDivElement>();
  const Status = ["progress", "resolved", "pending", "rejected"];

  const updateStatus = Status.filter((sts) => sts !== status);

  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (
        reference.current &&
        !reference.current?.contains(event.target as any)
      ) {
        setShowModal(false);
        isChangeStatus();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [status, isChangeStatus]);

  return (
    <div
      ref={reference as any}
      className={`w-full flex p-1 duration-200 flex-col bg-[var(--light-foreground)] border-[1px] border-[var(--dark-border)] shadow rounded-lg items-center ${
        showModal ? "visible" : "invisible"
      } `}
    >
      {updateStatus.map((status, index) => (
        <button
          className={`w-[150px] flex items-center tracking-wider gap-3 justify-start py-1.5 px-5 duration-150 hover:bg-[var(--light-background)] rounded-lg `}
          onClick={() => statusFn(status as TicketStatus["status"])}
          key={index}
        >
          <span
            className={` w-2 rounded-full h-2 ${
              status === "pending"
                ? "bg-[var(--pending)] "
                : status === "progress"
                ? "bg-[var(--preparing)] "
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
