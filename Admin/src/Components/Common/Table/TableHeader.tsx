import React from "react";
import "./Table.css";

interface TableHeaderProp {
  header: string[];
  headerStyle: React.CSSProperties;
  onSelectAll: (checked: boolean) => void;
  // onCheckBox: (rowIndex: number, colName: string, checked: boolean) => void;
}

export const TableHeader: React.FC<TableHeaderProp> = ({
  header,
  headerStyle,
  onSelectAll,
}) => {
  return (
    <React.Fragment>
      <thead className="w-full bg-[var(--light-background)] py-4 border-b-[1px]">
        <tr
          style={headerStyle}
          className={`w-full grid  gap-4  justify-items-start px-4 items-center `}
        >
          {header.map((hd, index) =>
            hd.toLowerCase() === "checkbox" ? (
              <th className={``} key={index}>
                <input
                  onChange={(event) => onSelectAll(event.target.checked)}
                  className="w-4 h-4 cursor-pointer"
                  type="checkbox"
                />
              </th>
            ) : hd.toLowerCase() === "button" ? (
              ""
            ) : hd == "Price" ? (
              <th>Unit Price</th>
            ) : hd == "Totalorder" ? (
              <th>Total ordered</th>
            ) : hd === "Product" ? (
              <th className="col-span-2 text-center">Product Name</th>
            ) : (
              <th
                key={index}
                className={`col-span-1 ${hd === "Name" ? "col-span-2" : ""} ${
                  hd === "Email"
                    ? "col-span-2 w-full text-center"
                    : "col-span-1"
                }`}
              >
                {hd}
              </th>
            )
          )}
        </tr>
      </thead>
    </React.Fragment>
  );
};
