import React from "react";
import { Table } from "../Common/Table/Table";
import data from "../../data.json";

export const CategoryTable: React.FC = () => {
  const { category,  categoryData} = data;

  const handleCheckboxChange = (
    rowIndex: number,
    colName: string,
    checked: boolean
  ) => {
    console.log(rowIndex, colName, checked);
  };

  return (
    <Table
      pagination={{currentPage : 1 , perPage:5}}
      width="500px"
      colSpan={"5"}
      headers={category}
      data={categoryData}
      onCheckBoxChange={handleCheckboxChange}
    />
  );
};
