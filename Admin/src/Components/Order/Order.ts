import { getOrders } from "../../Services";
import { getUserInfo } from "../../Utility/Utils";
import { Order } from "../../models/order.model";

export const getRecentOrders = async () => {
  try {
    //  get total orders data from  server
    const orders = await getOrders();
    const totalOrders = orders.data as Order[];
    const aggregateData = totalOrders?.map(async (item) => {
      const user = await getUserInfo(item?.uid);
      if (user) {
        const productNames = item.products?.map(
          (product) =>
            (product.name as string) + " × " + product.quantity + ", "
        );
        const price = item.products?.reduce(
          (totalProduct, product) => totalProduct + product.price,
          1
        );
        return {
          orderId: item.orderId,
          image: user.avatar,
          products: productNames,
          price: price,
          status: item.status as string,
          orderRequest: item.orderRequest as string,
        };
      }
    });
    const getaggregateDataPromises = await Promise.all(aggregateData);
    const sortByTime = getaggregateDataPromises.sort((a, b) => {
      const dateA = new Date(b.orderRequest);
      const dateB = new Date(a.orderRequest);
      return dateB.getTime() - dateA.getTime();
    });

    const sortOrder = sortByTime.slice(0, 5);
    return sortOrder;
  } catch (error) {
    throw new Error("Unable to display orders data" + error);
  }
};
