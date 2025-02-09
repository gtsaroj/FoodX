import { useQuery, useQueryClient } from "react-query";
import {
  getNormalProducts,
  getSpecialProducts,
} from "../services/product.services";

const getAllProducts = async (
  specialProducts: Ui.Product[]
): Promise<Ui.Product[]> => {
  try {
    let existProducts: Ui.Product[];
    const normalProducts = await getNormalProducts();
    if (!specialProducts) {
      const unExistProducts = await getSpecialProducts();
      existProducts = [...normalProducts.data, ...unExistProducts.data];
    } else {
      existProducts = [...normalProducts.data, ...specialProducts];
    }
    return existProducts;
  } catch (error) {
    throw new Error("Error while fetching all products " + error);
  }
};

export const useAllProducts = () => {
  const queryClient = useQueryClient();
  const specialProducts = queryClient.getQueryData<Ui.Product[]>("specials");

  return useQuery<Ui.Product[]>(
    "all",
    () => getAllProducts(specialProducts as Ui.Product[]),
    {
      staleTime: 2 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  );
};

export const specialsProductsFn = async (): Promise<Ui.Product[]> => {
  try {
    const normalProducts = await getSpecialProducts();

    const products = normalProducts.data as Ui.Product[];
    return products;
  } catch (error) {
    throw new Error("Error while fetching specials products");
  }
};

export const specialProducts = () => {
  return useQuery<Ui.Product[]>("specials", specialsProductsFn, {
    staleTime: 2 * 60 * 1000,
    cacheTime: 2 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};
