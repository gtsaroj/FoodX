import React, { useState } from "react";
import { TableHeader } from "./TableHeader";
import { TableRowComponent } from "./TableRow";
import { HeaderProp } from "../../Collection/FoodTable";
import Pagination from "../Pagination/Pagination";

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
  pagination: { perPage: number; currentPage: 1 };
}

export const Table: React.FC<TableProp> = ({
  data,
  headers,
  onCheckBoxChange,
  colSpan,
  width,
  pagination = { perPage: 3, currentPage: 1 },
}) => {
  const [currentPage, setCurrentPage] = useState<number>(
    pagination.currentPage
  );

  const onChangePage = (page: number) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * pagination.perPage;
  const endIndex = startIndex + pagination.perPage;

  const currentData = data.slice(startIndex, endIndex);
  return (
    <div className=" w-full flex flex-col items-end gap-2 justify-center">
      <div className="w-full overflow-auto">
        <table
          className={`w-${width} sm:w-full border-[1px] rounded flex flex-col`}
        >
          <TableHeader header={headers} colSpan={colSpan} />
          <tbody className="w-full">
            {currentData?.map((row, rowIndex) => (
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
      <div className="w-full justify-center items-center">
        <Pagination
          onChange={onChangePage}
          currentPage={currentPage}
          perPage={pagination?.perPage}
          totalData={data.length}
        />
      </div>
    </div>
  );
};
