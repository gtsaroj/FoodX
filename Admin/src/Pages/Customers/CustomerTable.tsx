import React from "react";
import { CustomerType } from "../../models/user.model";
import Table from "../../Components/Common/Table/Table";
import { ColumnProps } from "../../models/table.model";

interface CustomerTableProp {
  users: CustomerType[];
  selectedData?: Array<T>;
  loading?: boolean;
  actions?: {
    delete?: (id: string) => void;
    edit?: (id: string) => void;
    checkFn: (id: string, isChecked: boolean) => void;
    checkAllFn?: (isChecked: boolean) => void;
  };
}

export const CustomerTable: React.FC<CustomerTableProp> = ({
  users,
  loading,
  actions,
  selectedData,
}) => {
  const Columns: ColumnProps[] = [
    {
      fieldName: " Name",
      colStyle: { width: "280px", justifyContent: "start", textAlign: "start" },
      render: (value: CustomerType) => (
        <div className="w-[280px] text-[var(--dark-text)] flex items-center justify-start gap-3 ">
          <div className="w-[50px] h-[50px]">
            <img
              className="w-full h-full rounded-full"
              src={value.image}
              alt=""
            />
          </div>
          <div className="flex flex-col">
            <span className="tracking-wide text-[15px] font-[500] contrast-125 ">
              {" "}
              {value.name}
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
      render: (item: CustomerType) => (
        <div className="w-[150px] text-[var(--dark-secondary-text)]  relative cursor-pointer group/id text-start ">
          #{item.id?.substring(0, 8)}
          <div className=" top-[-27px] group-hover/id:visible opacity-0 group-hover/id:opacity-[100] duration-150 invisible left-[-30px]  absolute bg-[var(--light-foreground)] p-1 rounded shadow ">
            {item.id}
          </div>
        </div>
      ),
    },
    {
      fieldName: "Role",
      colStyle: { width: "150px", justifyContent: "start", textAlign: "start" },
      render: (item: CustomerType) => (
        <div className=" w-[150px]  text-[var(--dark-text)]">
          <p>{item.role}</p>
        </div>
      ),
    },
    {
      fieldName: "Orders",
      colStyle: { width: "150px", justifyContent: "start", textAlign: "start" },
      render: (item: CustomerType) => (
        <div className=" w-[150px] text-[var(--dark-text)] ">
          <p>{item.totalOrder}</p>
        </div>
      ),
    },
    {
      fieldName: "Amount",
      colStyle: { width: "120px", justifyContent: "start", textAlign: "start" },
      render: (item: CustomerType) => (
        <div className=" w-[120px] text-[var(--dark-text)]  ">
          <p>Rs {item.amountSpent}</p>
        </div>
      ),
    },
  ];
  return (
    <div className="w-full">
      <Table
        data={users}
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
        pagination={{ currentPage: 1, perPage: 5 }}
        onPageChange={(pageNumber) => console.log(pageNumber)}
        disableNoData={users?.length < 1 ? true : false}
        headStyle={{ width: "100%" }}
      />
    </div>
  );
};
