import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import Pagination from "../Pagination/Pagination";
import React, { ChangeEvent, useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

// eslint-disable-next-line @typescript-eslint/no-namespace
export declare namespace Table {
  interface TableModalProps<T> {
    data: Array<T>;
    totalData: number,
    selectedData?: Array<T>;
    columns: ColumnProps[];
    actions?: TableActions;
    loading?: boolean;
    headStyle?: React.CSSProperties;
    actionIconColor?: string;
    bodyHeight?: number;
    pagination?: {
      perPage?: number;
      currentPage?: number;
    };
    disableNoData?: boolean;
    onPageChange?: (page: number) => void;
    disableActions?: boolean;
  }
  interface TableActions {
    checkAllFn?: (isChecked: boolean) => void;
    editFn?: (id: string) => void;
    deleteFn?: (id: string) => void;
    viewFn?: (id: string) => void;
    checkFn?: (id: string, isChecked: boolean) => void;
  }
  export interface ColumnProps {
    fieldName: string | React.ReactNode;
    colStyle?: React.CSSProperties;
    render?: (item: any) => React.ReactNode;
  }
}

function Table<T extends { id: string }>({
  data,
  columns,
  actionIconColor,
  actions,
  bodyHeight,
  disableActions,
  disableNoData,
  loading,
  onPageChange,
  selectedData,
  totalData,
  pagination = { perPage: 2, currentPage: 1 },
}: Table.TableModalProps<T>): React.ReactElement {

  const [currentPage, setCurrentPage] = useState<number>(
    pagination.currentPage as number
  );
  const [currentData, setCurrentData] = useState<any[]>();

  useEffect(() => {
    const startIndex = ((currentPage || 1) - 1) * (pagination?.perPage || 2);
    const endIndex = startIndex + (pagination?.perPage || 2);
    const paginateData = data?.slice(startIndex, endIndex) as any;
    setCurrentData(paginateData);
  }, [pagination.currentPage, pagination.perPage, data, currentPage]);

  const handlePageChange = (page: number) => {
    if (onPageChange) {
      setCurrentPage(page);
      onPageChange(page);
    }
  };
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const isCheckedData = selectedData?.map((data) => data.id);

  return (
    <div className="w-full flex items-center justify-center text-gray-400 border-collapse overflow-auto rounded ">
      <table className="w-full relative border-collapse max-w-[1500px] flex flex-col items-center justify-center  gap-2">
        <thead className="w-full px-2 bg-[var(--light-background)] ">
          <tr className="w-full border-b flex justify-start gap-5 items-center overflow-auto  ">
            {!!actions?.checkFn && !disableActions && (
              <th className="w-[30px]">
                <input
                  onChange={(event) => {
                    if (!actions.checkAllFn) return;
                    actions.checkAllFn(event.target.checked);
                    setIsChecked(event.target.checked);
                  }}
                  className="w-4 h-4 cursor-pointer"
                  type="checkbox"
                />
              </th>
            )}
            {columns.map((item, index) => (
              <th
                className="flex items-center  justify-center font-bold  py-5 "
                key={index}
              >
                {typeof item.fieldName === "string" ? (
                  <div style={item.colStyle}> {item.fieldName}</div>
                ) : React.isValidElement(item.fieldName) ? (
                  item.fieldName
                ) : (
                  ""
                )}
              </th>
            ))}
            {!!actions?.editFn && !disableActions && (
              <th className="w-[100px]"></th>
            )}
            {!!actions?.deleteFn && !disableActions && (
              <th className="w-[100px]"></th>
            )}
            {!!actions?.viewFn && !disableActions && (
              <th className="w-[100px]">View</th>
            )}
          </tr>
        </thead>
        <tbody
          className="w-full flex items-center justify-evenly flex-col flex-nowrap"
          style={{
            overflow: "auto",
          }}
        >
          {loading ? (
            <tr className="w-full ">
              <Skeleton
                height={100}
                baseColor="var(--light-background)"
                highlightColor="var(--light-foreground)"
                count={1}
              />
              <Skeleton
                height={80}
                baseColor="var(--light-background)"
                highlightColor="var(--light-foreground)"
                count={3}
              />
            </tr>
          ) : (
            <>
              {currentData &&
                currentData.map((item, index) => (
                  <tr
                    className=" border-b  px-2 py-4 hover:bg-[var(--light-background)] overflow-auto  w-full flex items-center justify-start gap-5  flex-nowrap"
                    key={(item?.id && item.id) || index}
                  >
                    {!!actions?.checkFn && !disableActions && (
                      <th className="w-[30px]">
                        <input
                          
                          checked={isCheckedData?.includes(item.id)}
                          onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            actions.checkFn &&
                              actions.checkFn(item.id, event.target.checked);
                            setIsChecked(event.target.checked);
                          }}
                          className="w-4 h-4 cursor-pointer"
                          type="checkbox"
                        />
                      </th>
                    )}
                    {columns?.map(({ render }, index) => (
                      <td className="table-body-content" key={index}>
                        {render ? render(item) : "Default"}
                      </td>
                    ))}
                    {!!actions?.editFn && !disableActions && (
                      <td
                        className="w-[100px]"
                        onClick={() => {
                          actions?.editFn && actions?.editFn(item.id);
                        }}
                      >
                        <div className="flex  items-center bg-[var(--primary-color)] cursor-pointer hover:bg-[var(--primary-light)] justify-center p-2 px-3  rounded-lg tracking-wide text-[var(--light-text)] gap-2">
                          <FaEdit />
                          <span className="text-[16px]  tracking-wide">
                            Edit
                          </span>
                        </div>
                      </td>
                    )}
                    {!!actions?.deleteFn && !disableActions && (
                      <td
                        className="w-[100px]"
                        onClick={() => {
                          actions?.deleteFn && actions?.deleteFn(item.id);
                        }}
                      >
                        <div className="flex  items-center bg-[var(--danger-bg)] cursor-pointer hover:bg-[var(--danger-text)] justify-start p-2  px-3 rounded-lg tracking-wide text-[var(--light-text)] gap-2">
                          <FaTrash />
                          <span className="text-[16px]  tracking-wide ">
                            Delete
                          </span>
                        </div>
                      </td>
                    )}
                    {!!actions?.viewFn && !disableActions && (
                      <td
                        className="table-body-content"
                        onClick={() => {
                          actions?.viewFn && actions?.viewFn(item.id);
                        }}
                      >
                        <div
                          className="table-body-content-btns"
                          style={{
                            color: actionIconColor ? actionIconColor : "red",
                          }}
                        >
                          <FaEye />
                          <span className="text-sm text-[var(--dark-text)] ">
                            View
                          </span>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
            </>
          )}
        </tbody>
        <tfoot>
          <tr>
            <td>
              <Pagination
                totalData={totalData}
                perPage={pagination?.perPage || 2}
                currentPage={currentPage || 1}
                onChange={handlePageChange}
              />
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default Table;
