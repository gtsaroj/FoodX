import React from "react";
import Table from "../Common/Table/Table";
import data from "../../data.json";

export const BannerTable: React.FC = () => {
  const { Banners, BannerData } = data;

  const handleCheckboxChange = (
    rowIndex: number,
    colName: string,
    checked: boolean
  ) => {
    console.log(rowIndex, colName, checked);
  };

  return (
    <Table
      error={false}
      loading={false}
      pagination={{ currentPage: 1, perPage: 5 }}
      headerStyle={{ gridTemplateColumns: "repeat(6,1fr)" }}
      bodyStyle={{ gridTemplateColumns: "repeat(6,1fr)" }}
      headers={Banners}
      data={BannerData as any}
      onCheckBoxChange={handleCheckboxChange}
    />
  );
};
