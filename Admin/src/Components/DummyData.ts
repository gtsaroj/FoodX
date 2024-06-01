import { Order } from "../models/order.model";
import { nanoid } from "@reduxjs/toolkit";
import { ProductType } from "../models/productMode";

const orderProduct: ProductType[] = [
  {
    id: nanoid(),
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8Mnx8fGVufDB8fHx8fA%3D%3D",
    name: "Pizza",
    price: 440,
    quantity: 5,
    tag: "Pizza",
  },
  {
    id: nanoid(),
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8Mnx8fGVufDB8fHx8fA%3D%3D",
    name: "Fry Momo",
    price: 280,
    quantity: 5,
    tag: "Momo",
  },
  {
    id: nanoid(),
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8Mnx8fGVufDB8fHx8fA%3D%3D",
    name: "Cofee",
    price: 140,
    quantity: 5,
    tag: "Hot drinks",
  },
];
export const orders: Order[] = [
  {
    orderId: nanoid(),
    customer: "Saroj GT",
    orderRequest: "2021-02-23",
    orderFullFilled: "2024-5-1",
    products: orderProduct,
    status: "Completed",
  },
  {
    orderId: nanoid(),
    customer: "Aayush Lamichhane",
    orderRequest: "2021-02-23",
    orderFullFilled: "2021-020-24",
    products: orderProduct,
    status: "Completed",
  },
  {
    orderId: nanoid(),
    customer: "Suzan pokhrel",
    orderRequest: "2021-02-23",
    orderFullFilled: "2021-020-24",
    products: orderProduct,
    status: "Recieved",
  },
  {
    orderId: nanoid(),
    customer: "ChiranJivi Kusari",
    orderRequest: "2021-02-23",
    orderFullFilled: "2021-020-24",
    products: orderProduct,
    status: "Canceled",
  },
  {
    orderId: nanoid(),
    customer: "Debin DKR",
    orderRequest: "2021-02-23",
    orderFullFilled: "2024-5-1",
    products: orderProduct,
    status: "Recieved",
  },
  {
    orderId: nanoid(),
    customer: "Raj bansi",
    orderRequest: "2021-02-23",
    orderFullFilled: "2024-4-31",
    products: orderProduct,
    status: "Preparing",
  },
];
