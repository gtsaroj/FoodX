import dayjs from "dayjs";
import { getRevenue } from "../../Services/revenue.services";
import { Product } from "../../models/product.model";
import { Revenue } from "../../models/revenue.model";

export const aggregateProducts = async (allProducts: Product[]) => {
  // Calculate revenue and orders
  const revenueData = await getRevenue({
    startDate: dayjs().subtract(1, "month").format("YYYY-MM-DD"),
    endDate: dayjs().format("YYYY-MM-DD"),
  });

  const products: Product[] = allProducts.map((product: Product) => {
    let revenue: number = 0;
    let orders: number = 0;

    // Find matching product in revenue data
    revenueData.data.forEach((order: Revenue) => {
      const matchingProduct = order.orders.find((p) => p.id === product.id);
      if (matchingProduct) {
        revenue +=
          Number(matchingProduct.price) * Number(matchingProduct.quantity);
        orders += Number(matchingProduct.quantity);
      }
    });

    // Return the updated product with calculated revenue, orders, and default rating
    return {
      ...product,
      revenue: revenue || 0,
      order: orders || 0,
      rating: 0, // Static rating for now, adjust if necessary
    };
  });

  const maxOrders = Math.max(
    ...products.map((product) => Number(product.order))
  );

  const ratedProducts = products?.map((product) => ({
    ...product,
    rating:
      product.order && Math.round((product.order / maxOrders)*5) == 0
        ? 1
        : (product.order && Math.round((product.order / maxOrders)*5)) || 0,
  }));
  console.log(ratedProducts)
  return ratedProducts;
};
