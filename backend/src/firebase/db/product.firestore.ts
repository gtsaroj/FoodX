import { Collection, Product } from "../../models/product.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { db } from "../index.js";

const addProductToFirestore = async (
  product: Product,
  category: Collection["name"]
) => {
  if (!product) throw new ApiError(401, "No data to update the database.");
  const productRef = db.collection(category);
  if (!productRef) throw new ApiError(501, "No document found.");
  try {
    const { id, image, name, price, quantity, tag } = product;
    await productRef
      .add({ id, name, price, image, quantity, tag: tag })
      .then((docRef) => docRef.update({ id: docRef.id }));
  } catch (error) {
    throw new ApiError(
      400,
      "Something went wrong while adding product to the database."
    );
  }
};

const getProductByName = async (name: string, category: Collection["name"]) => {
  const productRef = db.collection(category);
  if (!productRef) throw new ApiError(400, "No document found.");
  try {
    const query = productRef.where("name", "==", name);
    const res = await query.get();
    if (!res) throw new ApiError(404, "No item found with that name.");
    const doc = res.docs[0];
    const data = doc.data() as Product;
    return { data, doc: doc.id };
  } catch (error) {
    throw new ApiError(401, "Unable to get product from database.");
  }
};

const getProductByTagFromDatabase = async (
  tag: string,
  category: Collection["name"]
) => {
  const productRef = db.collection(category);
  if (!productRef) throw new ApiError(400, "No collection available.");
  try {
    const products: Product[] = [];
    const query = productRef.where("tag", "==", tag);
    const snapshot = await query.get();
    snapshot.forEach((doc) => {
      if (!doc.exists) throw new ApiError(401, "Document doesnt exist.");
      const data = doc.data() as Product;
      products.push(data);
    });
    return products;
  } catch (err) {
    throw new ApiError(401, "Unable to get products  by tag.");
  }
};

const getAllProductsFromDatabase = async (category: Collection["name"]) => {
  const productRef = db.collection(category);
  if (!productRef) throw new ApiError(400, "No collection available.");
  try {
    const products: Product[] = [];
    const documents = await productRef.get();
    documents.forEach((doc) => {
      if (!doc.exists) throw new ApiError(401, "Document doesnt exist.");
      const data = doc.data() as Product;
      products.push(data);
    });
    return products;
  } catch (error) {
    throw new ApiError(401, "Unable to get product from database.");
  }
};

const updateProductInDatabase = async (
  category: Collection["name"],
  field: keyof Product,
  name: string,
  newData: string | number
) => {
  const productRef = db.collection(category);
  if (!productRef) throw new ApiError(400, "No collection available.");
  try {
    const document = await getProductByName(name, category);
    await productRef.doc(document.doc).update({
      [`${field}`]: newData,
    });
  } catch (error) {
    console.error(error);
    throw new ApiError(401, "Unable to update product data.");
  }
};

export {
  addProductToFirestore,
  getProductByName,
  getProductByTagFromDatabase,
  getAllProductsFromDatabase,
  updateProductInDatabase,
};
