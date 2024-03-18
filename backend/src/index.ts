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
  updateUserDataInFirestore,
} from "./firebase/db/user.firestore.js";
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
  tag: { types: "pizza" },
};
// addProductToFirestore(product,"products" );
// getProductByName("Buff Momo", "products")
// getProductByTag("momo", "products");
// getAllProducts("products");
// await updateProduct("products", "price", "Chicken Momo", 900);

// addUserToFirestore(
//   {
//     avatar: "sad.png",
//     email: "123aayush@gmail",
//     fullName: "Aayush Lamichhane",
//     phoneNumber: "9847697816",
//     refreshToken: "",
//     uid: "aayush2911",
//   },
//   "customers"
// );

// deleteUserFromFireStore("aayush2911", "customers");

// updateUserDataInFirestore("aayush2911", "customers", "refreshToken", "123aayush")