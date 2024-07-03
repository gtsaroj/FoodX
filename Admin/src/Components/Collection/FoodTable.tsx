import React, { useState } from "react";
import  Table  from "../Common/Table/Table";
import data from "../../data.json";

const FoodTable: React.FC = () => {
  const { headers, foodData } = data;

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
      colSpan={"6"}
      headers={headers}
      data={foodData}
      onCheckBoxChange={handleCheckboxChange}
    />
  );
};

export default FoodTable;
