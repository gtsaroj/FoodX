import React from "react";
import { CircleEllipsis } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import "./Table.css";
import Pagination from "../Pagination/Pagination";

interface TableRowProps {
  row: any;
  headerColSpan: string[];
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
}) => {
  return (
    <React.Fragment>
      <tr
        className={`w-full px-2  grid  border-b-[1px] grid-cols-${colSpan} gap-x-8 items-center py-5  justify-items-center`}
      >
        {headerColSpan.map((hdr, hdrIndex) => (
          <td key={hdrIndex} className="col-span-1 text-center text-sm">
            {hdr.toLowerCase() === "image" ? (
              <div className="w-[60px] h-[50px]">
                <img className="w-full h-full rounded" src={row.image} alt="" />
              </div>
            ) : hdr.toLowerCase() === "sn" ? (
              rowIndex + 1
            ) : hdr.toLowerCase() === "checkbox" ? (
              <input className="w-4 cursor-pointer h-4" type="checkbox" />
            ) : hdr.toLowerCase() === "button" ? (
              <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                  <button className=" hover:text-red-600 duration-200">
                    <CircleEllipsis strokeWidth={2} className="size-7 " />
                  </button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content className=" relative bg-[var(--light-background)] w-[120px]  py-1 px-1 rounded flex flex-col items-start justify-center gap-2">
                    <DropdownMenu.Item className=" outline-none w-full cursor-pointer duration-150 rounded py-1.5 px-5 text-sm hover:text-[var(--light-foreground)] hover:bg-[var(--primary-color)] ">
                      Delete
                    </DropdownMenu.Item>
                    <DropdownMenu.Item className=" outline-none w-full cursor-pointer duration-150 rounded py-1.5 px-5 text-sm hover:text-[var(--light-foreground)] hover:bg-[var(--primary-color)] ">
                      Edit
                    </DropdownMenu.Item>
                    <div className="w-[10px] h-[10px] z-[-1] absolute top-[-5px] right-14 rotate-45  bg-[var(--light-background)] "></div>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            ) : hdr.toLowerCase() === "status" ?               <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <button className={` py-2 px-9 bg-[var(--color)] text-[var(--light-foreground)] rounded  duration-200`}>
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
          </DropdownMenu.Root> :  (
              row[hdr.toLowerCase().replace(" ", "")].replace(
                "gmail.com",
                "..."
              )
            )
            }
          </td>
        ))}
      </tr>
    </React.Fragment>
  );
};
