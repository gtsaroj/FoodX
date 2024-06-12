import React, { ReactNode } from "react";
import { TableHeader } from "./TableHeader";
import { TableRowComponent } from "./TableRow";
import { HeaderProp } from "../../../Pages/FoodTable";

interface TableProp {
  headers: string[];
  data: HeaderProp[];
  width: string;
  onCheckBoxChange: (
    rowIndex: number,
    colName: string,
    checked: boolean
  ) => void;
  colSpan: string;
}

export const Table: React.FC<TableProp> = ({
  data,
  headers,
  onCheckBoxChange,
  colSpan,
  width,
}) => {
  console.log(data);
  return (
    <div className="w-full overflow-auto">
          <table className={`w-${width} sm:w-full border-[1px] rounded flex flex-col`}>
      <TableHeader header={headers} colSpan={colSpan} />
      <tbody className="w-full">
        {data?.map((row, rowIndex) => (
          <TableRowComponent
            headerColSpan={headers}
            row={row}
            rowIndex={rowIndex}
            oncheckBoxChange={onCheckBoxChange}
            key={rowIndex}
            colSpan={colSpan}
          />
        ))}
      </tbody>
    </table>
 </div>
  );
};
