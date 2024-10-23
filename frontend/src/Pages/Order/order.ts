import React, { useEffect } from "react";
import { GetOrderModal, Order, UserOrder } from "../../models/order.model";
import dayjs from "dayjs";
import { getOrderByUser } from "../../Services/order.services";

export const aggregateUserOrder = (userOrder: Order[]) => {
  try {
    const aggregateData = userOrder?.map((order): UserOrder => {
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
export const getRecentOrder = (
  {
    pageSize,
    filter,
    sort,
    currentFirstDoc,
    currentLastDoc,
    direction,
    status,
    userId,
  }: GetOrderModal,
  { enable = true }: Condition = {}
) => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");
  const [data, setData] = React.useState<UserOrder[]>([]);

  const recentOrder = async ({
    pageSize,
    currentFirstDoc,
    currentLastDoc,
    direction,
    filter,
    sort,
    status,
    userId,
  }: GetOrderModal) => {
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
      const userOrder = response.data.orders as Order[];
      const aggregateOrder = aggregateUserOrder(userOrder);
      if (!enable) return setData([]);
      setData(aggregateOrder);
    } catch (err) {
      setError(JSON.stringify(err));
      throw new Error("Error while fetching recent order" + err);
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
        filter: (filter as keyof Order) || "orderRequest",
        sort: sort || "desc",
        status: status,
        userId: userId,
      });
    }
  }, [userId, filter, status]);

  return { data, loading, error };
};
