import { useQuery, useQueryClient } from "react-query";
import {
  getNormalProducts,
  getSpecialProducts,
} from "../Services/product.services";
import { Product } from "../models/product.model";
import { Revenue } from "../models/revenue.model";
import dayjs from "dayjs";
import { aggregateProducts } from "../Pages/Product/product";
import { aggregateRevenue } from "./useAllRevenue";

export const useSpecialProducts = () => {
  const queryClient = useQueryClient();
  const fetchMonthlyRevenue = async (): Promise<Revenue[]> => {
    let monthlyRevenue = queryClient.getQueryData<Revenue[]>([
      "custom-date",
      dayjs().startOf("month").format("YYYY-MM-DD"),
      dayjs().format("YYYY-MM-DD"),
    ]);

    // If monthlyRevenue is not available, fetch it
    if (!monthlyRevenue) {
      monthlyRevenue = await queryClient.fetchQuery(
        [
          "custom-date",
          dayjs().startOf("month").format("YYYY-MM-DD"),
          dayjs().format("YYYY-MM-DD"),
        ],
        () =>
          aggregateRevenue({
            startDate: dayjs().startOf("month").format("YYYY-MM-DD"),
            endDate: dayjs().format("YYYY-MM-DD"),
          })
      );
    }

    return monthlyRevenue as Revenue[];
  };

  return useQuery<Product[]>(
    "specialProducts",
    async () => {
      const specialProducts = await getSpecialProducts().then((res) =>
        res.data.map((product: Product) => {
          return { ...product, type: "specials" };
        })
      );
      const aggregateSpecialProducts = aggregateProducts(
        specialProducts,
        fetchMonthlyRevenue()
      );
      return aggregateSpecialProducts;
    },
    {
      staleTime: 5 * 60 * 1000,
      cacheTime: 5 * 60 * 1000,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );
};

export const useNormalProuducts = () => {
  const queryClient = useQueryClient();

  const fetchMonthlyRevenue = async (): Promise<Revenue[]> => {
    let monthlyRevenue = queryClient.getQueryData<Revenue[]>([
      "custom-date",
      dayjs().startOf("month").format("YYYY-MM-DD"),
      dayjs().format("YYYY-MM-DD"),
    ]);

    // If monthlyRevenue is not available, fetch it
    if (!monthlyRevenue) {
      monthlyRevenue = await queryClient.fetchQuery(
        [
          "custom-date",
          dayjs().startOf("month").format("YYYY-MM-DD"),
          dayjs().format("YYYY-MM-DD"),
        ],
        () =>
          aggregateRevenue({
            startDate: dayjs().startOf("month").format("YYYY-MM-DD"),
            endDate: dayjs().format("YYYY-MM-DD"),
          })
      );
    }

    return monthlyRevenue as Revenue[];
  };

  return useQuery(
    "normalProducts",
    async () => {
      const normalProducts = await getNormalProducts().then((res) =>
        res.data?.map((product: Product) => ({
          ...product,
          type: "products",
        }))
      );
      const aggregateNormalProducts = await aggregateProducts(
        normalProducts,
        fetchMonthlyRevenue() as Promise<Revenue[]>
      );
      return aggregateNormalProducts;
    },
    {
      refetchOnWindowFocus: false,
      cacheTime: 5 * 60 * 1000,
      staleTime: 5 * 60 * 1000,
      refetchOnMount: false,
    }
  );
};

// export const useAllProducts = () => {
//   const queryClient = useQueryClient();
//   const specialProducts = useSpecialProducts();
//   const normalProducts = useNormalProuducts();

//   return useQuery(
//     "allProducts",
//     async () => {
//       const monthlyRevenue = queryClient.getQueryData<Revenue[]>([
//         `custom-date`,
//         dayjs().subtract(1, "month").format("YYYY-MM-DD"),
//         dayjs().format("YYYY-MM-DD"),
//       ]);
//       if (!normalProducts.data && !specialProducts.data) {
//         const specialProducts = await getSpecialProducts().then(
//           (res) => res.data
//         );
//         const normalProducts = await getNormalProducts().then(
//           (res) => res.data
//         );
//         const aggregateAllProducts = aggregateProducts(
//           [...specialProducts, normalProducts],
//           monthlyRevenue as Revenue[]
//         );
//         return aggregateAllProducts;
//       }
//       return [
//         ...(specialProducts.data as Product[]),
//         ...(normalProducts.data as Product[]),
//       ];
//     },
//     {
//       cacheTime: 5 * 60 * 1000,
//       staleTime: 5 * 60 * 1000,
//       refetchOnWindowFocus: false,
//     }
//   );
// };
