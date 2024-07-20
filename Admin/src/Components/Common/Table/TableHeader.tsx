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
      <thead className="w-full bg-[var(--light-background)] py-5 border-b-[1px]">
        <tr
          style={headerStyle}
          className={`w-full grid  justify-items-center justify-center items-center `}
        >
          {header.map((hd, index) =>
            hd.toLowerCase() === "checkbox" ? (
              <th key={index}>
                <input
                  onChange={(event) => onSelectAll(event.target.checked)}
                  className="w-4 cursor-pointer h-4"
                  type="checkbox"
                />
              </th>
            ) : hd.toLowerCase() === "button" ? (
              ""
            ) : (
              <th key={index} className="col-span-1">
                {hd}
              </th>
            )
          )}
        </tr>
      </thead>
    </React.Fragment>
  );
};
