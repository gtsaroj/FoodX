import React from "react";
import { CircleEllipsis } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import "./Table.css"

interface TableRowProps {
  row: any;
  headerColSpan: string[];
  colSpan: string;
  rowIndex: number;
  oncheckBoxChange: (
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
  const getGridCols = () => `grid-cols-${colSpan}`;
  console.log(getGridCols())
  return (
    <React.Fragment>
      <tr
        className={`w-full px-2  grid  border-b-[1px] grid-cols-${colSpan} gap-x-8 items-center py-5  justify-items-center`}
      >
        {headerColSpan.map((hdr, hdrIndex) => (
          <td key={hdrIndex}   className="col-span-1 text-center text-sm">
            {hdr.toLowerCase() === "image" ? (
              <div className="w-[60px] h-[50px]">
                <img className="w-full h-full rounded" src={row.image} alt="" />
              </div>
            ) : hdr.toLowerCase() === "sn" ? (
              rowIndex + 1
            ) : (
              row[hdr.toLowerCase().replace(" ", "")]
            )}
          </td>
        ))}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <button className=" hover:text-red-600 duration-200">
              <CircleEllipsis strokeWidth={2} className="size-7 " />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content className=" relative bg-[var(--light-background)] w-[100px]  py-1 px-1 rounded flex flex-col items-start justify-center gap-2">
              <DropdownMenu.Item className=" w-full cursor-pointer duration-150 rounded px-5 text-sm hover:text-[var(--light-foreground)] hover:bg-[var(--primary-color)] ">
                Delete
              </DropdownMenu.Item>
              <DropdownMenu.Item className=" w-full cursor-pointer duration-150 rounded px-5 text-sm hover:text-[var(--light-foreground)] hover:bg-[var(--primary-color)] ">
                Edit
              </DropdownMenu.Item>
              <div className="w-[10px] h-[10px] z-[-1] absolute top-[-5px] right-11 rotate-45  bg-[var(--light-background)] "></div>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </tr>
    </React.Fragment>
  );
};
