import React, { useEffect } from "react";
import { EllipsisVertical } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import "./Table.css";
import { Order } from "../../../models/order.model";
import { getUserData } from "../../../firebase/db";
import { DropDown } from "../DropDown/DropDown";

interface TableRowProps {
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
}

export const TableRowComponent: React.FC<TableRowProps> = ({
  row,
  rowIndex,
  oncheckBoxChange,
  headerColSpan,
  colSpan,
  actions,
}) => {
  console.log(row)

  return (
    <React.Fragment>
      <tr
        className={`w-full px-2  grid  border-b-[1px] grid-cols-${colSpan} gap-x-8 items-center py-5  justify-items-center`}
      >
        {headerColSpan.map((hdr, hdrIndex) => (
          <td key={hdrIndex} className={`col-span-1 text-sm ${hdr.toLowerCase() === "products" ? " overflow-auto h-[40px] bg-[var(--light-background)] py-1 rounded shadow-inner px-2 " : ""} `}>
            {hdr.toLowerCase() === "image" ? (
              <div className="w-[60px] h-[50px]">
                <img className="w-full h-full rounded" src={row.image} alt="" />
              </div>
            ) : hdr.toLowerCase() === "sn" || hdr.toLowerCase() === "orderid" ? (
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
              <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                  <button
                    className={` py-2 px-9 bg-[var(--color)] text-[var(--light-foreground)] rounded  duration-200`}
                  >
                    {row?.status}
                  </button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content className="relative bg-[var(--light-background)] w-[135px]  py-3 my-1 px-1 rounded flex flex-col items-start justify-center gap-2">
                    <DropdownMenu.Item className=" outline-none w-full cursor-pointer duration-150 rounded px-9 py-1.5 text-[15px] hover:text-[var(--light-foreground)] hover:bg-[#666]  ">
                      Recieved
                    </DropdownMenu.Item>
                    <DropdownMenu.Item className="outline-none w-full cursor-pointer duration-150 rounded px-9 py-1.5 text-[15px] hover:text-[var(--light-foreground)] hover:bg-[#666]  ">
                      Preparing
                    </DropdownMenu.Item>
                    <DropdownMenu.Item className="outline-none w-full cursor-pointer duration-150 rounded px-9 py-1.5 text-[15px] hover:text-[var(--light-foreground)] hover:bg-[#666]  ">
                      Completed
                    </DropdownMenu.Item>
                    <DropdownMenu.Item className="outline-none w-full cursor-pointer duration-150 rounded px-9 py-1.5 text-[15px] hover:text-[var(--light-foreground)] hover:bg-[#666]  ">
                      Canceled
                    </DropdownMenu.Item>
                    <div className="w-[10px] h-[10px] z-[-1] absolute top-[-5px] right-16 rotate-45  bg-[var(--light-background)] "></div>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            ) : (
              row[hdr.toLowerCase().replace(" ", "")]
            )}
          </td>
        ))}
      </tr>{" "}
    </React.Fragment>
  );
};
