import React, { useEffect, useState } from "react";
import { EllipsisVertical } from "lucide-react";
import "./Table.css";
import { Order } from "../../../models/order.model";
import { DropDown } from "../DropDown/DropDown";

interface TablerowProps {
  options?: string[];
  data: Order | any;
  headers: string[];
  bodyStyle: React.CSSProperties;
  actions: (data: string) => void;
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
  console.log(data)
  const [isChecked, setIsChecked] = useState<boolean>(onSelectAll);
  const [viewId, setViewId] = useState<string>(data?.ID?.substring(0, 5));

  function handleClick(value: string, uid: string) {
    console.log(value,uid)
    onChange(value as string, uid as string);
  }
  useEffect(() => {
    setIsChecked(onSelectAll);
  }, [onSelectAll]);

 
  return (
    <React.Fragment>
      <tr
        style={bodyStyle}
        className={`w-full  grid  justify-items-start px-4 border-b-[1px] gap-x-8 items-center py-3.5 hover:bg-[var(--light-background)] duration-150  `}
      >
        {headers.map((hdr, hdrIndex) => (
          <td
            key={`${hdr}-${hdrIndex}`}
            className={`col-span-1 ${
              hdr === "Email" ? "col-span-2 text-center w-full" : "col-span-1"
            } text-center text-sm ${hdr === "Products" ? "col-span-2 text-center w-full" :""} `}
          >
            {hdr.toLowerCase() === "image" ? (
              <div className="w-[40px] h-[40px]">
                <img
                  className="w-full h-full rounded-full"
                  src={data.Image}
                  alt=""
                />
              </div>
            ) : hdr.toLowerCase() === "sn" ||
              hdr.toLowerCase() === "orderid" ? (
              dataIndex + 1
            ) : hdr.toLowerCase() === "checkbox" ? (
              <input
                checked={isChecked}
                onChange={(event) => {
                  if (event.target) {
                    setIsChecked(event.target.checked);
                    onChange(
                      event.target.checked as boolean,
                      data.id as string
                    );
                  }
                }}
                className="w-4 cursor-pointer h-4"
                type="checkbox"
              />
            ) : hdr.toLowerCase() === "button" ? (
              <DropDown
                onSelect={(value) => {
                  actions(value);
                }}
                style={{}}
                value={data["orderId"]}
                options={["Edit", "Delete"]}
                children={
                  <EllipsisVertical className="size-6 duration-150 hover:text-[var(--danger-bg)] " />
                }
              />
            ) : hdr.toLowerCase() === "status" ? (
              <DropDown
                onSelect={(value: string) => handleClick(value, data.ID)}
                style={{
                  padding: "0.5rem 3rem",
                  background: "var(--green-bg)",
                  borderRadius: "4px",
                  fontWeight: 500,
                  color: "var(--light-text)",
                }}
                options={
                  options?.includes(data?.Status)
                    ? options.filter((option) => option !== data?.Status)
                    : options
                }
                children={data.Status}
              />
            ) : hdr === "email" ? (
              data["email"].replace("@texascollege.edu.np", "...")
            ) : hdr.toLowerCase() === "id" ? (
              <button
                className="hover:underline duration-150"
                onClick={() => {
                  if (data.ID !== viewId) setViewId(data.ID);
                  else if (data.ID === viewId)
                    setViewId(data.ID.substring(0, 5));
                }}
              >
                {" "}
                {viewId}
              </button>
            ) : (
              data[hdr]
            )}
          </td>
        ))}
      </tr>
    </React.Fragment>
  );
};
