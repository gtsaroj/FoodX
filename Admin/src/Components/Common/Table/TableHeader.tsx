import React from "react";
import "./Table.css"

interface TableHeaderProp {
  header: string[];
  colSpan : string
  // onCheckBox: (rowIndex: number, colName: string, checked: boolean) => void;
}
`x`;
export const TableHeader: React.FC<TableHeaderProp> = ({ header,colSpan }) => {
  console.log(header);
  return (
    <React.Fragment>
      <thead className="w-full bg-[var(--light-background)] py-5 border-b-[1px]">
        <tr className={`w-full grid  justify-items-center justify-center items-center grid-cols-${colSpan}`}>
          {header.map((hd, index) => (
            <td key={index} className="col-span-1">
              {hd}
            </td>
          ))}
        </tr>
      </thead>
    </React.Fragment>
  );
};
