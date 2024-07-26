import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import Pagination from "../Pagination/Pagination";
import { useEffect, useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-namespace
export declare namespace Table {
  interface TableModalProps<T> {
    data: Array<T>;
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
    editFn?: (id: string) => void;
    deleteFn?: (id: string) => void;
    viewFn?: (id: string) => void;
  }
  export interface ColumnProps {
    fieldName: string;
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
  pagination = { perPage: 2, currentPage: 1 },
}: Table.TableModalProps<T>): React.ReactElement {
  const [currentPage, setCurrentPage] = useState<number>(
    pagination.currentPage as number
  );
  const [currentData, setCurrentData] = useState();

  useEffect(() => {
    const startIndex =
      ((currentPage|| 1) - 1) * (pagination?.perPage || 2);
    const endIndex = startIndex + (pagination?.perPage || 2);
    const paginateData = data?.slice(startIndex, endIndex) as any;
    setCurrentData(paginateData);
  }, [pagination.currentPage, pagination.perPage, data,currentPage]);

  const handlePageChange = (page: number) => {
    if (onPageChange) {
      setCurrentPage(page);
      onPageChange(page);
    }
  };
  return (
    <div className="w-full flex items-center justify-center text-gray-400 border-collapse overflow-auto rounded my-6 ">
      <table className="w-full border-collapse max-w-[1500px] flex flex-col items-center justify-center  gap-2">
        <thead className="w-full px-2 bg-[var(--light-background)] ">
          <tr className="w-full border-b flex justify-start gap-5 items-center  flex-nowrap ">
            {columns.map((item, index) => (
              <th
                style={item.colStyle}
                className="flex items-center justify-center font-bold  py-5 "
                key={index}
              >
                {item.fieldName}
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
            "Loading..."
          ) : (
            <>
              {currentData &&
                currentData.map((item, index) => (
                  <tr
                    className=" border-b px-2 py-4 hover:bg-[var(--light-background)]  w-full flex items-center justify-start gap-5  flex-nowrap"
                    key={(item?.id && item.id) || index}
                  >
                    {columns?.map(({ _, render }, index) => (
                      <td className="table-body-content" key={index}>
                        {render(item)}
                      </td>
                    ))}
                    {!!actions?.editFn && !disableActions && (
                      <td
                        className="w-[100px]"
                        onClick={() => {
                          actions?.editFn && actions?.editFn(item.id);
                        }}
                      >
                        <div className="flex  items-center bg-[var(--primary-color)] cursor-pointer hover:bg-[var(--primary-light)] justify-start p-2 px-3 rounded-lg tracking-wide text-[var(--light-text)] gap-2">
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
                totalData={data.length}
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