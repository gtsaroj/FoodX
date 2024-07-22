import React from "react";
import Table from "../Common/Table/Table";
import data from "../../data.json";

export const BannerTable: React.FC = () => {
  const { Banners, BannerData } = data;

  return (
    <Table
      error={false}
      loading={false}
      pagination={{ currentPage: 1, perPage: 5 }}
      headerStyle={{ gridTemplateColumns: "repeat(6,1fr)" }}
      bodyStyle={{ gridTemplateColumns: "repeat(6,1fr)" }}
      headers={Banners}
      data={BannerData as any}
    />
  );
};
