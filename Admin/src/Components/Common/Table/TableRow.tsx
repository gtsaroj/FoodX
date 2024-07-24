import React, { useEffect, useState } from "react";
import { EllipsisVertical } from "lucide-react";
import "./Table.css";
import { Order } from "../../../models/order.model";
import { DropDown } from "../DropDown/DropDown";
import { Button, StatusButton } from "../Filter/Filter";
import { spawn } from "child_process";

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
  const [isChecked, setIsChecked] = useState<boolean>(onSelectAll);
  const [viewId, setViewId] = useState<string>(data?.ID?.substring(0, 5));

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
            className={`col-span-1 ${hdr == "Button" ? "col-span-2" : ""} ${
              hdr === "Email" ? "col-span-2 text-center w-full" : "col-span-1"
            } text-center text-sm ${
              hdr === "Products" ? "col-span-2 text-center w-full" : ""
            } `}
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
                    if (!onChange) return;
                    onChange(
                      event.target.checked as boolean,
                      data.ID as string
                    );
                  }
                }}
                className="w-4 cursor-pointer h-4"
                type="checkbox"
              />
            ) : hdr.toLowerCase() === "button" ? (
              <div className="flex items-center justify-center gap-5">
                <Button type="Edit" />
                <Button
                  value={data.ID}
                  onClick={(value) => actions(value)}
                  type="Delete"
                />
              </div>
            ) : hdr.toLowerCase() === "status" ? (
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
