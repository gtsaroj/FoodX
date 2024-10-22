import { useQuery, useQueryClient } from "react-query";
import {
  getNormalProducts,
  getSpecialProducts,
} from "../Services/product.services";
import { Product } from "../models/product.model";

const getAllProducts = async (
  specialProducts: Product[]
): Promise<Product[]> => {
  try {
    const [normalProducts, specialsProducts] = [
      await getNormalProducts(),
      specialProducts
        ? Promise.resolve({ data: specialProducts })
        : await getSpecialProducts(),
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
  const queryClient = useQueryClient();
  const specialProducts = queryClient.getQueryData<Product[]>("specials");

  return useQuery<Product[]>(
    "all",
    () => getAllProducts(specialProducts as Product[]),
    {
      staleTime: 2 * 60 * 1000,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
    }
  );
};

export const specialsProductsFn = async (): Promise<Product[]> => {
  try {
    const normalProducts = await getSpecialProducts();

    const products = normalProducts.data as Product[];
    return products;
  } catch (error) {
    throw new Error("Error while fetching specials products");
  }
};

export const specialProducts = () => {
  return useQuery<Product[]>("specials", specialsProductsFn, {
    staleTime: 2 * 60 * 1000,
    cacheTime: 2 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};
