import React, { useEffect, useState } from "react";
import "./Table.css";
import { Order } from "../../../models/order.model";
import { DropDown } from "../DropDown/DropDown";
import { Button, StatusButton } from "../Filter/Filter";

interface TablerowProps {
  options?: string[];
  data: Order | any;
  headers: string[];
  bodyStyle: React.CSSProperties;
  actions: (data: string, actionType?: string) => void;
  dataIndex: number;
  onChange?: (value: boolean | string, id: string) => void;
  onSelectAll: boolean;
}

export const TableRowComponent: React.FC<TablerowProps> = ({
  options,
  data,
  dataIndex,
  onChange,
  headers,
  bodyStyle,
  actions,
  onSelectAll,
}) => {
  const [isChecked, setIsChecked] = useState<boolean>(onSelectAll);
  const [viewId, setViewId] = useState<string>(`#${data?.ID?.substring(0, 8)}`);

  function handleClick(value: string, uid: string) {
    if (!onChange) return;
    onChange(value as string, uid as string);
  }
  useEffect(() => {
    setIsChecked(onSelectAll);
  }, [onSelectAll]);
  const status = options?.includes(data?.Status)
    ? options.filter((option) => option !== data?.Status)
    : options;
  return (
    <React.Fragment>
      <tr
        style={bodyStyle}
        className={`w-full  grid  justify-items-start px-4 border-b-[1px] gap-x-5 items-center py-3.5 hover:bg-[var(--light-background)] duration-150  `}
      >
        {headers.map((hdr, hdrIndex) => (
          <td
            key={`${hdr}-${hdrIndex}`}
            className={` text-[16px] col-span-1  ${
              hdr === "Name" ? "text-start col-span-2" : ""
            } ${hdr == "Button" ? "col-span-2" : ""} 
            } text-center  ${
              hdr === "Product" ? "col-span-2 " : ""
            } `}
          >
            {/* Image */}
            {hdr.toLowerCase() === "sn" || //orderID
            hdr.toLowerCase() === "orderid" ? (
              dataIndex + 1
            ) : //checkbox
            hdr.toLowerCase() === "checkbox" ? (
              <input
                checked={isChecked}
                onChange={(event) => {
                  if (event.target) {
                    setIsChecked(event.target.checked);
                    if (!onChange) return;
                    onChange(
                      event.target.checked as boolean,
                      data.ID as string
                    );
                  }
                }}
                className="w-4 cursor-pointer h-4"
                type="checkbox"
              /> //button & actions
            ) : hdr.toLowerCase() === "button" ? (
              <div className="flex items-center justify-center gap-5">
                <Button
                  value={data.ID}
                  onClick={(value, actionType) => actions(value, actionType)}
                  type="Edit"
                />
                <Button
                  value={data.ID}
                  onClick={(value, actionType) => actions(value, actionType)}
                  type="Delete"
                />
              </div>
            ) : hdr.toLowerCase() === "status" ? (
              //Dropdown
              <DropDown
                onSelect={(value: string) => handleClick(value, data.ID)}
                style={{
                  padding: "0.5rem 3rem",
                  background: "var(--green-bg)",
                  fontWeight: 500,
                  color: "var(--light-text)",
                }}
                options={[
                  <StatusButton
                    uid={data.ID}
                    onClick={(type: string, uid: string) => {
                      if (!onChange) return;
                      onChange(type, uid);
                    }}
                    type={status as string[]}
                  />,
                ]}
                children={data.Status}
              />
            ) : //id
            hdr.toLowerCase() === "id" ? (
              <button
                className="relative group/id hover:underline duration-150 text-sm text-[var(--dark-secondary-text)] "
                onClick={() => {
                  data.ID === viewId;
                  setViewId(`#${data.ID.substring(0, 8)}`);
                }}
              >
                {viewId}
                <div className=" top-[-27px] group-hover/id:visible opacity-0 group-hover/id:opacity-[100] duration-150 invisible left-[-20px] absolute bg-[var(--light-foreground)] p-1 rounded shadow ">
                  {data.ID}
                </div>
              </button>
            ) : hdr === "Name" ? (
              <div className="flex items-start gap-2 justify-center">
                <div className="w-[40px] h-[40px]">
                  <img
                    src={data.Image}
                    className="w-full h-full rounded-full"
                    alt=""
                  />
                </div>
                <div className="flex flex-col items-start justify-center">
                  <h2 className="text-[15px] font-[600] ">{data.Name} </h2>
                  <span className="text-sm text-[var(--dark-secondary-text)] ">
                    {data.Email}{" "}
                  </span>
                </div>
              </div>
            ) : hdr === "Product" ? (
              <div className="flex items-center gap-2 justify-center">
                <div className="w-[40px] h-[40px]">
                  <img
                    src={data.Image}
                    className="w-full h-full rounded-full"
                    alt=""
                  />
                </div>
                <h2 className="text-[15px] font-[600] ">{data.Product} </h2>
              </div>
            ) : (
              data[hdr]
            )}
          </td>
        ))}
      </tr>
    </React.Fragment>
  );
};
