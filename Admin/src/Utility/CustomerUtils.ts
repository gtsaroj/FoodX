import { order } from "./../../../frontend/src/Services";
import { getOrderByUser } from "../Services";
import { DbUser } from "../models/UserModels";
import { Order, Product } from "../models/order.model";
import { CustomerType } from "../models/user.model";
import { SearchCustomer } from "./Search";
import { totalCost, totalQuantity } from "./Utils";
import { orders } from "../Components/DummyData";
import { Users } from "lucide-react";

// aggregate Customer Data
export const aggregateCustomerData = async (customers: DbUser[]): Promise<CustomerType[]> => {
  let customerList: CustomerType[] = [];

  try {
    const totalCustomersPromises = customers.map(async (data: DbUser): Promise<CustomerType> => {
      const userOrderData = await getOrderByUser(data.uid);
      const totalUserOrder = userOrderData.data as Order[];

      let totalCustomerCost: number = 0;
      let totalCustomerQuantity: number = 0;

      totalUserOrder.forEach((order) => {
        totalCustomerQuantity += totalQuantity(order.products as Product[]);
        totalCustomerCost += totalCost(order.products as Product[]);
      });

      return {
        name: data.fullName,
        email: data.email,
        location: "fljds",
        amountSpent: totalCustomerCost.toFixed(2),
        totalOrder: totalCustomerQuantity,
        role: data.role as string,
      };
    });

    customerList = await Promise.all(totalCustomersPromises);

    if (customerList.length > 0) {
      return customerList;
    } else {
      throw new Error("No customers found or processed.");
    }
  } catch (error) {
    console.error("Error aggregating customer data:", error);
    throw error; // Rethrow the error to be handled elsewhere if needed
  }
};


export const aggregateCustomerSearchData = async (orders: Order[]) => {};
