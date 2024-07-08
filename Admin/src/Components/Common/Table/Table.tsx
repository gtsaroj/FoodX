import React, { useEffect, useState } from "react";
import { TableHeader } from "./TableHeader";
import { TableRowComponent } from "./TableRow";
import { HeaderProp } from "../../Collection/FoodTable";
import Pagination from "../Pagination/Pagination";
import { Order } from "../../../models/order.model";
import { convertTimestampToDate } from "../../../Utility/DateUtils";
import { CustomerType } from "../../../models/user.model";

interface TableProp {
  option: (value: string, uid: string) => void;
  options?: string[];
  loading: boolean;
  headers: string[];
  actions: (rowData: string) => void;
  data: HeaderProp[] | [] | CustomerType[];
  width: string;
  onCheckBoxChange: (
    rowIndex: number,
    colName: string,
    checked: boolean
  ) => void;
  colSpan: string;
  pagination: { perPage: number; currentPage: 1 };
}

const Table: React.FC<TableProp> = ({
  option,
  options,
  loading,
  data,
  actions,
  headers,
  onCheckBoxChange,
  colSpan,
  width,
  pagination = { perPage: 3, currentPage: 1 },
}) => {
  const [currentPage, setCurrentPage] = useState<number>(
    pagination.currentPage
  );
  const [currentDatas, setCurrentDatas] = useState<Order[]>([]);

  const onChangePage = (page: number) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * pagination.perPage;
  const endIndex = startIndex + pagination.perPage;

  useEffect(() => {
    const currentData: Order[] = data.slice(startIndex, endIndex);
    setCurrentDatas(currentData as any[]);
  }, [data, startIndex, endIndex]);

  //

  return (
    <div className=" w-full flex flex-col items-end gap-2 justify-center">
      <div className="w-full overflow-auto">
        <table
          className={`w-${width} sm:w-full border-[1px] rounded flex flex-col`}
        >
          <TableHeader header={headers} colSpan={colSpan} />
          <tbody className="w-full">
            {currentDatas?.map((row, rowIndex) => (
              <TableRowComponent
                option={option}
                actions={(value) => {
                  actions(value);
                }}
                options={options}
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
          totalData={data?.length}
        />
      </div>
    </div>
  );
};

export default Table;
