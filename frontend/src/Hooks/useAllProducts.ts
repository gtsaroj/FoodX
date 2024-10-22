import { useQuery } from "react-query";
import {
  getNormalProducts,
  getSpecialProducts,
} from "../Services/product.services";
import { Product } from "../models/product.model";

const getAllProducts = async (): Promise<Product[]> => {
  try {
    const [normalProducts, specialsProducts] = [
      await getNormalProducts(),
      await getSpecialProducts(),
    ];

    const products = [
      ...normalProducts.data,
      ...specialsProducts.data,
    ] as Product[];
    return products;
  } catch (error) {
    throw new Error("Error while fetching all products " + error);
  }
};

export const useAllProducts = () => {
  return useQuery<Product[]>("all", getAllProducts, {
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
};
