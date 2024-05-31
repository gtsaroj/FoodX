import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import Loader from "../loader/loader.component";
import Pagination from "../pagination/pagination.common";

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
  const startIndex =
    ((pagination?.currentPage || 1) - 1) * (pagination?.perPage || 2);
  const endIndex = startIndex + (pagination?.perPage || 2);
  const currentData = data?.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (onPageChange) {
      onPageChange(page);
    }
  };
  return (
    <div className="table-container">
      <table className="table">
        <thead className="table-head">
          <tr className="table-head-row">
            {columns.map((item: any, index: number) => (
              <th className="table-head-cell" key={index}>
                {item as string}
              </th>
            ))}
            {!!actions?.editFn && !disableActions && (
              <th className="table-head-title">Edit</th>
            )}
            {!!actions?.deleteFn && !disableActions && (
              <th className="table-head-title">Delete</th>
            )}
            {!!actions?.viewFn && !disableActions && (
              <th className="table-head-title">View</th>
            )}
          </tr>
        </thead>
        <tbody
          className="table-body"
          style={{
            height: bodyHeight ? bodyHeight : "auto",
            overflow: "auto",
          }}
        >
          {loading ? (
            <Loader
              size={10}
              color="red"
              type="flow"
              variant="three"
              loading={loading}
              background={{ backgroundColor: "transparent" }}
            />
          ) : (
            <>
              {currentData &&
                currentData.map((item: any, index: number) => (
                  <tr
                    className="table-body-row"
                    key={(item?.id && item.id) || index}
                  >
                    {columns?.map((column: any, index: number) => (
                      <td className="table-body-content" key={index}>
                        {String(item[column])}
                      </td>
                    ))}
                    {!!actions?.editFn && !disableActions && (
                      <td
                        className="table-body-content"
                        onClick={() => {
                          actions?.editFn && actions?.editFn(item.id);
                        }}
                      >
                        <div
                          className="table-body-content-btns"
                          style={{
                            color: actionIconColor ? actionIconColor : "red",
                          }}
                        >
                          <FaEdit />
                        </div>
                      </td>
                    )}
                    {!!actions?.deleteFn && !disableActions && (
                      <td
                        className="table-body-content"
                        onClick={() => {
                          actions?.deleteFn && actions?.deleteFn(item.id);
                        }}
                      >
                        <div
                          className="table-body-content-btns"
                          style={{
                            color: actionIconColor ? actionIconColor : "red",
                          }}
                        >
                          <FaTrash />
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
                currentPage={pagination.currentPage || 1}
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

// {
//    <td className="table-body-content">{item}</td> */
// }
// {
//    <td className="table-body-content">{item.title}</td>
//                 <td className="table-body-content">
//                   Rs <span>{item.price}</span>
//                 </td>
//                 <td className="table-body-content">{item.quantity}</td>
//                 <td className="table-body-content">{item.category}</td>
//                 <td className="table-body-content">{item.description}</td>
// }
