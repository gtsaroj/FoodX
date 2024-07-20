import React, { CSSProperties, useEffect, useState } from "react";
import { TableHeader } from "./TableHeader";
import { TableRowComponent } from "./TableRow";

import Pagination from "../Pagination/Pagination";
import { Order } from "../../../models/order.model";
import { CustomerType } from "../../../models/user.model";
import { ProductType } from "../../../models/productMode";

interface TableProp {
  options?: string[]; // button name
  loading?: boolean; //loading state
  error?: boolean;
  headers: string[]; // headers value
  style?: React.CSSProperties;
  actions?: (rowData: string) => void; //delete or edit single row data
  data: [] | CustomerType[] | Order[] | ProductType[];
  headerStyle?: React.CSSProperties;
  bodyStyle?: React.CSSProperties;
  onChange?: (value: boolean | string, id: string) => void; //select or delete single row data
  onSelectAll?: (checked: boolean) => void; // for select all values
  pagination: { perPage: number; currentPage: 1 };
}

const Table: React.FC<TableProp> = ({
  onChange,
  options,
  loading,
  error,
  onSelectAll,
  data,
  actions,
  headers,
  headerStyle,
  bodyStyle,
  pagination = { perPage: 3, currentPage: 1 },
}) => {
  const [currentPage, setCurrentPage] = useState<number>(
    pagination.currentPage
  );
  const [currentDatas, setCurrentDatas] = useState<Order[]>([]);
  const [isCheckedAll, setIsCheckedAll] = useState<boolean>(false);

  const onChangePage = (page: number) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * pagination.perPage;
  const endIndex = startIndex + pagination.perPage;

  useEffect(() => {
    const currentData: any = data.slice(startIndex, endIndex);
    setCurrentDatas(currentData as any[]);
  }, [data, startIndex, endIndex]);

  const handleSelectAll = (checked: boolean) => {
    setIsCheckedAll(checked);
    onSelectAll(checked);
  };

  //

  return error ? (
    <div>Error</div>
  ) : loading ? (
    <div>Loading...</div>
  ) : data ? (
    <div className="flex flex-col items-end justify-center w-full gap-2 ">
      <div className="w-full overflow-auto">
        <table
          className={` sm:w-full w-[800px] border-[1px] rounded flex flex-col`}
        >
          <TableHeader
            onSelectAll={handleSelectAll}
            header={headers}
            headerStyle={headerStyle as CSSProperties}
          />
          <tbody className="w-full">
            {currentDatas?.map((row, rowIndex) => (
              <TableRowComponent
                onSelectAll={isCheckedAll}
                onChange={onChange}
                actions={(value) => {
                  actions(value);
                }}
                options={options}
                headers={headers}
                data={row}
                dataIndex={rowIndex}
                bodyStyle={bodyStyle as CSSProperties}
                key={rowIndex}
              />
            ))}
          </tbody>
        </table>
      </div>
      <div className="items-center justify-center w-full">
        <Pagination
          onChange={onChangePage}
          currentPage={currentPage}
          perPage={pagination?.perPage}
          totalData={data?.length}
        />
      </div>
    </div>
  ) : (
    "Not found"
  );
};

export default Table;
