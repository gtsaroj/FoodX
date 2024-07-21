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
  const [isChecked, setIsChecked] = useState<boolean>(onSelectAll);
  console.log(isChecked);

  function handleClick(value: string, uid: string) {
    onChange(value as string, uid as string);
  }
  useEffect(() => {
    setIsChecked(onSelectAll);
  }, [onSelectAll]);
  console.log(data);
  return (
    <React.Fragment>
      <tr
        style={bodyStyle}
        className={`w-full px-2  grid  border-b-[1px] gap-x-8 items-center py-5  justify-items-center`}
      >
        {headers.map((hdr, hdrIndex) => (
          <td key={`${hdr}-${hdrIndex}`} className={`col-span-1 text-sm`}>
            {hdr.toLowerCase() === "image" ? (
              <div className="w-[60px] h-[50px]">
                <img
                  className="w-full h-full rounded"
                  src={data.image}
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
                onSelect={(value: string) => handleClick(value, data.orderId)}
                style={{
                  padding: "0.5rem 3rem",
                  background: "var(--green-bg)",
                  borderRadius: "4px",
                  fontWeight: 500,
                  color: "var(--light-text)",
                }}
                options={
                  options?.includes(data?.status)
                    ? options.filter((option) => option !== data?.status)
                    : options
                }
                children={data.status}
              />
            ) : hdr === "email" ? (
              data["email"].replace("@texascollege.edu.np", "...")
            ) : (
              data[hdr]
            )}
          </td>
        ))}
      </tr>
    </React.Fragment>
  );
};
