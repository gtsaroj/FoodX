import { FieldValue } from "firebase-admin/firestore";
import {
  Collection,
  Product,
  ProductInfo,
  SearchResult,
} from "../../models/product.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { db } from "../index.js";
import { searchItemInDatabase } from "../utils.js";

const addProductToFirestore = async (
  product: Product,
  category: Collection["name"]
) => {
  if (!product) throw new ApiError(400, "No data to update the database.");
  const productRef = db.collection(category);
  if (!productRef) throw new ApiError(404, "No document found.");
  try {
    const { id, image, name, price, quantity, tagId } = product;
    await productRef
      .add({ id, name, price, image, quantity, tagId })
      .then((docRef) =>
        docRef.update({
          id: docRef.id,
          createdAt: FieldValue.serverTimestamp(),
        })
      );
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while adding product to the database.",
      null,
      error as string[]
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
    const data = doc.data() as ProductInfo;
    return { data, doc: doc.id };
  } catch (error) {
    throw new ApiError(
      500,
      "Unable to get product from database.",
      null,
      error as string[]
    );
  }
};

const getProductById = async (id: string, category: Collection["name"]) => {
  const productRef = db.collection(category);
  try {
    const doc = await productRef.doc(id).get();
    if (!doc.exists) throw new ApiError(404, "No item found with that ");
    const data = doc.data() as ProductInfo;
    return { data, doc: id };
  } catch (error) {
    throw new ApiError(
      500,
      "Unable to get product from database.",
      null,
      error as string[]
    );
  }
};

const getProductByTagFromDatabase = async (
  tagId: string,
  category: Collection["name"]
) => {
  const productRef = db.collection(category);
  if (!productRef) throw new ApiError(404, "No collection available.");
  try {
    const products: ProductInfo[] = [];
    const query = productRef.where("tagId", "==", tagId);
    const snapshot = await query.get();
    snapshot.forEach((doc) => {
      if (!doc.exists) throw new ApiError(404, "Document doesnt exist.");
      const data = doc.data() as ProductInfo;
      products.push(data);
    });
    return products;
  } catch (error) {
    throw new ApiError(
      500,
      "Unable to get products  by tag.",
      null,
      error as string[]
    );
  }
};

const getAllProductsFromDatabase = async (category: Collection["name"]) => {
  const productRef = db.collection(category);
  if (!productRef) throw new ApiError(400, "No collection available.");
  try {
    const products: ProductInfo[] = [];
    const documents = await productRef.get();
    documents.forEach((doc) => {
      if (!doc.exists) throw new ApiError(401, "Document doesnt exist.");
      const data = doc.data() as ProductInfo;
      products.push(data);
    });
    return products;
  } catch (error) {
    throw new ApiError(
      500,
      "Unable to get product from database.",
      null,
      error as string[]
    );
  }
};

const updateProductInDatabase = async (
  category: Collection["name"],
  field: keyof Product,
  id: string,
  newData: string | number
) => {
  const productRef = db.collection(category);
  if (!productRef) throw new ApiError(404, "No collection available.");
  try {
    const document = await getProductById(id, category);
    await productRef.doc(document.doc).update({
      [`${field}`]: newData,
      updatedAt: FieldValue.serverTimestamp(),
    });
  } catch (error) {
    throw new ApiError(
      500,
      "Unable to update product data.",
      null,
      error as string[]
    );
  }
};
const bulkDeleteProductsFromDatabase = async (
  category: Collection["name"],
  id: string[]
) => {
  const productRef = db.collection(category);
  if (!productRef) throw new ApiError(404, "No collection available.");
  try {
    const batch = db.batch();

    id.forEach((productId) => {
      const docRef = productRef.doc(productId);
      batch.delete(docRef);
    });
    await batch.commit();
  } catch (error) {
    throw new ApiError(
      500,
      "Unable to bulk delete product data.",
      null,
      error as string[]
    );
  }
};
const deleteProductFromDatabase = async (
  uid: string,
  category: Collection["name"]
) => {
  const productRef = db.collection(category);
  if (!productRef) throw new ApiError(404, "No collection available");
  try {
    await productRef.doc(uid).delete();
  } catch (error) {
    throw new ApiError(
      500,
      "Unable to delete product.",
      null,
      error as string[]
    );
  }
};

const searchProductInDatabase = async (query: string) => {
  try {
    const productSnapshot = await searchItemInDatabase(
      "products",
      query,
      "name",
      10
    );

    const specialSnapshot = await searchItemInDatabase(
      "specials",
      query,
      "name",
      10
    );

    let searchResult: SearchResult[] = [
      ...productSnapshot.docs.map((doc) => ({
        ...(doc.data() as ProductInfo),
        type: "products",
      })),
      ...specialSnapshot.docs.map((doc) => ({
        ...(doc.data() as ProductInfo),
        type: "specials",
      })),
    ];

    searchResult.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
    searchResult = searchResult.slice(0, 9);

    return searchResult;
  } catch (error) {
    throw new ApiError(
      500,
      "Error while searching products",
      null,
      error as string[]
    );
  }
};

const findProductInDatabase = async (id: string) => {
  const collections = ["products", "specials"];
  let foundProduct: FirebaseFirestore.DocumentData | undefined = undefined;
  try {
    for (const collection of collections) {
      const docRef = db.collection(collection).doc(id);
      const doc = await docRef.get();

      if (doc.exists) {
        foundProduct = doc.data() as ProductInfo;
        break;
      }
    }
    if (!foundProduct) throw new ApiError(404, "Product not found.");
    return foundProduct;
  } catch (error) {
    throw new ApiError(
      500,
      "Error finding product in database.",
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
  searchProductInDatabase,
  findProductInDatabase,
};
