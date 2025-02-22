import { db } from "../../../firebase/index.js";

export const getProductByName = async (
  name: string,
  category: Product.Collection["name"]
) => {
  const productRef = db.collection(category);
  if (!productRef) throw new Error("No document found.");
  try {
    const query = productRef.where("name", "==", name);
    const res = await query.get();
    if (!res) throw new Error("No item found with that name.");
    const doc = res.docs[0];
    const data = doc.data() as Product.ProductInfo;
    return { data, doc: doc.id };
  } catch (error) {
    throw new Error("Unable to get product from database.");
  }
};
