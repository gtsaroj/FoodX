import { getOrderByUser } from "../Services/order.services";
import { getCustomerData, getUserData } from "../firebase/db";
import { Order } from "../models/order.model";
import { Product } from "../models/product.model";
import { DbUser, User } from "../models/user.model";
import { totalCost, totalQuantity } from "./product.utils";

export const SearchCustomer = (customers: User[], value: string) => {
  const searchingCustomer = customers?.filter((customer) => {
    return customer.fullName.toLowerCase().includes(value);
  });
  return searchingCustomer;
};
export const getFullName = async (uid: string): Promise<string | null> => {
  try {
    const customerData = await getUserData("customer", uid);
    if (customerData && customerData.fullName) {
      return customerData.fullName;
    }

    // If customer name is not found, try to get the admin's full name
    const adminData = await getUserData("admin", uid);
    if (adminData && adminData.fullName) {
      return adminData.fullName;
    }
    return null;
  } catch (error) {
    throw new Error("Error fetching user data:", error);
    return null;
  }
};
export const getUserInfo = async (uid: string) => {
  const user = await getUserData("customer", uid);
  if (user) return user;
  const admin = await getUserData("admin", uid);
  if (admin) return admin;
};

// aggregate Customer Data
export const aggregateCustomerData = async (
  customers: DbUser[]
): Promise<User[]> => {
  const customerList: User[] = [];

  const totalCustomersPromises = customers.map(
    async (data: DbUser): Promise<User> => {
      try {
        const userOrderData = await getOrderByUser(data.uid);
        if (!userOrderData) throw new Error("user not found");
        const totalUserOrder = userOrderData.data as Order[];
        let totalCustomerCost: number = 0;
        let totalCustomerQuantity: number = 0;
        totalUserOrder?.forEach((order) => {
          totalCustomerQuantity += totalQuantity(order.products as Product[]);
          totalCustomerCost += totalCost(order.products as Product[]);
        });

        return {
          uid: data.uid,
          fullName: data.fullName,
          email: data.email,
          avatar: data.avatar,
          amountSpent: Math.round(totalCustomerCost * 100) / 100,
          totalOrder: totalCustomerQuantity,
          role: data.role as "customer" | "admin" | "chef",
        };
      } catch (error) {
        throw new Error(`Error fetching orders for user ${data.uid}:` + error);
      }
    }
  );

  try {
    const results = await Promise.all(totalCustomersPromises);
    customerList.push(...results);
  } catch (error) {
    throw new Error("Error processing batch:" + error);
  }

  if (customerList.length > 0) {
    return customerList;
  } else {
    throw new Error("No customers found or processed.");
  }
};

export const getTopCustomers = async () => {
  try {
    const getCustomer = await getCustomerData("customer");
    const customerList = await aggregateCustomerData(getCustomer);
    const sortBySpent = customerList.sort(
      (a: User, b: User) => b.amountSpent - a.amountSpent
    );
    return sortBySpent.slice(0, 5);
  } catch (error) {
    throw new Error("Error while sorting top customers : " + error);
  }
};
