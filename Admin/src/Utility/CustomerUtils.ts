import { getOrderByUser } from "../Services";
import { getCustomerData } from "../firebase/db";
import { DbUser } from "../models/UserModels";
import { Order, Product } from "../models/order.model";
import { CustomerType } from "../models/user.model";
import { SearchCustomer } from "./Search";
import { totalCost, totalQuantity } from "./Utils";

// aggregate Customer Data
export const aggregateCustomerData = async (
  customers: DbUser[]
): Promise<CustomerType[]> => {
  const customerList: CustomerType[] = [];
  const batchSize = 10;

  // Split customers into batches
  for (let i = 0; i < customers.length; i += batchSize) {
    const batch = customers.slice(i, i + batchSize);
    console.log(i, i + batchSize);
    const totalCustomersPromises = batch.map(
      async (data: DbUser): Promise<CustomerType> => {
        try {
          const userOrderData = await getOrderByUser(data.uid);
          const totalUserOrder = userOrderData.data as Order[];

          let totalCustomerCost: number = 0;
          let totalCustomerQuantity: number = 0;

          totalUserOrder.forEach((order) => {
            console.log(order);
            totalCustomerQuantity += totalQuantity(order.products as Product[]);
            totalCustomerCost += totalCost(order.products as Product[]);
          });
          
          return {
            id: data.uid,
            name: data.fullName,
            email: data.email,
            image: data.avatar,
            amountSpent: totalCustomerCost.toFixed(2),
            totalOrder: totalCustomerQuantity,
            role: data.role as string,
          };
        } catch (error) {
          console.error(`Error fetching orders for user ${data.uid}:`, error);
          throw error;
        }
      }
    );

    try {
      const results = await Promise.all(totalCustomersPromises);
      customerList.push(...results);
    } catch (error) {
      console.error("Error processing batch:", error);
      throw error;
    }
  }

  if (customerList.length > 0) {
    return customerList;
  } else {
    throw new Error("No customers found or processed.");
  }
};

export const aggregateCustomerSearchData = async (
  customers: DbUser[],
  value: string
) => {
  const searchingCustomer = SearchCustomer(customers, value);

  const eachCustomer = await aggregateCustomerData(searchingCustomer);
  return eachCustomer;
};

export const getTopCustomers = async () => {
  try {
    const getCustomer = await getCustomerData("customers");
    const customerList = await aggregateCustomerData(getCustomer);
    const sortBySpent = customerList.sort(
      (a: any, b: any) => b.amountSpent - a.amountSpent
    );
    return sortBySpent.slice(0, 5);
  } catch (error) {
    return console.log("Error while sorting top customers : " + error);
  }
};
