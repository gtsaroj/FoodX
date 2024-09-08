import { FieldValue } from "firebase-admin/firestore";
import { User, AccessType, UserInfo } from "../../models/user.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { db } from "../index.js";
import { paginateFnc } from "../utils.js";

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
  filter: keyof User,
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

export {
  addUserToFirestore,
  deleteUserFromFireStore,
  updateUserDataInFirestore,
  getUserFromDatabase,
  bulkDeleteUserFromDatabase,
  getUsersFromDatabase,
};
