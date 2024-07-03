import { getOrderByUserId, getUserData } from "../firebase/db";
import { DbUser } from "../models/UserModels";
import { Order } from "../models/order.model";
import { CustomerType } from "../models/user.model";
import { SearchCustomer } from "./Search";
import { totalCost, totalQuantity } from "./Utils";


export const aggregateCustomerData = async (
  customers: DbUser[],
  value: string
) => {
  const customerList : CustomerType[] = [];
  const searchingCustomer = SearchCustomer(customers, value);

  const totalCustomersPromises = searchingCustomer.map(
    async (data: DbUser): Promise<Order[]> => {
      const userOrderData = await getOrderByUserId("orders", data.uid);
      return userOrderData;
    }
  );

  const totalCustomers = await Promise.all(totalCustomersPromises);

  const customerOrderCostAndQuantity = totalCustomers?.forEach((customer) => {
    customer.forEach((order) => {
      const customerQuantity = totalQuantity(order.products);
      const customerCost = totalCost(order.products);
    });
  });
};
