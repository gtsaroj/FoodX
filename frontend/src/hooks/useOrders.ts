import React, { useEffect } from "react";
import dayjs from "dayjs";
import { getOrderByUser } from "../services";

export const useAggregateUserOrder = (userOrder: Model.Order[]) => {
  try {
    const aggregateData = userOrder?.map((order): Model.UserOrder => {
      order.products?.map(
        (product) => (product.name as string) + " × " + product.quantity + ", "
      );
      const totalAmount = order?.products?.reduce(
        (productQuantity, product) =>
          productQuantity + product.quantity * product.price,
        1
      );
      return {
        id: order.orderId as string,
        products: order.products,
        time: dayjs(order.orderRequest).format("MM-DD-YYYY h:mm A"),
        status: order.status as string,
        amount: totalAmount,
      };
    });
    return aggregateData;
  } catch (error) {
    return [];
  }
};

interface Condition {
  enable?: boolean;
}
export const useGetRecentOrder = (
  {
    pageSize,
    filter,
    sort,
    currentFirstDoc,
    currentLastDoc,
    direction,
    status,
    userId,
  }: Actions.GetOrderModal<keyof Model.Order>,
  { enable = true }: Condition = {}
) => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");
  const [data, setData] = React.useState<Model.UserOrder[]>([]);

  const recentOrder = async ({
    pageSize,
    currentFirstDoc,
    currentLastDoc,
    direction,
    filter,
    sort,
    status,
    userId,
  }: Actions.GetOrderModal<keyof Model.Order>) => {
    setLoading(true);
    try {
      const response = await getOrderByUser({
        filter: filter,
        pageSize: pageSize,
        sort: sort,
        currentFirstDoc: currentFirstDoc,
        currentLastDoc: currentLastDoc,
        direction: direction,
        status: status,
        userId: userId,
      });
      const userOrder = response.data.orders as Model.Order[];
      const aggregateOrder = useAggregateUserOrder(userOrder);
      if (!enable) return setData([]);
      setData(aggregateOrder);
    } catch (err) {
      setError(JSON.stringify(err));
    }
    setLoading(false);
  };

  useEffect(() => {
    if (enable) {
      recentOrder({
        pageSize: pageSize,
        currentFirstDoc: currentFirstDoc || null,
        currentLastDoc: currentLastDoc || null,
        direction: direction,
        filter: filter || ("orderRequest" as keyof Model.Order),
        sort: sort || "desc",
        status: status,
        userId: userId,
      });
    }
  }, [userId, filter, status]);

  return { data, loading, error };
};
