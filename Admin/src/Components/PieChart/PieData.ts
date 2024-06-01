import { Order } from "../../models/order.model";

export function quantityOfEachCategory(todayOrder: Order[]) {
  const tagQuantity = {};
  todayOrder.map((order) => {
    order.products.map((product) => {
      if (!tagQuantity[product.tag])
        tagQuantity[product.tag] = product.quantity;
      tagQuantity[product.tag] = +product.quantity;
    });
  });
  return tagQuantity;
}

export function totalQuantityOfOrder(todayOrder: Order[]) {
  let total = 0;
  todayOrder.forEach((order) => {
    order.products.forEach((product) => {
      total += product.quantity;
    });
  });
  return total;
}



