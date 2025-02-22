import { db } from "../../../firebase/index.js";

export const getUserBasedOnRoleFromDatabase = async (
  path: User.RoleType
): Promise<User.UserInfo[]> => {
  try {
    const userRef = db.collection(`${path}`);
    const userDoc = await userRef.get();
    if (userDoc.empty) throw new Error("No document found. Contact admin.");
    const userData = userDoc.docs.map((doc) => doc.data()) as User.UserInfo[];
    return userData;
  } catch (error) {
    throw new Error(error as string);
  }
};
