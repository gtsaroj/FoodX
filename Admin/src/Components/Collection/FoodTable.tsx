import React, { useEffect, useState } from "react";
import Table from "../Common/Table/Table";
import data from "../../data.json";
import { getProducts } from "../../Services";
import { ProductType } from "../../models/productMode";

const FoodTable: React.FC = () => {
  const { headers, foodData } = data;
  const [fetchedProducts, setFetchedProducts] = useState<ProductType[]>([]);
  const [productsHeader, setProductsHeader] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const products = await getProducts();
      const allProducts = await products.data;
      setFetchedProducts(allProducts.products);
    })();
  }, []);


  const handleCheckboxChange = (
    rowIndex: number,
    colName: string,
    checked: boolean
  ) => {
    console.log(rowIndex, colName, checked);
  };

  useEffect(() => {
    if (fetchedProducts?.length > 0) {
      const headers = Object.keys(fetchedProducts[0]);
      headers.push("Button")
      setProductsHeader(headers);
    }
  }, [fetchedProducts]);
   console.log(productsHeader)

  return (
    <Table
      pagination={{ currentPage: 1, perPage: 7 }}
      width="500px"
      colSpan={"7"}
      headers={productsHeader}
      data={fetchedProducts}
      onCheckBoxChange={handleCheckboxChange}
    />
  );
};

export default FoodTable;
