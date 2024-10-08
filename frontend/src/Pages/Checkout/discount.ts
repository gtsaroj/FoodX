import { Product } from "../../models/product.model";

export const calculateDiscountedPrice = (
  products: Product[],
  discountPercentage: number
) => {
  const dicountPercentageToEachProducts = products.length / discountPercentage;

  const productsWithDiscount = products?.map((product) => {
    const discountedPrice =
      product.price * (dicountPercentageToEachProducts / 100);
    return {
      ...product,
      price: product.price - discountedPrice,
    };
  });
  return productsWithDiscount;
};
