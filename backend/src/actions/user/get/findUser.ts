import { db } from "../../../firebase/index.js";

export const findUserInDatabase = async (id: string) => {
  const collections = ["customer", "admin", "chef"];
  let foundUser: User.UserInfo | undefined = undefined;
  try {
    for (const collection of collections) {
      const docRef = db.collection(collection).doc(id);
      const doc = await docRef.get();

      if (doc.exists) {
        foundUser = doc.data() as User.UserInfo;
        break;
      }
    }
    if (!foundUser) throw new Error("User not found.");
    return foundUser;
  } catch (error) {
    throw new Error("Error finding user in database.");
  }
};
