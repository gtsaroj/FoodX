import React, { useEffect } from "react";
import { EllipsisVertical } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import "./Table.css";
import { Order } from "../../../models/order.model";
import { getUserData } from "../../../firebase/db";
import { DropDown } from "../DropDown/DropDown";

interface TableRowProps {
  options?: string[];
  row: Order | any;
  headerColSpan: string[];
  actions: (row: string) => void;
  colSpan: string;
  rowIndex: number;
  oncheckBoxChange?: (
    rowIndex: number,
    colName: string,
    checked: boolean
  ) => void;
  option: (value: string, uid: string) => void;
}

export const TableRowComponent: React.FC<TableRowProps> = ({
  options,
  option,
  row,
  rowIndex,
  oncheckBoxChange,
  headerColSpan,
  colSpan,
  actions,
}) => {
  console.log(row);
  function handleClick(value: string, uid: string) {
    option(value, uid);
  }
  return (
    <React.Fragment>
      <tr
        className={`w-full px-2  grid  border-b-[1px] grid-cols-${colSpan} gap-x-8 items-center py-5  justify-items-center`}
      >
        {headerColSpan.map((hdr, hdrIndex) => (
          <td
            key={`${hdr}-${hdrIndex}`}
            className={`col-span-1 text-sm ${
              hdr.toLowerCase() === "products"
                ? " overflow-auto h-[40px] bg-[var(--light-background)] py-1 rounded shadow-inner px-2 "
                : ""
            } `}
          >
            {hdr.toLowerCase() === "image" ? (
              <div className="w-[60px] h-[50px]">
                <img className="w-full h-full rounded" src={row.image} alt="" />
              </div>
            ) : hdr.toLowerCase() === "sn" ||
              hdr.toLowerCase() === "orderid" ? (
              rowIndex + 1
            ) : hdr.toLowerCase() === "checkbox" ? (
              <input className="w-4 cursor-pointer h-4" type="checkbox" />
            ) : hdr.toLowerCase() === "button" ? (
              <DropDown
                onSelect={(value) => {
                  actions(value);
                }}
                style={{}}
                value={row.orderId}
                options={["Edit", "Delete"]}
                children={
                  <EllipsisVertical className="size-6 duration-150 hover:text-[var(--danger-bg)] " />
                }
              />
            ) : hdr.toLowerCase() === "status" ? (
              <DropDown
                onSelect={(value: string) => handleClick(value, row.orderId)}
                style={{
                  padding: "0.5rem 3rem",
                  background: "var(--green-bg)",
                  borderRadius: "4px",
                  fontWeight: 500,
                  color: "var(--light-text)",
                }}
                options={
                  options?.includes(row?.status)
                    ? options.filter((option) => option !== row?.status)
                    : options
                }
                children={row.status}
              />
            ) : hdr === "email" ? (
              row["email"].replace("@texascollege.edu.np", "...")
            ) : (
              row[hdr]
            )}
          </td>
        ))}
      </tr>
    </React.Fragment>
  );
};
