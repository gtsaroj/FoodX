import { useEffect, useState } from "react";
import {
  FetchOrder,
  GetOrderModal,
  Order,
  OrderModal,
} from "../../models/order.model";
import { getOrders } from "../../Services/order.services";
import { getUserByUid } from "../../Utility/user.utils";
import Avatar from "../../assets/logo/avatar.png";
import dayjs from "dayjs";
import { useQueryClient } from "react-query";
import { User } from "../../models/user.model";

export const usePaginateOrders = ({
  pageSize,
  direction,
  filter,
  sort,
  status,
  userId,
}: GetOrderModal) => {
  const queryClient = useQueryClient();

  const [initialOrders, setInitialOrders] = useState<OrderModal[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalData, setTotalData] = useState<number>();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [pagination, setPagination] = useState<{
    currentPage: number;
    perPage: number;
    pageDirecton?: "prev" | "next";
  }>({ currentPage: 1, perPage: 20 });
  const [currentDoc, setCurrentDoc] = useState<{
    currentFirstDoc: string;
    currentLastDoc: string;
  }>();
  const [isFilter, setIsFilter] = useState<{
    // dateFilter?: any;
    sortFilter?: { id?: string; sort?: string };
  }>();
  const [haveUser, setHaveUser] = useState<User>();

  const fetchOrders = async ({
    pageSize,
    currentFirstDoc,
    currentLastDoc,
    direction,
    filter,
    sort,
    status,
    userId,
  }: GetOrderModal & { queryClient: typeof queryClient }) => {
    setLoading(true);
    try {
      const response = (await getOrders({
        pageSize: pageSize || pagination.perPage,
        currentFirstDoc: currentFirstDoc,
        currentLastDoc: currentLastDoc,
        direction: direction,
        filter: filter,
        sort: sort,
        status: status,
        userId: userId,
      })) as FetchOrder;
      setTotalData(response.length);
      setCurrentDoc({
        currentFirstDoc: response.currentFirstDoc,
        currentLastDoc: response.currentLastDoc,
      });

      const userPromises = response.orders.map(async (order): Promise<User> => {
        const cachedUser = queryClient.getQueryData(["user", order.uid]);
        if (cachedUser) {
          return cachedUser;
        } else {
          return await queryClient.fetchQuery(["user", order.uid], () =>
            getUserByUid(order.uid as string)
          );
        }
      });

      const allUser = await Promise.all(userPromises);
      const aggregateOrder = aggregateOrders(
        response.orders,
        pagination,
        allUser
      );

      const aggregatePromiseOrder = await Promise.all(aggregateOrder);
      setInitialOrders(aggregatePromiseOrder);
    } catch (error) {
      setInitialOrders([]);
      throw new Error("Error while fetching orders " + error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchOrders({
      pageSize: pageSize || pagination.perPage,
      currentFirstDoc: null,
      currentLastDoc: null,
      direction: pagination.pageDirecton || direction,
      filter:
        (isFilter?.sortFilter?.sort as keyof Order) || filter || "orderRequest",
      sort: sortOrder || sort || "desc",
      status: status,
      userId: haveUser?.uid,
      queryClient,
    });
  }, [isFilter?.sortFilter?.sort, sortOrder, haveUser]);

  useEffect(() => {
    if (pagination.pageDirecton && pagination.currentPage > 1) {
      const fetchNextPage = async () => {
        setLoading(true);
        try {
          const response = (await getOrders({
            pageSize: pagination.perPage,
            currentFirstDoc: currentDoc?.currentFirstDoc,
            currentLastDoc: currentDoc?.currentLastDoc,
            direction: pagination.pageDirecton,
            filter:
              (isFilter?.sortFilter?.sort as keyof Order) || "orderRequest",
            sort: sortOrder || sort,
            status: status,
            userId: userId,
          })) as FetchOrder;
          setTotalData(response.length);
          setCurrentDoc({
            currentFirstDoc: response.currentFirstDoc,
            currentLastDoc: response.currentLastDoc,
          });

          const userPromises = response.orders.map(
            async (order): Promise<User> => {
              const cachedUser = queryClient.getQueryData(["user", order.uid]);
              if (cachedUser) {
                return cachedUser;
              } else {
                return await queryClient.fetchQuery(["user", order.uid], () =>
                  getUserByUid(order.uid as string)
                );
              }
            }
          );

          const allUser = await Promise.all(userPromises);
          const aggregateOrder = aggregateOrders(
            response.orders,
            pagination,
            allUser
          );
          const aggregatePromiseOrder = await Promise.all(aggregateOrder);
          setInitialOrders((prev) => [
            ...prev,
            ...aggregatePromiseOrder.filter(
              (order) => !prev.some((data) => data.id === order.id)
            ),
          ]);
        } catch (error) {
          throw new Error("Error while fetching orders " + error);
        } finally {
          setLoading(false);
        }
      };
      fetchNextPage();
    }
  }, [
    pagination.pageDirecton,
    pagination.currentPage,
    sortOrder,
    isFilter?.sortFilter?.sort,
  ]);

  return {
    loading,
    totalData,
    sortOrder,
    setSortOrder,
    pagination,
    setPagination,
    setIsFilter,
    isFilter,
    initialOrders,
    setInitialOrders,
    setHaveUser,
    haveUser
  };
};

export const aggregateOrders = (
  orders: Order[],
  pagination?: {
    perPage: number;
    currentPage: number;
  },
  users?: User[]
) => {
  const totalOrder = orders?.map(async (order, index): Promise<OrderModal> => {
    const user = users?.find((user) => user.uid === order.uid);

    return {
      id: order.orderId,
      uid: order.uid,
      name: user?.fullName || "User",
      image: user?.avatar || Avatar,
      products: order?.products,
      orderRequest: dayjs(order?.orderRequest).format(" YYYY-MM-DD, h:mm A"),
      orderFullfilled: dayjs(order?.orderFullfilled).format(
        "YYYY-MM-DD, h:mm A"
      ),
      status: order?.status,
      rank:
        (pagination!.currentPage - 1) * pagination!.perPage + (index + 1) || 1,
    };
  });
  return totalOrder;
};
