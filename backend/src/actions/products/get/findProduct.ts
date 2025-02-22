import { db } from "../../../firebase/index.js";

export const findProductInDatabase = async (id: string) => {
  const collections: ["products", "specials"] = ["products", "specials"];
  let foundProduct: Product.ProductInfo | undefined = undefined;
  let collectionName: Product.Collection["name"] = "products";
  try {
    for (const collection of collections) {
      const docRef = db.collection(collection).doc(id);
      const doc = await docRef.get();

      if (doc.exists) {
        foundProduct = doc.data() as Product.ProductInfo;
        collectionName = collection;
        break;
      }
    }
    if (!foundProduct) throw new Error("Product not found.");
    return { foundProduct, collection: collectionName };
  } catch (error) {
    throw new Error("Error finding product in database. " + error);
  }
};
