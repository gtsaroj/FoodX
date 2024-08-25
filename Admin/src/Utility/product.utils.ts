import { Order, Product } from "../models/order.model";
import { ArrangedProduct } from "../models/product.model";

export const totalQuantity = (products: Product[]) => {
  const customerOrderQuantity = products?.reduce(
    (prodSum, product) => prodSum + product?.quantity,
    0
  );
  return customerOrderQuantity;
};
// total Revenue
export const totalRevenue = (orders: Order[]) => {
  const revenue = orders?.reduce(
    (total, order) =>
      total +
      order?.products.reduce(
        (totalProd, product) => totalProd + product.price,
        1
      ),

    1
  );
  return revenue;
};

export const totalCost = (products: Product[]) => {
  const customerOrderCost = products?.reduce(
    (prodSum, product) => prodSum + product?.price,
    0
  );
  typeof customerOrderCost;
  return customerOrderCost;
};

export const SearchProduct = (customers: ArrangedProduct[], value: string) => {
  const searchingProduct = customers?.filter((order) => {
    return order.name.toLowerCase().includes(value);
  });
  return searchingProduct;
};
