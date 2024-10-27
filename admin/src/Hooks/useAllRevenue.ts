import { useQuery } from "react-query";
import { monthlyRevenue } from "../Components/LineChart/LineChartData";
import { AddRevenue, LineChartType, Revenue } from "../models/revenue.model";
import { getRevenue } from "../Services/revenue.services";

export const useMonthlyRevenue = (data: AddRevenue) => {
  const aggregateRevenue = async (
    date: AddRevenue
  ): Promise<LineChartType[]> => {
    try {
      const response = await getRevenue({
        startDate: date.startDate,
        endDate: date.endDate,
      });
      const totalData = monthlyRevenue(response.data);
      return totalData;
    } catch (error) {
      throw new Error("Error while fetching revenue " + error);
    }
  };

  const {
    data: revenueData,
    isError,
    isLoading,
  } = useQuery(
    ["custom-date", data.startDate, data.endDate],
    () => {
      return aggregateRevenue({ ...data });
    },
    {
      cacheTime: 5 * 60 * 1000,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    }
  );
  return { revenueData, isError, isLoading };
};

export const useAllRevenue = (
  date: AddRevenue,
  { enable = true }: { enable: boolean }
) => {
  const { data, isError, isLoading } = useQuery(
    ["custom-date", date.startDate, date.endDate],
    () => {
      return aggregateRevenue({ ...date });
    },
    {
      cacheTime: 5 * 60 * 1000,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      enabled: enable,
    }
  );
  return { data, isError, isLoading };
};

export const aggregateRevenue = async (
  date: AddRevenue
): Promise<Revenue[]> => {
  try {
    const response = await getRevenue({
      startDate: date.startDate,
      endDate: date.endDate,
    });
    return response.data;
  } catch (error) {
    throw new Error("Error while fetching revenue " + error);
  }
};
