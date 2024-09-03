import { useEffect, useState } from "react";
import { GetOrderModal, Order, UserOrder } from "../../models/order.model";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { RecentCard } from "../../Components/Card/Card.Recent.Order";
import { getOrderByUser } from "../../Services/order.services";
import { useSelector } from "react-redux";
import { RootState } from "../../Store";
import { nanoid } from "@reduxjs/toolkit";
import dayjs from "dayjs";

export const RecentOrder = () => {
  const [initialData, setInitialData] = useState<UserOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const authUser = useSelector((state: RootState) => state.root.auth.userInfo);

  const recentOrder = async ({
    pageSize,
    filter,
    sort,
    currentLastDoc,
    currentFirstDoc,
    direction,
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
      const userOrder = response.data as Order[];
      const aggregateData = userOrder.map((order): UserOrder => {
        const productNames = order.products?.map(
          (product) =>
            (product.name as string) + " × " + product.quantity + ", "
        );
        const totalAmount = order?.products?.reduce(
          (productQuantity, product) =>
            productQuantity + product.quantity * product.price,
          1
        );

        return {
          id: nanoid().substring(0, 15) as string,
          products: productNames,
          time: dayjs(order.orderRequest).format("MM-DD-YYYY h:mm A"),
          status: order.status as string,
          amount: totalAmount,
          productImage: order?.products[0]?.image,
          payment: "esewa",
        };
      });
      setInitialData(aggregateData.slice(0, 5));
    } catch (error) {
      throw new Error("Error while fetching recent order" + error);
    }
    setLoading(false);
  };

  useEffect(() => {
    recentOrder({
      filter: "orderRequest",
      pageSize: 5,
      sort: "asc",
      currentFirstDoc: null,
      currentLastDoc: null,
      direction: "next",
      userId: authUser.uid,
    });
  }, [authUser.uid]);

  return (
    <div className="w-full h-full flex flex-col gap-6 bg-white px-5 py-4   rounded items-start justify-center">
      <h1 className="text-[25px] tracking-wider font-semibold ">
        Recent Orders
      </h1>
      <div className="flex items-center w-full  gap-5 overflow-x-auto ">
        {!loading ? 
          initialData?.map((order) => (
          <RecentCard item={order} />
          ))
          :
          <div className="w-full gap-4 flex ">
          <Skeleton
            height={230}
            width={330}
            baseColor="var(--light-background)"
            highlightColor="var(--light-foreground)"
            count={1}
          />
          <Skeleton
            height={230}
            width={330}
            baseColor="var(--light-background)"
            highlightColor="var(--light-foreground)"
            count={1}
          />
          <Skeleton
            height={230}
            width={330}
            baseColor="var(--light-background)"
            highlightColor="var(--light-foreground)"
            count={1}
          />
          <Skeleton
            height={230}
            width={330}
            baseColor="var(--light-background)"
            highlightColor="var(--light-foreground)"
            count={1}
          />
        </div>
      }
      </div>
    </div>
  );
};
