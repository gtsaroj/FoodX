import { FieldValue } from "firebase-admin/firestore";
import { User, AccessType, UserInfo } from "../../models/user.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { db } from "../index.js";
import { paginateFnc, searchItemInDatabase } from "../utils.js";

const addUserToFirestore = async (
  user: User,
  access: AccessType["privilage"]
) => {
  const customerDocRef = db.collection(access);
  if (!customerDocRef) throw new ApiError(404, "No document found.");
  try {
    const oldUser = await customerDocRef.where("uid", "==", user.uid).get();
    if (oldUser.size !== 0) throw new ApiError(409, "User already exist.");
    await customerDocRef.doc(user.uid).set({
      ...user,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: null,
    });
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while adding user to the database.",
      null,
      error as string[]
    );
  }
};

const deleteUserFromFireStore = async (
  uid: string,
  access: AccessType["privilage"]
) => {
  if (!uid) throw new ApiError(400, "UID is required to delete user.");
  const customerDocRef = db.collection(access);

  try {
    const query = customerDocRef.doc(uid);
    const doc = await query.get();
    if (!doc.exists) throw new ApiError(404, "User not found.");
    doc.ref.delete();
  } catch (error) {
    throw new ApiError(
      500,
      "Unable to delete user from database.",
      null,
      error as string[]
    );
  }
};

const updateUserDataInFirestore = async (
  uid: string,
  access: AccessType["privilage"],
  field: keyof UserInfo,
  data: string
) => {
  try {
    const customerDocRef = db.collection(access).doc(uid);
    if (!customerDocRef)
      throw new ApiError(404, "User doesnt exist in the database.");
    const userDoc = await customerDocRef.get();
    const docData = userDoc.data();
    if (!docData)
      throw new ApiError(500, "Unable to fetch data from database.");

    await customerDocRef.update({
      [`${field}`]: data,
      updatedAt: FieldValue.serverTimestamp(),
    });
  } catch (error) {
    throw new ApiError(500, "Unable to update data.", null, error as string[]);
  }
};

const updateTotalOrder = async (collection: string, uid: string) => {
  try {
    const userRef = db.collection(collection).doc(uid);
    await userRef.update({
      totalOrder: FieldValue.increment(1),
      updatedAt: FieldValue.serverTimestamp(),
    });
  } catch (error) {
    throw new ApiError(
      500,
      "Unable to update total orders.",
      null,
      error as string[]
    );
  }
};

const updateTotalSpent = async (
  collection: string,
  uid: string,
  price: number
) => {
  try {
    const userRef = db.collection(collection).doc(uid);
    await userRef.update({
      totalSpent: FieldValue.increment(price),
      updatedAt: FieldValue.serverTimestamp(),
    });
  } catch (error) {
    throw new ApiError(
      500,
      "Unable to update total orders.",
      null,
      error as string[]
    );
  }
};

const getUserFromDatabase = async (
  uid: string,
  path: "customer" | "admin" | "chef"
) => {
  const userRef = db.collection(`${path}`).doc(uid);
  try {
    const userDoc = await userRef.get();
    if (!userDoc.exists)
      throw new ApiError(404, "No user found. Please sign up or login.");
    const userData = userDoc.data() as UserInfo;
    return userData;
  } catch (error) {
    throw new ApiError(
      500,
      "Error getting user from database.",
      null,
      error as string[]
    );
  }
};

const bulkDeleteUserFromDatabase = async (
  path: "customer" | "admin" | "chef",
  id: string[]
) => {
  const userRef = db.collection(path);
  if (!userRef) throw new ApiError(404, "No collection available.");
  try {
    const batch = db.batch();

    id.forEach((userId) => {
      const docRef = userRef.doc(userId);
      batch.delete(docRef);
    });
    await batch.commit();
  } catch (error) {
    throw new ApiError(
      500,
      "Unable to bulk delete users data.",
      null,
      error as string[]
    );
  }
};

const getUsersFromDatabase = async (
  path: "customer" | "admin" | "chef",
  pageSize: number,
  filter: keyof UserInfo = "createdAt",
  sort: "asc" | "desc" = "asc",
  startAfterDoc: any | null = null,
  startAtDoc: any | null = null,
  direction?: "prev" | "next"
) => {
  try {
    const { query, totalLength } = await paginateFnc(
      path,
      filter,
      startAfterDoc,
      startAtDoc,
      pageSize,
      sort,
      direction
    );
    const usersDoc = await query.get();
    const users: UserInfo[] = [];

    usersDoc.docs.forEach((doc) => {
      users.push(doc.data() as UserInfo);
    });

    const firstDoc = usersDoc.docs[0]?.data().uid || null;
    const lastDoc = usersDoc.docs[usersDoc.docs.length - 1]?.data().uid || null;

    return {
      users,
      firstDoc,
      lastDoc,
      length: totalLength,
    };
  } catch (error) {
    throw new ApiError(
      500,
      "Error fetching users from database.",
      null,
      error as string[]
    );
  }
};

const findUserInDatabase = async (id: string) => {
  const collections = ["customer", "admin", "chef"];
  let foundUser: UserInfo | undefined = undefined;
  try {
    for (const collection of collections) {
      const docRef = db.collection(collection).doc(id);
      const doc = await docRef.get();

      if (doc.exists) {
        foundUser = doc.data() as UserInfo;
        break;
      }
    }
    if (!foundUser) throw new ApiError(404, "User not found.");
    return foundUser;
  } catch (error) {
    throw new ApiError(
      500,
      "Error finding user in database.",
      null,
      error as string[]
    );
  }
};
const searchUserInDatabase = async (query: string) => {
  try {
    const customerSnapshot = await searchItemInDatabase(
      "customer",
      query,
      "fullName",
      5
    );

    const chefSnapshot = await searchItemInDatabase(
      "chef",
      query,
      "fullName",
      5
    );
    const adminSnapshot = await searchItemInDatabase(
      "admin",
      query,
      "fullName",
      5
    );
    let searchResult: UserInfo[] = [
      ...customerSnapshot.docs.map((doc) => ({
        ...(doc.data() as UserInfo),
      })),
      ...chefSnapshot.docs.map((doc) => ({
        ...(doc.data() as UserInfo),
      })),
      ...adminSnapshot.docs.map((doc) => ({
        ...(doc.data() as UserInfo),
      })),
    ];

    searchResult.sort((a, b) => {
      return a.fullName.localeCompare(b.fullName);
    });
    searchResult = searchResult.slice(0, 9);

    return searchResult;
  } catch (error) {
    throw new ApiError(500, "Error while searching user based on username.");
  }
};

export {
  addUserToFirestore,
  deleteUserFromFireStore,
  updateUserDataInFirestore,
  getUserFromDatabase,
  bulkDeleteUserFromDatabase,
  getUsersFromDatabase,
  findUserInDatabase,
  updateTotalOrder,
  updateTotalSpent,
  searchUserInDatabase,
};
