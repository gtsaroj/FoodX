import { QueryDocumentSnapshot } from "firebase-admin/firestore";
import { User, AccessType } from "../../models/user.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { db } from "../index.js";
import { paginateFnc } from "../utils.js";

const addUserToFirestore = async (
  user: User,
  access: AccessType["privilage"]
) => {
  if (!user) throw new ApiError(401, "No data to update the database.");
  const customerDocRef = db.collection(access);
  if (!customerDocRef) throw new ApiError(501, "No document found.");
  try {
    const oldUser = await customerDocRef.where("uid", "==", user.uid).get();
    if (oldUser.size !== 0) throw new ApiError(400, "User already exist.");
    await customerDocRef.doc(user.uid).set(user);
  } catch (error) {
    throw new ApiError(
      400,
      "Something went wrong while adding user to the database."
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
    throw new ApiError(401, "Unable to delete user from database.");
  }
};

const updateUserDataInFirestore = async (
  uid: string,
  access: AccessType["privilage"],
  field: keyof User,
  data: string
) => {
  const customerDocRef = db.collection(access).doc(uid);
  if (!customerDocRef)
    throw new ApiError(400, "User doesnt exist in the database.");
  try {
    const userDoc = await customerDocRef.get();
    const docData = userDoc.data();
    if (!docData)
      throw new ApiError(401, "Unable to fetch data from database.");

    await customerDocRef.update({
      [`${field}`]: data,
    });
  } catch (error) {
    console.error(error);
    throw new ApiError(400, "Unable to update data.");
  }
};

// const getUserFromDatabase = async (uid: string) => {
//   try {
//     const userRef = db.collection("customer").doc(uid);
//     const adminRef = db.collection("admin").doc(uid);

//     const customerInfo = await userRef.get();
//     const adminInfo = await adminRef.get();
//     if (customerInfo.exists) {
//       const customerData = customerInfo.data() as User;
//       return customerData;
//     } else if (adminInfo.exists) {
//       const adminData = adminInfo.data() as User;
//       return adminData;
//     }
//     throw new ApiError(404, "No user found. Please sign up or login");
//   } catch (error) {
//     console.error(error);
//     throw new ApiError(404, "User not found.");
//   }
// };
const getUserFromDatabase = async (
  uid: string,
  path: "customer" | "admin" | "chef"
) => {
  const userRef = db.collection(`${path}`).doc(uid);
  try {
    const userDoc = await userRef.get();
    if (!userDoc.exists)
      throw new ApiError(404, "No user found. Please sign up or login.");
    const userData = userDoc.data() as User;
    return userData;
  } catch (error) {
    console.error(error);
    throw new ApiError(500, "Error getting user from database.");
  }
};

const bulkDeleteUserFromDatabase = async (
  path: "customer" | "admin" | "chef",
  id: string[]
) => {
  const userRef = db.collection(path);
  if (!userRef) throw new ApiError(400, "No collection available.");
  try {
    const batch = db.batch();

    id.forEach((userId) => {
      const docRef = userRef.doc(userId);
      batch.delete(docRef);
    });
    await batch.commit();
  } catch (error) {
    throw new ApiError(401, "Unable to bulk delete users data.");
  }
};

// const getUsersFromDatabase = async (
//   path: "customer" | "admin" | "chef",
//   lastVisible: QueryDocumentSnapshot | null,
//   pageSize: number,
//   filter: keyof User,
//   sort: "asc" | "desc" = "asc"
// ) => {
//   const userRef = db.collection(path);
//   const query = userRef.orderBy(filter, sort).limit(pageSize);
//   try {
//     if (lastVisible) query.startAfter(lastVisible);
//     const userDoc = await query.get();
//     if (userDoc.empty) throw new ApiError(404, "No users found.");

//     const users: User[] = [];
//     userDoc.docs.forEach((doc) => {
//       users.push(doc.data() as User);
//     });

//     const lastDoc = userDoc.docs[userDoc.docs.length - 1] || null;

//     return { users, lastDoc };
//   } catch (error) {
//     throw new ApiError(
//       500,
//       "Error while getting users from database.",
//       null,
//       error as string[]
//     );
//   }
// };

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
    const query = paginateFnc(
      path,
      filter,
      startAfterDoc,
      startAtDoc,
      pageSize,
      sort,
      direction
    );
    const usersDoc = await query.get();
    const users: User[] = [];

    usersDoc.docs.forEach((doc) => {
      users.push(doc.data() as User);
    });

    const firstDoc = usersDoc.docs[0]?.data().uid || null;
    const lastDoc = usersDoc.docs[usersDoc.docs.length - 1]?.data().uid || null;
    const length = usersDoc.docs.length;

    return {
      users,
      firstDoc,
      lastDoc,
      length,
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
