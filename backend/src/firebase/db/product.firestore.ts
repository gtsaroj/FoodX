import { Collection, Product } from "../../models/product.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { db } from "../index.js";
import { paginateFnc } from "../utils.js";

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

const getProductById = async (id: string, category: Collection["name"]) => {
  const productRef = db.collection(category);
  try {
    const doc = await productRef.doc(id).get();
    if (!doc.exists) throw new ApiError(404, "No item found with that ");
    const data = doc.data() as Product;
    return { data, doc: id };
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
  id: string,
  newData: string | number
) => {
  const productRef = db.collection(category);
  if (!productRef) throw new ApiError(400, "No collection available.");
  try {
    const document = await getProductById(id, category);
    await productRef.doc(document.doc).update({
      [`${field}`]: newData,
    });
  } catch (error) {
    console.error(error);
    throw new ApiError(401, "Unable to update product data.");
  }
};
const bulkDeleteProductsFromDatabase = async (
  category: Collection["name"],
  id: string[]
) => {
  const productRef = db.collection(category);
  if (!productRef) throw new ApiError(400, "No collection available.");
  try {
    const batch = db.batch();

    id.forEach((productId) => {
      const docRef = productRef.doc(productId);
      batch.delete(docRef);
    });
    await batch.commit();
  } catch (error) {
    throw new ApiError(401, "Unable to bulk delete product data.");
  }
};
const deleteProductFromDatabase = async (
  uid: string,
  category: Collection["name"]
) => {
  const productRef = db.collection(category);
  if (!productRef) throw new ApiError(400, "No collection available");
  try {
    await productRef.doc(uid).delete();
  } catch (error) {
    throw new ApiError(401, "Unable to delete product.");
  }
};

const getProductsFromDatabase = async (
  path: "products" | "specials",
  pageSize: number,
  filter: keyof Product,
  sort: "asc" | "desc" = "asc",
  startAfterDoc: any | null = null,
  startAtDoc: any | null = null,
  direction?: "prev" | "next",
  category?: string
) => {
  try {
    const query = paginateFnc(
      path,
      filter,
      startAfterDoc,
      startAtDoc,
      pageSize,
      sort,
      direction
    );
    let productDoc;
    if (category) {
      productDoc = await query.where("tag", "==", category).get();
    }
    productDoc = await query.get();
    const products: Product[] = [];

    productDoc.docs.forEach((doc) => {
      products.push(doc.data() as Product);
    });

    const firstDoc = productDoc.docs[0]?.data().id || null;
    const lastDoc =
      productDoc.docs[productDoc.docs.length - 1]?.data().id || null;
    const length = productDoc.docs.length;
    return {
      products,
      firstDoc,
      lastDoc,
      length
    };
  } catch (error) {
    throw new ApiError(
      500,
      "Error fetching products from database.",
      null,
      error as string[]
    );
  }
};

export {
  addProductToFirestore,
  getProductByName,
  getProductByTagFromDatabase,
  getAllProductsFromDatabase,
  updateProductInDatabase,
  bulkDeleteProductsFromDatabase,
  getProductById,
  deleteProductFromDatabase,
  getProductsFromDatabase,
};
