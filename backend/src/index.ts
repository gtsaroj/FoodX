import dotenv from "dotenv";
import { app } from "./app.js";
import {
  addProductToFirestore,
  getAllProducts,
  getProductByTag,
  getProductByName,
  updateProduct,
} from "./firebase/db/product.firestore.js";
import { Product } from "./models/product.model.js";
import { nanoid } from "nanoid";
import {
  addUserToFirestore,
  deleteUserFromFireStore,
  getUserFromDatabase,
  updateUserDataInFirestore,
} from "./firebase/db/user.firestore.js";
import { Order } from "./models/order.model.js";
import {
  addNewOrderToDatabase,
  getAllOrders,
  getOrdersByUserId,
} from "./firebase/db/order.firestore.js";
import { User } from "./models/user.model.js";
import { getUserDataById } from "./firebase/auth/Authentication.js";
dotenv.config();

app.listen(process.env.PORT || 8000, () => {
  console.log(`Server is running in port ${process.env.PORT}`);
});
app.get("/test", (_, res) => {
  res.json("Tesing..");
});
const product: Product = {
  id: nanoid() as string,
  image: ".jpg",
  name: "Mushroom Pizza",
  price: 250,
  quantity: 1000,
  tag: "pizza",
};
// addProductToFirestore(product,"products" );
// getProductByName("Buff Momo", "products")
// getProductByTag("momo", "products");
// getAllProducts("products");
// await updateProduct("products", "price", "Chicken Momo", 900);