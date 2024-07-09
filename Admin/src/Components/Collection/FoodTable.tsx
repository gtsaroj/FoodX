import React, { useEffect, useState } from "react";
import Table from "../Common/Table/Table";
import data from "../../data.json";
import { getProducts } from "../../Services";
import { ProductType } from "../../models/productMode";
import { deleteProductFromDatabase } from "../../firebase/order";
import { SearchProduct } from "../../Utility/Search";

interface FoodTableProp {
  userInput: string;
}

const FoodTable: React.FC<FoodTableProp> = ({ userInput }) => {
  const { headers, foodData } = data;
  const [fetchedProducts, setFetchedProducts] = useState<ProductType[]>([]);
  const [productsHeader, setProductsHeader] = useState<string[]>([]);
  const getAllProducts = async () => {
    const products = await getProducts();
    const allProducts = await products.data;
    setFetchedProducts(allProducts.products);
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  console.log(userInput?.length);

  const handleClick = async (id: string) => {
    console.log(id);
    try {
      await deleteProductFromDatabase(id);
      const refreshOrder = await getProducts();
      setFetchedProducts(refreshOrder.data.products);
    } catch (error) {
      throw new Error("Unable to delete order");
    }
  };

  useEffect(() => {
    if (fetchedProducts?.length > 0) {
      const headers = Object.keys(fetchedProducts[0]);
      headers.push("Button");
      setProductsHeader(headers);
    }
  }, [fetchedProducts]);

  useEffect(() => {
    (async () => {
      if (userInput.length > 0) {
        const getAllProducts = await getProducts();
        const filterProducts = SearchProduct(
          getAllProducts.data.products,
          userInput
        );
        setFetchedProducts(filterProducts as ProductType[]);
      } else {
        getAllProducts();
      }
    })();
  }, [userInput]);

  return (
    <Table
      pagination={{ currentPage: 1, perPage: 7 }}
      width="500px"
      colSpan={"7"}
      headers={productsHeader}
      data={fetchedProducts}
      actions={handleClick}
    />
  );
};

export default FoodTable;
