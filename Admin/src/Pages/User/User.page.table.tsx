import React from "react";
import { User } from "../../models/user.model";
import Table from "../../Components/Common/Table/Table";
import { ColumnProps } from "../../models/table.model";

interface CustomerTableProp {
  users: User[];
  selectedData?: Array<any>;
  loading?: boolean;
  actions?: {
    delete?: (id: string) => void;
    edit?: (id: string) => void;
    checkFn: (id: string, isChecked: boolean) => void;
    checkAllFn?: (isChecked: boolean) => void;
  };
  totalData?: number;
  pagination: { currentPage: number; perPage: number };
  onPageChange: (page: number) => void;
  handlePageDirection: (pageDirection: "next" | "prev") => void;
}

export const CustomerTable: React.FC<CustomerTableProp> = ({
  users,
  loading,
  actions,
  selectedData,
  onPageChange,
  pagination,
  totalData,
  handlePageDirection
}) => {
  const Columns: ColumnProps[] = [
    {
      fieldName: " Name",
      colStyle: { width: "280px", justifyContent: "start", textAlign: "start" },
      render: (value: User) => (
        <div className="w-[280px] text-[var(--dark-text)] flex items-center justify-start gap-3 ">
          <div className="w-[50px] h-[50px]">
            <img
              className="w-full h-full rounded-full"
              src={value.avatar}
              alt=""
            />
          </div>
          <div className="flex flex-col">
            <span className="tracking-wide text-[15px] font-[500] contrast-125 ">
              {" "}
              {value.fullName}
            </span>
            <span className="tracking-wide text-[var(--dark-secondary-text)] text-sm font-[500] contrast-125">
              {value.email}
            </span>
          </div>
        </div>
      ),
    },
    {
      fieldName: "Id",
      colStyle: { width: "150px", textAlign: "start" },
      render: (item: User) => (
        <div className="w-[150px] text-[var(--dark-secondary-text)]  relative cursor-pointer group/id text-start ">
          #{item.uid?.substring(0, 8)}
          <div className=" top-[-27px] group-hover/id:visible opacity-0 group-hover/id:opacity-[100] duration-150 invisible left-[-30px]  absolute bg-[var(--light-foreground)] p-1 rounded shadow ">
            {item.uid}
          </div>
        </div>
      ),
    },
    {
      fieldName: "Role",
      colStyle: { width: "150px", justifyContent: "start", textAlign: "start" },
      render: (item: User) => (
        <div className=" w-[150px]  text-[var(--dark-text)]">
          <p>{item.role}</p>
        </div>
      ),
    },
    {
      fieldName: "Orders",
      colStyle: { width: "150px", justifyContent: "start", textAlign: "start" },
      render: (item: User) => (
        <div className=" w-[150px] text-[var(--dark-text)] ">
          <p>{item.totalOrder}</p>
        </div>
      ),
    },
    {
      fieldName: "Amount",
      colStyle: { width: "120px", justifyContent: "start", textAlign: "start" },
      render: (item: User) => (
        <div className=" w-[120px] text-[var(--dark-text)]  ">
          <p>Rs {item.totalSpent}</p>
        </div>
      ),
    },
  ];
  return (
    <div className="w-full">
      <Table
        handlePageDirection={(pageDirection)=> handlePageDirection(pageDirection)}
        totalData={totalData as number}
        data={users as any}
        columns={Columns}
        actionIconColor="red"
        disableActions={!actions}
        actions={{
          ...(actions?.delete && {
            deleteFn: (id: string) => actions.delete && actions.delete(id),
          }),
          ...(actions?.edit && {
            editFn: (id: string) => actions.edit && actions.edit(id),
          }),
          ...(actions?.checkFn && {
            checkFn: (id: string, isChecked: boolean) =>
              actions.checkFn(id, isChecked),
          }),
          ...(actions?.checkAllFn && {
            checkAllFn: (isChecked: boolean) =>
              actions.checkAllFn && actions.checkAllFn(isChecked),
          }),
        }}
        selectedData={selectedData}
        loading={loading}
        bodyHeight={400}
        pagination={{
          currentPage: pagination?.currentPage,
          perPage: pagination?.perPage,
        }}
        onPageChange={(pageNumber) => onPageChange(pageNumber)}
        disableNoData={users?.length < 1 ? true : false}
        headStyle={{ width: "100%" }}
      />
    </div>
  );
};
