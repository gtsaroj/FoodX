import React from "react";
import  Table  from "../Common/Table/Table";
import data from "../../data.json";

export const BannerTable: React.FC = () => {
  const { Banners,  BannerData} = data;

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
      headers={Banners}
      data={BannerData}
      onCheckBoxChange={handleCheckboxChange}
    />
  );
};
